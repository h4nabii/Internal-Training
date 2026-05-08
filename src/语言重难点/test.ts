console.log("同步代码开始");

setTimeout(() => {
  console.log("延时任务1（宏任务）");

  Promise.resolve()
    .then(() => {
      console.log("Promise3（微任务）");
    })
    .then(() => {
      console.log("Promise4（微任务）");
    });
}, 0);

setTimeout(() => {
  console.log("延时任务2（宏任务）");
}, 0);

Promise.resolve()
  .then(() => {
    console.log("Promise1（微任务）");
  })
  .then(() => {
    console.log("Promise2（微任务）");
  });

console.log("同步代码结束");
