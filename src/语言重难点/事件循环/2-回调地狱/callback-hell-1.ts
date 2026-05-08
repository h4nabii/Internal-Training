import { getBookComments, getUser, getUserBooks } from "./callback-hell-helper.js";

// (() => {
//   const xhList = ["20210001", "20210002"];
//
//   console.log("\n\n函数1（错误顺序）");
//   console.log("====================================");
//   for (const xh of xhList) {
//     getUser(xh, (user) => {
//       const userId = user.id;
//       console.log(`| 用户 ${user.name}（ID: ${user.id}）` + `的书籍列表：`);
//       getUserBooks(userId, (books) => {
//         for (const book of books) {
//           console.log("====================================");
//           console.log(`| ${book.name}（ID: ${book.id}）`);
//           getBookComments(book.id, (comments) => {
//             for (const comment of comments) {
//               console.log(`| - ${comment.message}（ID: ${comment.id}）`);
//             }
//           });
//         }
//       });
//       console.log("====================================");
//     });
//   }
// })();
