import fs from "node:fs";
import { Transform } from "node:stream";

const upperCaseTransform = new Transform({

    transform(chunk, encoding, callback) {

        const text = chunk.toString();

        const upperCaseText = text.toUpperCase();

        callback(null, upperCaseText);
    }

});

const readableStream = fs.createReadStream("./input.txt");

const writableStream = fs.createWriteStream("./output.txt");

readableStream
    .pipe(upperCaseTransform)
    .pipe(writableStream);

writableStream.on("finish", () => {
    console.log("File transformed successfully.");
});

readableStream.on("error", (error) => {
    console.log("Read error:", error.message);
});

writableStream.on("error", (error) => {
    console.log("Write error:", error.message);
});