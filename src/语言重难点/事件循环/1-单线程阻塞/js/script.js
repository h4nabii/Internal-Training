const MAX_NUM = 20000000; // 计算范围：2 ~ MAX_NUM 之间的质数个数（1270607 个）

function isPrime(num) {
  if (num < 2) return false;
  if (num === 2) return true;
  if (num % 2 === 0) return false;
  const limit = Math.sqrt(num);
  for (let i = 3; i <= limit; i += 2) {
    if (num % i === 0) return false;
  }
  return true;
}

function countPrimes() {
  let count = 0;
  for (let i = 2; i <= MAX_NUM; i++) {
    if (isPrime(i)) count++;
  }
  return count;
}

const syncBtn = document.querySelector(".sync-btn");
syncBtn.addEventListener("click", () => {
  syncBtn.disabled = true;
  const primeCount = countPrimes();
  updateMsg(`共有 ${primeCount} 个质数在 2 ~ ${MAX_NUM} 之间`);
  syncBtn.disabled = false;
});

const msgDiv = document.querySelector(".msg");
function updateMsg(msg) {
  msgDiv.textContent = msg;
}
