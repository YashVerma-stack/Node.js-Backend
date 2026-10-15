export function validateTaskId(req, res, next) {
    const { id } = req.params;

    // Check positive integer format
    if (!/^[1-9]\d*$/.test(id)) {
        return res.status(400).json({
            success: false,
            message: "Task ID must be a positive integer.",
        });
    }

    const taskId = Number(id);

    // check safe integer range
    if (!Number.isSafeInteger(taskId)) {
        return res.status(400).json({
            success: false,
            message: "Task ID is too large.",
        });
    }

    // make the validated ID available to the roite
    req.taskId = taskId;

    // continue to the next middleware or route handler
    next();
}

