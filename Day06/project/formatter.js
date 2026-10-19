import chalk from "chalk";

function formatStudentReport(student, grade, result) {
    console.log();
    console.log(chalk.blue("STUDENT REPORT"));
 

    console.log(chalk.white(`Name   : ${student.name}`));
    console.log(chalk.white(`Marks  : ${student.marks}`));
    console.log(chalk.yellow(`Grade  : ${grade}`));

    if (result === "PASS") {
        console.log(chalk.green(`Result : ${result}`));
    } else {
        console.log(chalk.red(`Result : ${result}`));
    }
    console.log();
}

export { formatStudentReport };