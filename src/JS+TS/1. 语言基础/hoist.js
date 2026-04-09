import chalk from "chalk"; // ESM 模块默认导出，使用 CJS 引入
console.log(chalk.yellow(`=====================`));
console.log(chalk.yellow(`变量提升`));
console.log(chalk.yellow(`=====================`));

function varHoistDemo() {
  console.log("=====================");
  console.log(chalk.blue("var 有变量提升"));
  console.log(`test 的值 -`, test);
  var test = 1;
  console.log(`test 的值 -`, test);
}

varHoistDemo();

function letHoistDemo() {
  console.log("=====================");
  console.log(chalk.red("let 没有变量提升"));
  console.log(`test 的值`, test);
  let test = 1;
  console.log(`test 的值`, test);
}

try {
  letHoistDemo();
} catch (error) {
  /** @type {Error} */
  const c = error;
  console.log(`${c.name}: ${c.message}`);
}

console.log(chalk.yellow(`=====================`));
