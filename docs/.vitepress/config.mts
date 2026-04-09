import { defineConfig } from "vitepress";

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "技术培训",
  description: "JS+TS基础和重难点讲解",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [{ text: "首页", link: "/" }],

    sidebar: [
      {
        text: "语言基础",
        items: [{ text: "变量声明（var, let, const）", link: "/语言基础/变量声明" }, { text: "Runtime API Examples" }]
      },
      {
        text: "重难点",
        items: [{ text: "变量声明（var, let, const）" }, { text: "Runtime API Examples" }]
      }
    ]

    // socialLinks: [{ icon: "github", link: "https://github.com/vuejs/vitepress" }]
  },
  markdown: {
    lineNumbers: true
  }
});
