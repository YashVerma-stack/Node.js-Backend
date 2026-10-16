
const MAX_APPLICATION_ID = 1_000_000_000;

const ALLOWED_STATUSES = [
    "Applied",
    "Interview",
    "Offer",
    "Rejected",
    "Hired",
];

const ALLOWED_FIELDS = [
    "company",
    "position",
    "status",
    "location",
    "appliedDate",
];

const MAX_LENGTH = {
    company: 100,
    position: 100,
    location: 100,
};

export const validateApplicationId = (req, res, next) => {
    const sendError = (message) =>
        res.status(400).json({
            success: false,
            message,
            requestId: req.requestId,
        });

    // Validate ID only when the route contains :id
    if (req.params.id !== undefined) {
        const { id } = req.params;

        if (!/^[1-9]\d*$/.test(id)) {
            return sendError(
                "Application ID must be a positive integer"
            );
        }

        const numericId = Number(id);

        if (!Number.isSafeInteger(numericId)) {
            return sendError(
                "Application ID exceeds the safe integer limit"
            );
        }

        if (numericId > MAX_APPLICATION_ID) {
            return sendError(
                `Application ID must not exceed ${MAX_APPLICATION_ID}`
            );
        }

        req.applicationId = numericId;
    }

    // Validate POST and PATCH request bodies
    if (["POST", "PATCH"].includes(req.method)) {
        const body = req.body;

        if (
            body === null ||
            typeof body !== "object" ||
            Array.isArray(body)
        ) {
            return sendError(
                "Request body must be a JSON object"
            );
        }

        const keys = Object.keys(body);

        if (keys.length === 0) {
            return sendError("Request body cannot be empty");
        }

        const unknownFields = keys.filter(
            (key) => !ALLOWED_FIELDS.includes(key)
        );

        if (unknownFields.length > 0) {
            return sendError(
                `Unknown field(s): ${unknownFields.join(", ")}`
            );
        }

        if (req.method === "POST") {
            for (const field of ["company", "position"]) {
                if (
                    typeof body[field] !== "string" ||
                    !body[field].trim()
                ) {
                    return sendError(
                        `${field} is required and must be a non-empty string`
                    );
                }
            }
        }

        for (const field of ["company", "position", "location"]) {
            if (!(field in body)) continue;

            if (
                typeof body[field] !== "string" ||
                !body[field].trim()
            ) {
                return sendError(
                    `${field} must be a non-empty string`
                );
            }

            if (body[field].trim().length > MAX_LENGTH[field]) {
                return sendError(
                    `${field} must not exceed ${MAX_LENGTH[field]} characters`
                );
            }

            body[field] = body[field].trim();
        }

        if ("status" in body) {
            if (
                typeof body.status !== "string" ||
                !ALLOWED_STATUSES.includes(body.status)
            ) {
                return sendError(
                    `Status must be one of: ${ALLOWED_STATUSES.join(", ")}`
                );
            }
        }

        if ("appliedDate" in body) {
            const value = body.appliedDate;

            if (
                typeof value !== "string" ||
                !/^\d{4}-\d{2}-\d{2}$/.test(value)
            ) {
                return sendError(
                    "appliedDate must use YYYY-MM-DD format"
                );
            }

            const date = new Date(`${value}T00:00:00.000Z`);

            if (
                Number.isNaN(date.getTime()) ||
                date.toISOString().slice(0, 10) !== value
            ) {
                return sendError(
                    "appliedDate must be a valid calendar date"
                );
            }
        }
    }

    next();
};
