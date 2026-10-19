function delay(ms) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}

function fetchUser() {
    return delay(1000).then(() => {
        return {
            id: 1,
            name: 'yash'
        };
    });
}

function fetchOrders(userId) {
    return delay(2000).then(() => {
        return [
            'order 1',
            'order 2',
        ];
    });
}

function fetchPayment(orders) {
    return delay(1500).then(() => {
        return {
            status: "success",
            amount: 2500
        };
    });
}

const startTime = Date.now();

// helper function

function log(message) {
    const elapsed = Date.now() - startTime;
    console.log(`[${elapsed}ms ${message}]`);
}

log('starting task queue');

fetchUser()
    .then((user) => {
        log(`User received: ${user.name}`);

        return fetchOrders(user.id);
    })
    .then((orders) => {
        log(`Orders received: ${orders.length}`);

        return fetchPayment(orders);
    })
    .then((payment) => {
        log(`Payment status: ${payment.status}`);
    })
    .catch((error) => {
        log(`Error: ${error}`);
    })
    .finally(() => {
        log("All tasks completed");
    });