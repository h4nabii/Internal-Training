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

(() => {
  const xhList = ["20210001", "20210002"];
  let currentIndex = 0;

  console.log("\n\n函数2（正确顺序 - 纯回调串行）");
  console.log("====================================");

  function processNextUser() {
    if (currentIndex >= xhList.length) return;

    const xh = xhList[currentIndex]!;
    getUser(xh, (user) => {
      console.log(`| 用户 ${user.name}（ID: ${user.id}）的书籍列表：`);

      getUserBooks(user.id, (books) => {
        let completedBooks = 0;
        const totalBooks = books.length;

        books.forEach((book, idx) => {
          getBookComments(book.id, (comments) => {
            console.log("====================================");
            console.log(`| ${book.name}（ID: ${book.id}）`);
            comments.forEach((comment) => {
              console.log(`| - ${comment.message}（ID: ${comment.id}）`);
            });

            completedBooks++;
            if (completedBooks === totalBooks) {
              console.log("====================================");
              currentIndex++;
              processNextUser();
            }
          });
        });
      });
    });
  }

  processNextUser();
})();
