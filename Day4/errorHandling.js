function getUser() {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const success = true;
            // const success = false;

            if (success) {
                resolve({
                    id: 1,
                    name: "Yash"
                });
            } else {
                reject(new Error("Failed to fetch user"));
            }
        }, 1000);
    });
}

async function main() {
    try {
        console.log("Fetching user...");

        const user = await getUser();

        console.log("User:", user);
    } catch (error) {
        console.log("Error:", error.message);
    } finally {
        console.log("Request completed");
    }
}

main();