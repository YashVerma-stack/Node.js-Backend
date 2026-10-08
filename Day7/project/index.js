import {
    initializeNotesDirectory,
    addNote,
    listNotes,
    readNote,
    deleteNote
} from "./noteManager.js";

function showHelp() {
    console.log(`
Student Notes CLI

Usage:

  npm start add "your note"
      Add a new note

  npm start list
      List all notes

  npm start read <id>
      Read a specific note

  npm start delete <id>
      Delete a specific note

  npm start help
      Show this help message
`);
}


await initializeNotesDirectory();

console.log("Notes CLI is ready!");

const command = process.argv[2];


if (command === "help" || !command) {
    showHelp();
    process.exit(0);
}

// ADD
if (command === "add") {

    const content = process.argv.slice(3).join(" ");

    if (!content) {
        console.log("Please provide note content.");
        process.exit(1);
    }

    try {
        const id = Date.now();

        await addNote(id, content);

        console.log("Note created successfully");
        console.log(`Note ID: ${id}`);

    } catch (error) {
        console.log("Failed to create note.");
    }

}


// LIST
else if (command === "list") {

    try {
        const files = await listNotes();

        if (files.length === 0) {
            console.log("No notes found.");
            process.exit(0);
        }

        console.log("Notes:");

        for (const file of files) {
            console.log(file);
        }

    } catch (error) {
        console.log("Failed to list notes.");
    }

}


// READ
else if (command === "read") {

    const id = process.argv[3];

    if (!id) {
        console.log("Please provide a note ID.");
        process.exit(1);
    }

    try {

        const content = await readNote(id);

        console.log();
        console.log("----- NOTE -----");
        console.log(content);
        console.log("----------------");

    } catch (error) {

        if (error.code === "ENOENT") {
            console.log(`Error: Note with ID ${id} does not exist.`);
        } else {
            console.log("Failed to read note.");
        }

    }

}


// DELETE
else if (command === "delete") {

    const id = process.argv[3];

    if (!id) {
        console.log("Please provide a note ID.");
        process.exit(1);
    }

    try {

        await deleteNote(id);

        console.log(`Note ${id} deleted successfully.`);

    } catch (error) {

        if (error.code === "ENOENT") {
            console.log(`Error: Note with ID ${id} does not exist.`);
        } else {
            console.log("Failed to delete note.");
        }

    }

}

else {
    console.log(`Unknown command: ${command}`);
    showHelp();
    process.exit(1);
}