/**
 * 严格遵循 Promise/A+ 规范的 Thenable 实现
 * 该类的实例是完全规范的 thenable 对象，可以被 await 关键字正常等待
 */
class Thenable {
  // 内部状态常量
  static #PENDING = 'pending';
  static #FULFILLED = 'fulfilled';
  static #REJECTED = 'rejected';

  constructor(executor) {
    // 初始化状态为 pending
    this.#state = Thenable.#PENDING;
    // 存储终值或拒因
    this.#value = undefined;
    this.#reason = undefined;
    // 成功回调队列和失败回调队列（符合规范：可以多次 then 注册）
    this.#onFulfilledCallbacks = [];
    this.#onRejectedCallbacks = [];

    // 确保 resolve 和 reject 只调用一次（状态凝固）
    let isSettled = false;

    // 将 resolve 和 reject 绑定到实例，并传递改变状态的函数
    const resolve = (value) => {
      if (isSettled) return;
      isSettled = true;
      this.#resolve(value);
    };

    const reject = (reason) => {
      if (isSettled) return;
      isSettled = true;
      this.#reject(reason);
    };

    try {
      // 执行 executor，传入 resolve 和 reject
      executor(resolve, reject);
    } catch (error) {
      // 若 executor 执行抛出异常，自动 reject
      reject(error);
    }
  }

  // 私有字段：状态，值，原因，回调队列
  #state;
  #value;
  #reason;
  #onFulfilledCallbacks;
  #onRejectedCallbacks;

  /**
   * 内部 resolve 方法（规范 2.1 状态变化）
   * @param {*} value 终值，可能是普通值或 thenable 对象
   */
  #resolve(value) {
    // 递归解析 thenable（规范 2.3）
    const resolvePromise = (x, resolve, reject) => {
      // 2.3.1 如果 promise 和 x 指向同一对象，以 TypeError 为拒因拒绝执行
      if (x === this) {
        reject(new TypeError('Chaining cycle detected for promise'));
        return;
      }

      // 2.3.2 如果 x 是一个 promise（或 thenable），采用它的状态
      if (x !== null && (typeof x === 'object' || typeof x === 'function')) {
        let then;
        try {
          // 2.3.3.1 获取 then 方法引用
          then = x.then;
        } catch (error) {
          // 2.3.3.2 如果获取 then 方法抛错，以该错误 reject
          reject(error);
          return;
        }

        // 2.3.3.3 如果 then 是函数，则认为 x 是 thenable，调用它
        if (typeof then === 'function') {
          let called = false;
          try {
            // 2.3.3.3.1 以 x 为 this 调用 then 方法
            then.call(
              x,
              (y) => {
                // 2.3.3.3.3 如果 resolvePromise 和 rejectPromise 都被调用，或者同一参数被多次调用，只第一次有效
                if (called) return;
                called = true;
                // 递归解析 y
                resolvePromise(y, resolve, reject);
              },
              (r) => {
                if (called) return;
                called = true;
                reject(r);
              }
            );
          } catch (error) {
            // 2.3.3.3.4 如果调用 then 方法抛出异常，且之前没有调用过 resolve/reject，则 reject
            if (!called) {
              called = true;
              reject(error);
            }
          }
        } else {
          // 2.3.3.4 then 不是函数，直接 resolve x
          resolve(x);
        }
      } else {
        // 2.3.4 x 不是对象或函数，直接 resolve x
        resolve(x);
      }
    };

    // 将状态改为 fulfilled，并异步执行所有成功回调
    if (this.#state !== Thenable.#PENDING) return;

    // 如果 value 本身是 thenable，需要递归解析（规范 2.3）
    const transition = () => {
      // 使用 resolvePromise 解析 value，确保正确处理 thenable 链
      resolvePromise(
        value,
        (finalValue) => {
          this.#state = Thenable.#FULFILLED;
          this.#value = finalValue;
          this.#runCallbacks('fulfilled');
        },
        (finalReason) => {
          this.#state = Thenable.#REJECTED;
          this.#reason = finalReason;
          this.#runCallbacks('rejected');
        }
      );
    };

    // 根据规范，状态的改变必须异步执行（但这里不需要异步，因为 resolve 通常由用户异步调用）
    // 但为了确保状态转换后回调的执行时机符合微任务规范，在 runCallbacks 中已使用 queueMicrotask
    transition();
  }

  /**
   * 内部 reject 方法
   * @param {*} reason 拒绝原因
   */
  #reject(reason) {
    if (this.#state !== Thenable.#PENDING) return;
    this.#state = Thenable.#REJECTED;
    this.#reason = reason;
    this.#runCallbacks('rejected');
  }

