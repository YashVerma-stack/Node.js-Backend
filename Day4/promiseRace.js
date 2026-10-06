function delay(ms, value) {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(value);
        }, ms);
    });
}

async function main() {
    const result = await Promise.race([
        delay(3000, 'task 1'),
        delay(1000, 'task 2'),
        delay(2000, 'task 3')
    ]);

    console.log(result);
}

main();
