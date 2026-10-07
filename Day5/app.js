const os = require('os');

console.log('-------------System Diagnostics-------------');

console.log('os platform: ', os.platform());
console.log('CPU Architecture: ', os.arch());
console.log('Hostname: ', os.hostname());
console.log('CPU Cores: ', os.cpus().length);

console.log(
    'total memory: ', (os.totalmem() / 1024 / 1024 / 1024).toFixed(2), 'GB'
);

console.log('Free memory: ', (os.freemem() / 1024 / 1024 / 1024).toFixed(2), 'GB');

console.log("System U[time: ", (os.uptime() / 3600).toFixed(2), 'hours');


console.log('----------------------Node Process-------------------')


console.log("Node Version:", process.version);
console.log("Process ID:", process.pid);
console.log("Process Platform:", process.platform);
console.log("Process Architecture:", process.arch);

console.log(
    "Process Uptime:",
    process.uptime().toFixed(2),
    "seconds"
);

console.log("--------------- MEMORY USAGE -------------");

const memory = process.memoryUsage();

console.log(
    "RSS:",
    (memory.rss / 1024 / 1024).toFixed(2),
    "MB"
);

console.log(
    "Heap Used:",
    (memory.heapUsed / 1024 / 1024).toFixed(2),
    "MB"
);

console.log(
    "Heap Total:",
    (memory.heapTotal / 1024 / 1024).toFixed(2),
    "MB"
);


const args = process.argv.slice(2);

console.log("--------------- CLI ARGUMENTS -------------");

if (args.length === 0) {
    console.log("No arguments provided.");
} else {
    console.log("Arguments:", args);
}

let port = 3000;
for (const arg of args) {
    if (arg.startsWith("--port=")) {
        port = arg.split('=')[1];
    }
}

console.log("port: ", port);

console.log('----------- Environment---------');

console.log(
    "APP_NAME: ",
    process.env.APP_NAME || 'Not Provided'
);

