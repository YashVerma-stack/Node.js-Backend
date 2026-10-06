function delay(ms, value) {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(value);
        }, ms);
    });
}

function getUser() {
    return delay(2000, {
        id: 1,
        name: "Yash"
    });
}

function getProducts() {
    return delay(3000, [
        "Laptop",
        "Mobile",
        "Headphones"
    ]);
}

function getNotifications() {
    return delay(1000, [
        "New message",
        "New order"
    ]);
}

async function loadDashboard() {
    console.time("dashboard");

    try {
        const [user, products, notifications] = await Promise.all([
            getUser(),
            getProducts(),
            getNotifications()
        ]);

        console.log("User:", user);
        console.log("Products:", products);
        console.log("Notifications:", notifications);

    } catch (error) {
        console.log("Dashboard error:", error.message);

    } finally {
        console.timeEnd("dashboard");
    }
}

loadDashboard();