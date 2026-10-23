
export const authorizeRole = (...allowedRoles) => {
    return (req, res, next) => {
        // Authentication middleware must run first.
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: "Authentication required",
            });
        }

        // Check whether the user's role is permitted.
        if (!allowedRoles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: "Forbidden: insufficient permissions",
            });
        }

        next();
    };
};
