import { defineConfig } from "vitepress";

// https://vitepress.dev/reference/site-config
export default defineConfig({
  base: "/internal-training/",
  title: "技术培训",
  description: "JS+TS基础和重难点讲解",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [{ text: "首页", link: "/" }],

    sidebar: [
      {
        text: "语言基础",
        items: [
          { text: "变量声明", link: "/语言基础/变量声明" },
          { text: "基础变量类型", link: "/语言基础/基础变量类型" },
          { text: "高阶函数", link: "/语言基础/高阶函数" },
        ],
      },
      {
        text: "语言重难点",
        items: [{ text: "类", link: "/语言重难点/类" }],
      },
      {
        text: "其他知识点",
        items: [
          { text: "变量提升", link: "/其他知识点/变量提升" },
          { text: "作用域", link: "/其他知识点/作用域" },
          { text: "原型链", link: "/其他知识点/原型链" },
          { text: "函数闭包", link: "/其他知识点/函数闭包" },
          { text: "IIFE（立即执行函数表达式）", link: "/其他知识点/IIFE" },
        ],
      },
    ],

    socialLinks: [{ icon: "github", link: "https://github.com/h4nabii/Internal-Training" }],
  },
  markdown: {
    lineNumbers: true,
  },
});
