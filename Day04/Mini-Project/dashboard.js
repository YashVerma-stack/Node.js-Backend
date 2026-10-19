function delay(ms, value) {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(value);
        }, ms);
    });
}


// Fetch user
function getUser() {
    return delay(1000, {
        id: 1,
        name: "Yash"
    });
}


// Fetch products 
// for testing change it to 5000
function getProducts() {
    return delay(2000, [
        "Laptop",
        "Mobile",
        "Headphones"
    ]);
}


// Fetch notifications
// function getNotifications() {
//     return delay(1500, [
//         "New message",
//         "New order"
//     ]);
// }

// for testing
function getNotifications() {
    return new Promise((_, reject) => {
        setTimeout(() => {
            reject(new Error("Notification service failed"));
        }, 1500);
    });
}

// Timeout function
function timeout(ms) {
    return new Promise((_, reject) => {
        setTimeout(() => {
            reject(new Error("Dashboard request timed out"));
        }, ms);
    });
}


// Dashboard
async function loadDashboard() {

    console.log("Loading dashboard...");

    try {

        // Run all requests together and wait for every result
        const results = await Promise.race([

            Promise.allSettled([
                getUser(),
                getProducts(),
                getNotifications()
            ]),

            // Dashboard must finish within 3 seconds
            timeout(3000)

        ]);

        // Display each result
        results.forEach((result, index) => {

            if (result.status === "fulfilled") {

                console.log(
                    `Request ${index + 1}:`,
                    result.value
                );

            } else {

                console.log(
                    `Request ${index + 1} failed:`,
                    result.reason.message
                );

            }

        });

    } catch (error) {

        console.log(
            "Dashboard error:",
            error.message
        );

    } finally {

        console.log("Dashboard loading finished.");

    }
}


// Start dashboard
loadDashboard();