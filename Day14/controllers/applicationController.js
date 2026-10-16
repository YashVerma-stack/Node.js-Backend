import { createApplication, deleteApplication, getAllApplications, getApplicationById, updateApplication } from "../services/applicationService.js"

// GET /api/applications
export const getApplications = (req, res) => {
    const applications = getAllApplications();

    res.status(200).json({
        success: true,
        count: applications.length,
        data: applications,
        requestId: req.requestId,
    });
};

// GET /api/applications/:id

export const getApplication = (req, res) => {
    const application = getApplicationById(req.params.id);

    if (!application) {
        return res.status(404).json({
            success: false,
            message: "Job application not found",
            requestId: req.requestId,
        });
    }

    res.status(200).json({
        success: true,
        data: application,
        reequestId: req.requestId,
    });
};

// POST /api/applications
export const addApplication = (req, res) => {
    const { company, position } = req.body;

    if (
        typeof company !== "string" ||
        !company.trim() ||
        typeof position !== "string" ||
        !position.trim()
    ) {
        return res.status(400).json({
            success: false,
            message: "Company and position are required",
            requestId: req.requestId,
        });
    }

    const application = createApplication({
        ...req.body,
        company: company.trim(),
        position: position.trim(),
    });

    res.status(201).json({
        success: true,
        message: "Job application created successfully",
        data: application,
        requestId: req.requestId,
    });
};

// PATCH /api/applications/:id
export const editApplication = (req, res) => {
    const allowedFields = [
        "company",
        "position",
        "status",
        "location",
        "appliedDate",
    ];

    const updates = Object.fromEntries(
        Object.entries(req.body).filter(([key]) =>
            allowedFields.includes(key)
        )
    );

    if (Object.keys(updates).length === 0) {
        return res.status(400).json({
            success: false,
            message: "Provide at least one valid field to update",
            requestId: req.requestId,
        });
    }

    for (const field of ["company", "position"]) {
        if (
            field in updates &&
            (typeof updates[field] !== "string" ||
                !updates[field].trim())
        ) {
            return res.status(400).json({
                success: false,
                message: `${field} must be a non-empty string`,
                requestId: req.requestId,
            });
        }

        if (field in updates) {
            updates[field] = updates[field].trim();
        }
    }

    const application = updateApplication(
        req.params.id,
        updates
    );

    if (!application) {
        return res.status(404).json({
            success: false,
            message: "Job application not found",
            requestId: req.requestId,
        });
    }

    res.status(200).json({
        success: true,
        message: "Job application updated successfully",
        data: application,
        requestId: req.requestId,
    });
};

// DELETE /api/applications/:id
export const removeApplication = (req, res) => {
    const deleted = deleteApplication(req.params.id);

    if (!deleted) {
        return res.status(404).json({
            success: false,
            message: "Job application not found",
            requestId: req.requestId,
        });
    }

    res.status(200).json({
        success: true,
        message: "Job application deleted successfully",
        requestId: req.requestId,
    });
};