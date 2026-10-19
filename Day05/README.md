### Is Node.js single-threaded ?
- Node.js executes JavaScript on a single main thread, while libuv can use background threads for certain operations

## What is the Event Loop ?
The `event loop` allows Node.js to perform asynchromous operation without blocking the main JavaScript thread.

## Event Loop Phases
# `Important Phases`

- `Timers` -> Handles callbacks scheduled by `setTimeout()` and `setIntervals()`

- `Poll` -> The poll phase handles many I/O-related callbacks

- `Check` -> The check phase handles `setImmediate()`

- `Close` -> It is used for close events

## Node.js Runtime Globals
- `Node.js` provides some global objects that you can use without importing them.

examples -> `process`, `__dirname`, `__filename`, `global`, `console`, `Buffer`, `setTimeout`, `setImmediate`, `setInterval`

## process
- `process` is one of the most important Node.js globals
- It gives you information and control over the current Node.js process

## processs.env
- `process.env` contains environment variables.
- we can access a specific variable using the `console.log(process.env.PORT)`

- `__dirname` give you the directory path of the currnt javascript file

- `__filenme` gives the complete path of the current file

## process.argv
- `process.argv` contains command-line arguments
- If we run `console.log(process.argv)` then we will get an arrat containg the Node's executable path and our script path

## process.exit()
- We can terminate the Node.js process using the `process.exit()`

- `process.exit(1/0)` the number is an exit code.
- 0 -> Success
- 1 -> Error / failure

## process.memoryUsage()
- this tells you about Node.js memory usage
- If we run `console.log(process.memoryUsage())` then we get 
{
    rss: xxxxxx,
    heapTotal: xxxxxxx,
    heapUsed: xxxxxxxx,
    external: xxxxxxxx,
    arrayBuffers: xxxxxx
}

- `rss` -> Resident Set Size - Toal memory allocated for the process in RAM
- `heapUsed` -> JS heap memory currently being used.
-  `heapTotal` -> Total js heap allocated.

## process.platform
- This tells us that which operating system we are running
- `console.log(process.platform)` -> win32, linux, darwin

## process.arch 
- This tells us the CPU architecture
- `console.log(process.arch)` -> x64

## process.vesion
- It shows the Node.js vesion
- `console.log(procss.version)` -> vxx.xx.x


## process.uptime()
- Shows how many seconds the current Node.js process has  been running.
console.log(process.uptime());

Example:
2.145

Meaning the process has been running for approximately 2.1 seconds.