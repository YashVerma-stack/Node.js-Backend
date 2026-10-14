import express from 'express';
import { validateTaskId } from './middleware/validateTaskId.js';

const app = express();
const PORT = 3000;

app.use(express.json());

let tasks = [
    {
        id: 1,
        title: 'title1',
        completed: true,
        createdAt: new Date().toISOString(),
    },
    {
        id: 2,
        title: 'title2',
        completed: false,
        createdAt: new Date().toISOString(),
    },
]

app.get('/', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Todo REST API is running',
    });
});

app.get('/api/tasks', (req, res) => {
    res.status(200).json({
        success: true,
        count: tasks.length,
        data: tasks,
    });
});

app.get('/api/tasks/:id', validateTaskId, (req, res) => {

    // search for the task

    const task = tasks.find((task) => task.id === req.taskId);

    if (!task) {
        return res.status(404).json({
            success: false,
            message: "Task not found",
        });
    }

    // return the task
    return res.status(200).json({
        success: true,
        data: task,
    });
});

app.post('/api/tasks', (req, res) => {
    const { title, completed } = req.body ?? {};

    // validate the title
    if (typeof title !== "string" || title.trim() === "") {
        return res.status(400).json({
            success: false,
            message: "Title is required and must be a non-empty string.",
        });
    }

    // validate completed if provided

    if (
        completed !== undefined &&
        typeof completed !== "boolean"
    ) {
        return res.status(400).json({
            success: false,
            message: "Completed must be a boolean",
        });
    }

    // Generate a unique ID
    const id = tasks.length > 0 ? Math.max(...tasks.map((task) => task.id)) + 1 : 1;

    // create the new task
    const newTask = {
        id,
        title: title.trim(),
        completed: completed ?? false,
        createdAt: new Date().toISOString(),
    };

    // store the task
    tasks.push(newTask);

    return res.status(201).json({
        success: true,
        message: "Task created successfully",
        data: newTask,
    });
});

app.patch('/api/tasks/:id', validateTaskId, (req, res) => {
    
    // find the task
    const task = tasks.find((task) => task.id === req.taskId);

    if (!task) {
        return res.status(404).json({
            success: false,
            message: "Task not found.",
        });
    }

    // validate the request body
    const body = req.body;

    if (!body || typeof body !== "object" || Array.isArray(body)) {
        return res.status(400).json({
            success: false,
            message: "Request body must be a JSON object.",
        });
    }

    const allowedFields = ["title", "completed"];
    const fields = Object.keys(body);

    // reject empty or unsupported updates
    if (fields.length === 0) {
        return res.status(400).json({
            success: false,
            message: "Provide atleast one field to update.",
        });
    }

    const invalidFields = fields.filter(
        (field) => !allowedFields.includes(field)
    );

    if (invalidFields.length > 0) {
        return res.status(400).json({
            success: false,
            message: "Unsopported fields in request.",
            invalidFields,
        });
    }

    // validate title if provided
    if ("title" in body) {
        if (
            typeof body.title !== "string" ||
            body.title.trim() === ""
        ) {
            return res.status(400).json({
                success: false,
                message: "Title must be a non-empty string.",
            });
        }
    }

    // validate completed if provided
    if (
        "completed" in body &&
        typeof body.completed !== "boolean"
    ) {
        return res.status(400).json({
            success: false,
            message: "Completed must be boolean.",
        });
    }

    // Apply only the provided fields
    if ("title" in body) {
        task.title = body.title.trim();
    }

    if ("completed" in body) {
        task.completed = body.completed;
    }

    // return the updated task
    return res.status(200).json({
        success: true,
        message: "Task updated successfully.",
        data: task,
    })
})

app.delete('/api/tasks/:id', validateTaskId, (req, res) => {

    // find the task index
    const taskIndex = tasks.findIndex(
        (task) => task.id === req.taskId
    );

    // check whether the task exists
    if (taskIndex === -1) {
        return res.status(404).json({
            success: false,
            message: "Task not found.",
        });
    }

    // Delete the task
    const deletedTask = tasks.splice(taskIndex, 1)[0];

    // return the response
    return res.status(200).json({
        success: true,
        messsage: "Task deleted successsfully.",
        data: deletedTask,
    })
})

app.use((err, req, res, next) => {
    // handle malformed JSON from express.json()
    if (
        err instanceof SyntaxError && err.status === 400 && "body" in err
    ) {
        return res.status(400).json({
            success: false,
            message: "Invalid JSON format. Please check your request body.",
        });
    }

    // handle other errors
    console.error(err);

    return res.status(500).json({
        success: false,
        message: "Internal server error.",
    })
})

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});

