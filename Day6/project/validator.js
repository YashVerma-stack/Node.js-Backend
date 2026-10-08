function validateName(name) {
    if (!name || name.trim() === "") {
        return false;
    }

    return true;
}

function validateMarks(marks) {
    return Number.isFinite(marks) && marks >= 0 && marks <= 100;
}

export {
    validateName,
    validateMarks
};