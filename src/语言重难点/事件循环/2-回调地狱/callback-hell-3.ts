import {
  type Book,
  type BookComment,
  getBookComments,
  getUser,
  getUserBooks,
  type User,
} from "./callback-hell-helper.js";

type BookWithComments = Book & { comments?: BookComment[] };
type UserWithBooks = User & { books?: BookWithComments[] };

(async () => {
  // 使用 Promise 和 async/await 来重构上面的代码，避免回调地狱

  const xhList = ["20210001", "20210002"];
  let users: UserWithBooks[] = [];
  for (const xh of xhList) {
    const user: UserWithBooks = await getUser(xh);
    users.push(user);
    user.books = await getUserBooks(user.id);
    for (const book of user.books) {
      book.comments = await getBookComments(book.id);
    }
  }

  console.log("\n\n函数3（使用 Promise 和 async/await）");
  console.log("====================================");
  for (const user of users) {
    console.log(`| 用户 ${user.name}（ID: ${user.id}）` + `的书籍列表：`);
    for (const book of user.books || []) {
      console.log("====================================");
      console.log(`| ${book.name}（ID: ${book.id}）`);
      for (const comment of book.comments || []) {
        console.log(`| - ${comment.message}（ID: ${comment.id}）`);
      }
    }
    console.log("====================================");
  }
})();
