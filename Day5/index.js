console.log("Directory:", __dirname);

console.log("File:", __filename);

console.log("Current Working Directory:", process.cwd());

console.log("Node Version:", process.version);

console.log("Process ID:", process.pid);

console.log("Platform:", process.platform);

console.log("Architecture:", process.arch);

console.log(
    "Process Uptime:",
    process.uptime(),
    "seconds"
);

const memory = process.memoryUsage();

console.log("Memory Usage:", memory);

console.log("Arguments:", process.argv);

const args = process.argv.slice(2);

for (const arg of args) {
    console.log("Received:", arg);
}

