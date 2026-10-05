# What is Microtask Queue ?

- The Microtask Queue is a special queue in JavaScript that stores small asynchronous tasks that should run immediately after the current synchronous code finishes, before the event loop moves to other tasks like timers.

The most common things that create microtasks are:
- `Promise.then()`
- `Promise.catch()`
- `Promise.finally()`
- `queueMicrotask()`
- `async/await` (the continuation after `await`)

## What is CallBack and Callback hell ?

- A `Callback` is simply a function passed to another function so that it can be called later.


## What is Event Loop?
- The `Event Loop` continuously checks whether teh js call stack is empty and dertermines which waiting asunchronnous callbacks can be executed.

