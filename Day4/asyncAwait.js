function delay(ms){
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}

async function processsTask() {
    console.log('Task started');

    await delay(2000);

    console.log('Task Completed');
}

// processsTask();

function getUser() {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({
                id: 1,
                name: 'yash'
            });
        }, 1000);
    });
}

async function main() {
    const user = await getUser();

    console.log(user);
}

main();