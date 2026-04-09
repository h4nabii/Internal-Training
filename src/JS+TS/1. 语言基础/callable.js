var arr = [5, 4, 3, 2, 1];
function checkItemOfArr(index) {
  // 假设传入的是 1-5，所以在这里统一处理为 0-4
  // 但是使用了 i 作为变量名
  var i = index - 1;

  // ...其他逻辑

  // 在这里需要遍历数组，但错误地使用了 i 作为循环变量
  for (var i = 0; i < 5; i++) {
    // ...其他逻辑
  }

  // 函数要求返回 arr 中对应 index 的元素，但 i 已经被循环覆盖了
  // 返回的永远是 arr[5]，即 undefined

  return arr[i];
}

const a = checkItemOfArr(3);

console.log(a);
