import { createStudent } from "./student.js";

import {
    calculateGrade,
    getResult
} from "./result.js";

import {
    validateName,
    validateMarks
} from "./validator.js";

import { formatStudentReport } from "./formatter.js";


const name = process.argv[2];
const marks = Number(process.argv[3]);


if (!validateName(name)) {
    console.log("Please provide a valid student name.");
    process.exit(1);
}


if (!validateMarks(marks)) {
    console.log("Marks must be a number between 0 and 100.");
    process.exit(1);
}


const student = createStudent(name, marks);

const grade = calculateGrade(student.marks);

const result = getResult(student.marks);

formatStudentReport(student, grade, result);