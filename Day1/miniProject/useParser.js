const readline = require("readline");

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

const parseUser = (user) => {

    const {
        name,
        email,
        age = 18,
        city = "Not provided",
        ...extraInfo
    } = user;

    const parsedUser = {
        name,
        email,
        age,
        city,
    };

    return {
        parsedUser,
        extraInfo,
    };
};

rl.question("Enter user data in JSON format: ", (input) => {

    try {

        // JSON string → JavaScript object
        const user = JSON.parse(input);

        // Destructuring returned object
        const { parsedUser, extraInfo } = parseUser(user);

        console.log(`
        ----- User Summary -----

        Name: ${parsedUser.name}
        Email: ${parsedUser.email}
        Age: ${parsedUser.age}
        City: ${parsedUser.city}
        `);
        

        console.log("Extra Information:");
        console.log(extraInfo);

    } catch (error) {

        console.log("Invalid JSON format.");

    }

    rl.close();
});