  /**
   * 异步执行回调队列（符合规范：onFulfilled/onRejected 必须以微任务方式调用）
   * @param {'fulfilled'|'rejected'} type 队列类型
   */
  #runCallbacks(type) {
    const callbacks =
      type === 'fulfilled' ? this.#onFulfilledCallbacks : this.#onRejectedCallbacks;
    const valueOrReason = type === 'fulfilled' ? this.#value : this.#reason;

    // 清空队列（规范要求每个回调只被调用一次）
    while (callbacks.length) {
      const callback = callbacks.shift();
      // 使用 queueMicrotask 确保是微任务执行（Promise/A+ 要求异步，建议微任务）
      queueMicrotask(() => {
        callback(valueOrReason);
      });
    }
  }

  /**
   * then 方法（Promise/A+ 规范核心）
   * @param {Function} onFulfilled 成功回调
   * @param {Function} onRejected 失败回调
   * @returns {Thenable} 新的 Thenable 实例，用于链式调用
   */
  then(onFulfilled, onRejected) {
    // 2.2.1 / 2.2.7.3 / 2.2.7.4 值穿透：如果回调不是函数，则忽略并透传值
    const fulfilledHandler =
      typeof onFulfilled === 'function' ? onFulfilled : (value) => value;
    const rejectedHandler =
      typeof onRejected === 'function'
        ? onRejected
        : (reason) => {
          throw reason;
        };

    // 2.2.7 then 方法必须返回一个新的 promise
    const newThenable = new Thenable((resolve, reject) => {
      // 根据当前状态决定如何调用回调
      const handleCallback = (handler, valueOrReason, isFulfilled) => {
        queueMicrotask(() => {
          try {
            // 2.2.7.1 执行回调，获取返回值 x
            const x = handler(valueOrReason);
            // 2.2.7.1 继续解析 x，完成新 promise 的状态切换
            this.#resolvePromise(newThenable, x, resolve, reject);
          } catch (error) {
            // 2.2.7.2 如果回调抛出异常，新 promise 以该错误 reject
            reject(error);
          }
        });
      };

      // 根据当前状态进行调度（规范 2.2.4）
      if (this.#state === Thenable.#FULFILLED) {
        handleCallback(fulfilledHandler, this.#value, true);
      } else if (this.#state === Thenable.#REJECTED) {
        handleCallback(rejectedHandler, this.#reason, false);
      } else {
        // 还是 pending 状态，将回调存入队列，等待状态变更后执行
        this.#onFulfilledCallbacks.push((value) => {
          handleCallback(fulfilledHandler, value, true);
        });
        this.#onRejectedCallbacks.push((reason) => {
          handleCallback(rejectedHandler, reason, false);
        });
      }
    });

    return newThenable;
  }

  /**
   * 内部辅助方法：解析 then 返回的新 promise 和回调执行结果 x
   * 完全遵循 Promise/A+ 规范 2.3 的 resolvePromise 过程
   * @param {Thenable} promise2 then 方法返回的新 promise
   * @param {*} x 回调执行的结果（可能是普通值，thenable，或 promise）
   * @param {Function} resolve promise2 的 resolve 函数
   * @param {Function} reject promise2 的 reject 函数
   */
  #resolvePromise(promise2, x, resolve, reject) {
    // 2.3.1 循环引用检查
    if (promise2 === x) {
      reject(new TypeError('Chaining cycle detected for promise'));
      return;
    }

    // 2.3.2 如果 x 是 promise（这里指 thenable），采用它的状态
    if (x !== null && (typeof x === 'object' || typeof x === 'function')) {
      let then;
      try {
        // 2.3.3.1 获取 then 方法引用
        then = x.then;
      } catch (error) {
        // 2.3.3.2 如果获取 then 抛错，以该错误 reject
        reject(error);
        return;
      }

      // 2.3.3.3 如果 then 是函数，则认为 x 是 thenable 对象
      if (typeof then === 'function') {
        let called = false;
        try {
          // 2.3.3.3.1 以 x 为 this 调用 then 方法
          then.call(
            x,
            (y) => {
              // 2.3.3.3.3 多次调用只取第一次
              if (called) return;
              called = true;
              // 递归解析 y（因为 y 可能又是 thenable）
              this.#resolvePromise(promise2, y, resolve, reject);
            },
            (r) => {
              if (called) return;
              called = true;
              reject(r);
            }
          );
        } catch (error) {
          // 2.3.3.3.4 调用 then 方法抛出异常，且尚未调用过 resolve/reject，则 reject
          if (!called) {
            called = true;
            reject(error);
          }
        }
      } else {
        // 2.3.3.4 then 不是函数，直接 resolve x
        resolve(x);
      }
    } else {
      // 2.3.4 x 不是对象或函数，直接 resolve x
      resolve(x);
    }
  }

  /**
   * 捕获拒绝状态的便捷方法（非规范必须，但实际使用非常普遍）
   * @param {Function} onRejected
   * @returns {Thenable}
   */
  catch(onRejected) {
    return this.then(null, onRejected);
  }

  /**
   * 静态方法：创建一个立即 resolve 的 Thenable 对象
   * @param {*} value 终值
   * @returns {Thenable}
   */
  static resolve(value) {
    // 如果 value 已经是 Thenable 实例，直接返回（规范并不要求返回原实例，但更符合直觉）
    if (value instanceof Thenable) return value;
    return new Thenable((resolve) => resolve(value));
  }

  /**
   * 静态方法：创建一个立即 reject 的 Thenable 对象
   * @param {*} reason 拒绝原因
   * @returns {Thenable}
   */
  static reject(reason) {
    return new Thenable((_, reject) => reject(reason));
  }
}

