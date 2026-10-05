function test1() {
    console.log("start");

    setTimeout(() => {
        console.log('Timer');
    }, 0);

    Promise.resolve().then(() => {
        console.log("Promise");
    });

    console.log("end");
};

// test1();

// when you see Promise.then(..), think microstack queue
// when you see setTimeout(...), then think task queue

function test2(){
    console.log('1');

    setTimeout(() => {
        console.log('2');
    }, 0);
    Promise.resolve().then(() => {
        console.log('3');
    });

    console.log('4');
};


// test2();

// result = 1, 4, 3, 2

function test3() {
    console.log('1');
    Promise.resolve().then(() => {
        console.log('2');
    });

    Promise.resolve().then(() => {
        console.log('3');
    });
    
    setTimeout(() => {
        console.log('4');
    }, 0);

    console.log('5');

}

test3();

// output = 1, 5, 2, 3, 4

