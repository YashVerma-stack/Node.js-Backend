// import path from "node:path";
import { writeFile } from "node:fs";
import fs from "node:fs/promises";

// // const filePath = path.join("data", "notes", "note.txt");
// const filePath = path.resolve("data", "notes", "note.txt");

// // console.log(completePath);
// console.log("Full path:", filePath);
// console.log("Directory:", path.dirname(filePath))

// console.log("File name:", path.basename(filePath));

// console.log("Extension:", path.extname(filePath));




await fs.mkdir("data/notes", {
    recursive: true
});

await fs.writeFile(
    "data/notes/first-note.md",
    "# My First Note\n\nLearning Node.js filesystem."
);

const content = await fs.readFile(
    "data/notes/first-note.md",
    "utf-8"
);

// console.log("File created!");

await fs.appendFile(
    "data/notes/first-note.md",
    "## progress\n\nToday I learned fs/promise"
);

console.log(content)