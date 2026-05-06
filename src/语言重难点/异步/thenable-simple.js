/**
 * 最简单的可 await 对象（仅用于教学演示）
 * 任何带有 then 方法的对象（thenable）都可以被 await
 */
class SimpleAwaitable {
  constructor(delay, value) {
    this.delay = delay;
    this.value = value;
  }

  // 只需要这一个方法！await 会自动调用它
  then(onFulfilled, onRejected) {
    // 在指定延迟后调用 onFulfilled（成功回调）
    setTimeout(() => {
      onRejected(this.value);
    }, this.delay);
  }
}

// 使用示例
async function demo() {
  console.log("开始等待...");
  const result = await new SimpleAwaitable(1000, "Hello, 教学版!");
  console.log(result); // 1秒后输出: Hello, 教学版!
}

void demo();
