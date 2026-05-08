import { getBookComments, getUser, getUserBooks } from "./callback-hell-helper.js";

(async () => {
  // 使用 Promise 和 async/await 来重构上面的代码，避免回调地狱

  const xhList = ["20210001", "20210002"];
  console.log("====================================");
  for (const xh of xhList) {
    const user = await getUser(xh);
    console.log(`| 用户 ${user.name}（ID: ${user.id}）` + `的书籍列表：`);
    const books = await getUserBooks(user.id);
    for (const book of books) {
      console.log("====================================");
      console.log(`| ${book.name}（ID: ${book.id}）`);
      const comments = await getBookComments(book.id);
      for (const comment of comments) {
        console.log(`| - ${comment.message}（ID: ${comment.id}）`);
      }
    }
    console.log("====================================");
  }
})();
