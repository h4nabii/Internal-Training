export type User = { id: number; name: string; xh: string };
export type Book = { id: number; name: string };
export type BookComment = { id: number; bookId: number; message: string };

export async function getUser(xh: string, callback?: (user: User) => void) {
  const user = userLib.find((u) => u.xh === xh);
  if (!user) throw new Error(`未找到学号为 ${xh} 的用户`);
  setTimeout(() => {
    callback?.(user);
  }, 1000);
  return user;
}

export async function getUserBooks(userId: number, callback?: (books: Book[]) => void) {
  const bookIds = userBookMap.get(userId) || [];
  const books = bookIds.map((bookId) => bookLib.find((b) => b.id === bookId)).filter((b) => b !== undefined);
  setTimeout(() => {
    callback?.(books);
  });
  return books;
}

export async function getBookComments(bookId: number, callback?: (comments: BookComment[]) => void) {
  const comments = bookCommentLib.filter((c) => c.bookId === bookId);
  setTimeout(() => {
    callback?.(comments);
  });
  return comments;
}

// ==================== 用户数据 ====================
export const userLib: User[] = [
  { id: 1, name: "张明", xh: "20210001" },
  { id: 2, name: "李芳", xh: "20210002" },
  { id: 3, name: "王磊", xh: "20210003" },
  { id: 4, name: "赵敏", xh: "20210004" },
  { id: 5, name: "陈晨", xh: "20210005" },
  { id: 6, name: "周杰", xh: "20210006" },
  { id: 7, name: "吴迪", xh: "20210007" },
  { id: 8, name: "郑爽", xh: "20210008" },
  { id: 9, name: "林楠", xh: "20210009" },
  { id: 10, name: "郭峰", xh: "20210010" },
];

// ==================== 书籍数据 ====================
export const bookLib: Book[] = [
  { id: 1, name: "《JavaScript 高级程序设计（第4版）》" },
  { id: 2, name: "《你不知道的 JavaScript（上卷）》" },
  { id: 3, name: "《ES6 标准入门（第3版）》" },
  { id: 4, name: "《Node.js 实战（第2版）》" },
  { id: 5, name: "《TypeScript 编程》" },
  { id: 6, name: "《Vue.js 设计与实现》" },
  { id: 7, name: "《React 进阶之路》" },
  { id: 8, name: "《Web 性能权威指南》" },
  { id: 9, name: "《HTTP 权威指南》" },
  { id: 10, name: "《算法（第4版）》" },
];

// ==================== 用户-书籍 映射 ====================
export const userBookMap = new Map<number, number[]>([
  [1, [1, 2, 3]],
  [2, [4, 5]],
  [3, [6, 7, 8]],
  [4, [2, 3, 4, 6]],
  [5, [1]],
  [6, [4, 5, 6, 7]],
  [7, [2, 3, 5, 8]],
  [8, [1, 2, 5, 7, 9]],
  [9, [5, 7]],
  [10, [1, 10]],
]);

// ==================== 书籍评论数据 ====================
export const bookCommentLib: BookComment[] = [
  { id: 1, bookId: 1, message: "红宝书就是经典！讲解非常透彻。" },
  { id: 2, bookId: 1, message: "当年学 JS 就是靠这本书，强烈推荐。" },
  { id: 3, bookId: 1, message: "内容有点旧了，但基础部分依然很棒。" },
  { id: 4, bookId: 2, message: "作用域和闭包讲得太好了，必读。" },
  { id: 5, bookId: 2, message: "适合有一定基础的人，深度足够。" },
  { id: 6, bookId: 3, message: "阮老师的 ES6 入门，前端人手一本。" },
  { id: 7, bookId: 3, message: "很全面，例子也很多。" },
  { id: 8, bookId: 4, message: "Node.js 实战项目很实用。" },
  { id: 9, bookId: 4, message: "部分 npm 包版本过时了，但思路值得学习。" },
  { id: 10, bookId: 5, message: "TS 入门的绝佳选择，例子清晰。" },
  { id: 11, bookId: 5, message: "看完这本书再也不用 any 了😂" },
  { id: 12, bookId: 6, message: "深入分析 Vue 3 源码，非常硬核。" },
  { id: 13, bookId: 6, message: "需要一定前端基础，但读完后收获巨大。" },
  { id: 14, bookId: 7, message: "React 核心概念 + 实战，适合中高级开发。" },
  { id: 15, bookId: 7, message: "Hooks 部分讲得很详细。" },
  { id: 16, bookId: 8, message: "性能优化的经典书，网络、渲染都涉及了。" },
  { id: 17, bookId: 8, message: "虽然有点老，但核心原理不会过时。" },
  { id: 18, bookId: 9, message: "HTTP 协议必读，Web 开发基础。" },
  { id: 19, bookId: 9, message: "图文并茂，很容易理解。" },
  { id: 20, bookId: 10, message: "算法入门经典，Java 代码为主但不影响。" },
];
