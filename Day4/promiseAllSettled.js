async function main() {
    const result = await Promise.allSettled([
        Promise.resolve('task 1 successful'),
        Promise.reject(new Error('task 2 failed')),
        Promise.resolve('task3 successful')
    ]);

    result.forEach((result, index) => {
        if (result.status === 'fulfilled') {
            console.log(`task ${index + 1}: success - ${result.value}`);
        } else {
            console.log(`task ${index + 1}: failed - ${result.reason.message}`);
        }
    })


}

main();