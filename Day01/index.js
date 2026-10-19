const square = (num) => {
    return num * num;
}

// destructuring
const user = {
    name: "Yash",
    age: 22,
    email: "yash@example.com"
};

// without destructuing
// const name = user.name;
// const age = user.age;
// const email = user.email;


// with destructuring
const {name, age, email} = user;

console.log(name);
console.log(age);
console.log(email);


const employee = {
    name: 'tony',
    id: 21
};

const {name: username, id: emp_id} = employee;

console.log(username);
console.log(emp_id);

// Array Desctructuring

const numbers = [10, 20, 30];

const [first, second, third] = numbers;

console.log(first);  // 10
console.log(second); // 20
console.log(third);  // 30

// Rest Operator
const users = {
    id: 1,
    name: "Yash",
    email: "yash@example.com",
    age: 22
};


const {id, ...rest} = users;

console.log(id);
console.log(rest);


// spread operator

const person = {
    name: 'tony',
    age: 21
};

// we can create the copy

const newPerson = {
    ...person
};

console.log(newPerson);

// updating an object without modifying the original

const updatePerson = {
    ...person,
    age: 25
};


console.log(person.age);
console.log(updatePerson.age);