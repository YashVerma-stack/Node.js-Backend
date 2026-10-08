// import orderEvents from "./orderEvents.js";

// orderEvents.on("orderCreated", (order) => {
//     console.log(`Order ${order.id} created.`);
// });

// orderEvents.on("orderCreated", (order) => {
//     console.log(`Sending confirmation email to ${order.email}`);
// });

// orderEvents.on("orderCreated", (order) => {
//     console.log(`Updating inventory for order ${order.id}`);
// });


// // const order = {
// //     id: 101,
// //     email: "yash@example.com",
// //     product: "Laptop"
// // };

// // orderEvents.emit("orderCreated", order);



// import fs from "node:fs";

// // Create a readable stream
// const readableStream = fs.createReadStream("./large.txt", {
//     encoding: "utf-8"
// });

// // Create a writable stream
// const writableStream = fs.createWriteStream("./copy.txt", {
//     encoding: "utf-8"
// });

// // Handle readable stream errors
// readableStream.on("error", (error) => {
//     console.log("Read error:", error.message);
// });

// // Handle writable stream errors
// writableStream.on("error", (error) => {
//     console.log("Write error:", error.message);
// });

// // Pipe readable stream into writable stream
// readableStream.pipe(writableStream);

// // When writing is finished
// writableStream.on("finish", () => {
//     console.log("File copied successfully.");
// });



import { Duplex } from "node:stream";

const duplexStream = new Duplex({

    read(size) {
        this.push("Data coming from readable side\n");
        this.push(null);
    },

    write(chunk, encoding, callback) {
        console.log("Data received:", chunk.toString());

        callback();
    }

});

duplexStream.on("data", (chunk) => {
    console.log("Read:", chunk.toString());
});

duplexStream.write("Hello from writable side");

duplexStream.end();