function microtask1() {
    console.log('A');

    Promise.resolve().then(() => {
        console.log('B');
    });

    console.log('C');
}

microtask1();

// The output for that code will be A, C, B because JavaScript executes synchronous code first
