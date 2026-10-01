const numbers = [1,2,3,4];

const doubled = numbers.map(num => num * 2);

console.log(numbers);
console.log(doubled);

// map returns a new array


// maps with object

const users = [
    {name: "tony", age: 22},
    {name: 'peter', age: 25}
];

// if we only want names

const names = users.map(user => user.name);

console.log(names);

// filter() -> selects items based on filteration 

const arr = [1,2,3,4,5];
const evenNumbers = arr.filter(num => num % 2 === 0);

console.log(evenNumbers);

const applications = [
    { company: "Google", status: "pending" },
    { company: "Amazon", status: "rejected" },
    { company: "Microsoft", status: "pending" }
];


const pending = applications.filter(
    application => application.status === "pending"
);

console.log(pending);

const nums = [10, 20, 30, 40];

const total = numbers.reduce(
    (sum, number) => sum + number,
    0
);

console.log(total);

const acc = numbers.reduce((accumulator, currentValue) => {
    return accumulator + currentValue;
}, 0);

console.log(acc)


const nums2 = [10, 20, 30, 40];

const result = nums2.find((number) => number > 20);

console.log(result);



const nums3 = [10, 20, 30, 40];

const result3 = nums3.some((number) => number > 25);

console.log(result3);



const nums4 = [2, 4, 6, 8];

const result4 = nums4.every((number) => number % 2 === 0);

console.log(result4);

