import fs from "node:fs";
import { pipeline } from "node:stream/promises";

import cleaner from "./cleaner.js";

const inputFile = "./input.txt";
const outputFile = "./output.txt";

const readableStream = fs.createReadStream(inputFile, {
    encoding: "utf-8"
});

const writableStream = fs.createWriteStream(outputFile, {
    encoding: "utf-8"
});

try {

    await pipeline(
        readableStream,
        cleaner,
        writableStream
    );

    console.log("Stream cleaning completed.");
    console.log(`Cleaned file created: ${outputFile}`);

} catch (error) {

    console.log(
        "Stream processing failed:",
        error.message
    );

}