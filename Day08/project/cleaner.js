import { Transform } from "node:stream";

const cleaner = new Transform({
    transform(chunk, encoding, callback) {

        const text = chunk.toString();

        const cleanedText = text
            .replace(/[ \t]+/g, " ")
            .replace(/^ +/gm, "")
            .replace(/ +$/gm, "")
            .replace(/\n{3,}/g, "\n\n");

        callback(null, cleanedText);
    }
});

export default cleaner;