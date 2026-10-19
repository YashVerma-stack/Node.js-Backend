const promise = new Promise((resolve, reject) => {
    const success = true;

    if (success) {
        resolve("successful");
    } else {
        reject('operation failed');
    }
});

promise.then((result) => {  // then handles a successful promise
    console.log(result);
})
    .catch((error) => {     // .catch() handles rejection/errors.
        console.log(error);
    })
    .finally(() => {
        console.log('operation completeed');
    });

// promise chaining

Promise.resolve(10)
    .then((value) => {
        return value * 2;
    })
    .then((value) => {
        return value + 5
    })
    .then((value) => {
        console.log(value);
    });


function delay(ms) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}

console.log('start');

delay(2000).then(() => {
    console.log('2 seconds completed');
});
