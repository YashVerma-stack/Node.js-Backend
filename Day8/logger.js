import fs from "node:fs";

const logStream = fs.createWriteStream("./app.log", {
    flags: "a",
    encoding: "utf-8"
});

function log(message) {
    const timestamp = new Date().toISOString();

    logStream.write(
        `[${timestamp}] ${message}\n`
    );
}

export { log };