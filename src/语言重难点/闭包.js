function createCounter(max = 10) {
  let count = 0;

  return {
    get value() {
      return count;
    },
    *[Symbol.iterator]() {
      while (count < max) yield count++;
    },
  };
}

const counter = createCounter();

for (const num of counter) {
  console.log(num);
}
