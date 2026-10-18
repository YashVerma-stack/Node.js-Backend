import { randomUUID } from "node:crypto";

const requestId = (req, res, next) => {
    req.requestId = randomUUID();

    res.setHeader("X-Request-ID", req.requestId);

    next();
};

export default requestId;