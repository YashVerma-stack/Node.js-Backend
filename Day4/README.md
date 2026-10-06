# Why do we need `asyn/await` ?
- In the `Day 3` we wrote Promise chains which will works but when the number of asynchronous operations increases, Promise chanis can become difficult to follow.


`asyn/await` gives us a syntax that looks much more like normal asynchronous code.

## What is `async`?
- `async` is used before a function
- It tells JavaScrpt that this function works with asynchronous operations and will always return a Promise.

## What is `await`?
`await` is used to wait for a Promise to settle.

## Promise.all()
`Promise.all()`: its main purpose is to wait for all the promises to succeed.

suppose we have three promises if any one of them is rejected, then the Promise.all() rejects immediately

`syntax`: const results = await Promise.all([
    promise1,
    promise2,
    promise3
]);

## What is `throw` ?
`throw` allows us to manually generate an error.
throw new Error("User not found);

## Promise.allSettled()
`Promise.allSettled()` its main purpose is wait for every promise to finish, whether it succeeds or fails.

### Easy Way to Remember

| Feature | `Promise.all()` | `Promise.allSettled()` |
|---|---|---|
| Runs multiple Promises | ✅ | ✅ |
| Waits for all to finish | ❌ If one rejects | ✅ |
| One failure causes overall rejection | ✅ | ❌ |
| Gives success results | ✅ | ✅ |
| Gives failure information | ❌ Overall rejection | ✅ |
| Best when | **All operations are required** | **Each result matters independently** |

### Simple Rule

- **`Promise.all()`** → Use when **all Promises must succeed**.
- **`Promise.allSettled()`** → Use when you want to know the **result of every Promise**, whether it succeeded or failed.


## `Promise.race()`
`Promise.race()`runs multiple Promises and return the result of whichever Promise finished first


Promise A ──────────────── 3 sec
Promise B ───── 1 sec ✅ WINNER
Promise C ────────── 2 sec