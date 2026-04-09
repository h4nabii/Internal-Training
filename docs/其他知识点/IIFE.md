---
prev: false
next: false
---

# 立即执行函数表达式

立即执行函数表达式（Immediately Invoked Function Expression，IIFE）是一种 JavaScript 设计模式，用于创建一个匿名函数并立即执行它。IIFE 的主要目的是创建一个新的作用域，避免变量污染全局作用域。常用作为模块化代码的一种方式，或者在需要立即执行某段代码但又不想暴露变量到全局时使用。

## 语法

IIFE 的基本语法如下，通过将函数包裹在圆括号中并在末尾加上圆括号来立即执行：

```js
// 匿名函数表达式
(function () {
  // 这里是 IIFE 的函数体
})();

// 具名函数表达式
(function myIIFE() {
  // 这里是 IIFE 的函数体
})();

// 箭头函数表达式
(() => {
  // 这里是 IIFE 的函数体
})();
```

IIFE 是一个非常有用的模式，但在现代 JavaScript 中，随着模块化系统（如 ES6 模块）的引入，IIFE 的使用已经不如以前那么普遍了。然而，在某些特定场景下，如需要兼容旧环境或快速封装代码时，IIFE 仍然是一个有效的工具。

::: info

如果你看过 Animate 生成的 JavaScript 代码，你会发现 index.js 中就是一个巨大的 IIFE

Animate 通过在 IIFE 中注入 `createjs` 和 `AdobeAn` 这两个对象，来实现对两个对象的初始化和模块化的代码结构，避免全局变量的污染

```js
(function (cjs, an) {
  // animate 生成的代码
  // ...
})((createjs = createjs || {}), (AdobeAn = AdobeAn || {}));
var createjs, AdobeAn;
```

:::
