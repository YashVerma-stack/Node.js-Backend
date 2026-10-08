import fs from "node:fs/promises";
import path from "node:path";

const NOTES_DIR = path.join(process.cwd(), "notes");

async function initializeNotesDirectory() {
    await fs.mkdir(NOTES_DIR, {
        recursive: true
    });
}

async function addNote(id, content) {
    const filePath = path.join(NOTES_DIR, `${id}.md`);
    await fs.writeFile(filePath, content, 'utf-8');

    return filePath;
}

async function listNotes() {
    const files = await fs.readdir(NOTES_DIR);

    return files;
}

async function readNote(id) {
    const filePath = path.join(NOTES_DIR, `${id}.md`);

    return await fs.readFile(filePath, "utf-8");
}

async function deleteNote(id) {
    const filePath = path.join(NOTES_DIR, `${id}.md`);

    await fs.unlink(filePath);
}


export {initializeNotesDirectory, addNote, listNotes, readNote, deleteNote};
