function test1() {
    console.log('start');

    setTimeout(() => {
        console.log('hello there')
    }, 3000);

    console.log('end');

};



// Call stack

function first() {
    console.log('first function');
    second();
};

function second() {
    console.log('second function');
    third();
};

function third() {
    console.log('third function')
}

// first();


function test2() {
    console.log('A');

    setTimeout(() => {
        console.log('B');
    }, 0);

    console.log('C');
};


test2();    // It will give the output A,C,B 


// Microtask Queue  -> Promises use the microtask queue.




