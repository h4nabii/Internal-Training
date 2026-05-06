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
  const xhList = ["20210003", "20210004"];

  console.log("\n\n函数1（错误顺序）");
  console.log("====================================");
  for (const xh of xhList) {
    getUser(xh, (user) => {
      const userId = user.id;
      console.log(`| 用户 ${user.name}（ID: ${user.id}）` + `的书籍列表：`);
      getUserBooks(userId, (books) => {
        for (const book of books) {
          console.log("====================================");
          console.log(`| ${book.name}（ID: ${book.id}）`);
          getBookComments(book.id, (comments) => {
            for (const comment of comments) {
              console.log(`| - ${comment.message}（ID: ${comment.id}）`);
            }
          });
        }
      });
      console.log("====================================");
    });
  }
})();

(() => {
  const xhList = ["20210001", "20210002"];

  let users: UserWithBooks[] = [];

  for (let i = 0; i < xhList.length; i++) {
    const xh = xhList[i]!;
    getUser(xh, (user) => {
      users.push(user);
      const u: UserWithBooks = user;
      getUserBooks(u.id, (books) => {
        u.books = books;
        for (let j = 0; j < books.length; j++) {
          const book = books[j]! as BookWithComments;
          getBookComments(book.id, (comments) => {
            book.comments = comments;

            // 这段在循环内部，需要判断是否是最后一个回调，才能输出结果
            // 如果要把这段放在循环外面，数据完整性就需要额外的状态变量来控制了，代码会更复杂
            if (j === books.length - 1) {
              if (i === users.length - 1) {
                // 收集数据后输出
                console.log("\n\n函数2（正确顺序）");
                for (const user of users) {
                  console.log("====================================");
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
              }
            }
          });
        }
      });
    });
  }
})();

(async () => {
  // 使用 Promise 和 async/await 来重构上面的代码，避免回调地狱

  const xhList = ["20210001", "20210002"];
  const users: UserWithBooks[] = await Promise.all(xhList.map((xh) => getUser(xh)));
  for (const user of users) {
    user.books = await getUserBooks(user.id);
    for (const book of user.books) {
      book.comments = await getBookComments(book.id);
    }
  }

  console.log("\n\n函数3（使用 Promise 和 async/await）");
  for (const user of users) {
    console.log("====================================");
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