// ======================== 完整示例和测试 ========================
// 演示1: 使用 await 等待自定义 Thenable 对象
async function testAwait() {
  console.log('1. 创建一个延迟 1.5 秒的 Thenable');
  const delayThenable = new Thenable((resolve) => {
    setTimeout(() => {
      resolve('成功的数据: Hello Promise/A+');
    }, 1500);
  });

  console.log('2. 开始 await (等待约 1.5s) ...');
  const result = await delayThenable;
  console.log('3. await 得到结果:', result);
}

// 演示2: 链式调用 + 错误处理
function testChain() {
  console.log('\n--- 链式调用测试 ---');
  const p = new Thenable((resolve, reject) => {
    console.log('开始异步任务');
    setTimeout(() => resolve(5), 500);
  });

  p.then((val) => {
    console.log(`第一次 then 接收到: ${val}`);
    return val * 2;
  })
    .then((val) => {
      console.log(`第二次 then 接收到: ${val}`);
      // 模拟返回一个延迟的 Thenable
      return new Thenable((resolve) => {
        setTimeout(() => resolve(val + 10), 300);
      });
    })
    .then((val) => {
      console.log(`第三次 then (接收异步 Thenable 结果): ${val}`);
      return Promise.resolve(val * 3); // 与原生 Promise 互操作
    })
    .then((val) => {
      console.log(`第四次 then (原生 Promise 转换后): ${val}`);
    })
    .catch((err) => {
      console.error('捕获到错误:', err);
    });
}

// 演示3: 值穿透和 reject 测试
function testValuePenetration() {
  console.log('\n--- 值穿透与 reject 测试 ---');
  const p = Thenable.reject('初始拒绝原因');
  p.then(null, (reason) => {
    console.log('捕获到拒绝原因:', reason);
    // 注意: 如果第一个 onRejected 没有抛错，后续的 then 会进入 resolve 分支
    return '已处理错误，转为成功值';
  })
    .then((val) => {
      console.log(`穿透后得到成功值: ${val}`);
    })
    .catch((err) => {
      console.error('最终捕获:', err);
    });
}

// 演示4: 循环引用检测 (规范要求)
function testCircular() {
  console.log('\n--- 循环引用检测 ---');
  const p = new Thenable((resolve) => {
    setTimeout(() => resolve(42), 100);
  });
  const p2 = p.then(() => p2); // 返回自身，形成循环引用
  p2.then(null, (err) => {
    console.log('正确检测到循环引用:', err.message === 'Chaining cycle detected for promise');
  });
}

// 执行所有测试
(async () => {
  await testAwait();
  testChain();
  testValuePenetration();
  testCircular();

  // 额外演示：与原生 async/await 配合互操作性
  console.log('\n--- 与原生 Promise 互操作 ---');
  const nativePromise = Promise.resolve('原生Promise的值');
  const mixedThenable = new Thenable((resolve) => {
    resolve(nativePromise); // 解析原生 Promise
  });
  const resultFromMixed = await mixedThenable;
  console.log('混用 Thenable 与原生 Promise 的结果:', resultFromMixed);
})();

// 导出类以供外部使用（如果作为模块）
// export default Thenable;
