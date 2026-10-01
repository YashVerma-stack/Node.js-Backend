const user = {
    id: 101,
    name: "Yash",
    email: "yash@example.com",
    age: 22
};

const { id, ...meta } = user;

const updatedUser = {
    ...meta,
    age: 23
};

const message = `User ${updatedUser.name} is ${updatedUser.age} years old.`;

console.log(message);