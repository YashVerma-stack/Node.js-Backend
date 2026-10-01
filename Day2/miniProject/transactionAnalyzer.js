const transactions = [
  {
    id: 1,
    user: "Yash",
    amount: 1500,
    status: "completed"
  },
  {
    id: 2,
    user: "Rahul",
    amount: 2500,
    status: "pending"
  },
  {
    id: 3,
    user: "Aman",
    amount: 800,
    status: "completed"
  },
  {
    id: 4,
    user: "Priya",
    amount: 3200,
    status: "failed"
  },
  {
    id: 5,
    user: "Yash",
    amount: 1800,
    status: "completed"
  }
];

// Find usecase
const transaction = transactions.find(
  (transaction) => transaction.id === 3
);

console.log("Transaction:", transaction);


// Some usecase
const hasPending = transactions.some(
  (transaction) => transaction.status === "pending"
);

console.log("Has pending transaction:", hasPending);

// Evey usecase
const allAmountsValid = transactions.every(
  (transaction) => transaction.amount > 0
);

console.log("All amounts valid:", allAmountsValid);

// filter usecase
const completedTransactions = transactions.filter(
  (transaction) => transaction.status === "completed"
);

console.log("Completed Transactions:");
console.log(completedTransactions);

// reduce usecase
const totalRevenue = completedTransactions.reduce(
  (total, transaction) => total + transaction.amount,
  0
);

console.log("Total Revenue:", totalRevenue);


// map usecase
const completedUsers = completedTransactions.map(
  (transaction) => transaction.user
);

console.log("Completed Transaction Users:");
console.log(completedUsers);

// find highest transaction
const highestTransaction = transactions.reduce(
  (highest, transaction) => {
    if (transaction.amount > highest.amount) {
      return transaction;
    }

    return highest;
  }
);

console.log("Highest Transaction:");
console.log(highestTransaction);

// count transaction by status
const statusCount = transactions.reduce(
  (result, transaction) => {

    result[transaction.status] =
      (result[transaction.status] || 0) + 1;

    return result;

  },
  {}
);

console.log("Transaction Status Count:");
console.log(statusCount);


// safe response
const transactionSummary = transactions.map(
  ({ id, user, amount, status }) => ({
    id,
    user,
    amount,
    status
  })
);

console.log("Transaction Summary:");
console.log(transactionSummary);


