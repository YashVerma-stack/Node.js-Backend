function greet(name, callback) {
    console.log("Hello " + name);

    callback();
}

function finished() {
    console.log('Greeting completed');
}

// greet('yash', finished);


// Asynchronous callback

function fetchData(callback) {
    setTimeout(() => {
        callback("Data received");
    }, 2000);
}

fetchData((data) => {
    console.log(data);
});



