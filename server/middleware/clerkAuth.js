import { getAuth } from "@clerk/express";

export const requireClerkAuth = (req, res, next) => {
    try {
        let userId = null;
        if (typeof req.auth === "function") {
            userId = req.auth()?.userId;
        } else if (req.auth?.userId) {
            userId = req.auth.userId;
        } else {
            const auth = getAuth(req);
            userId = auth?.userId;
        }

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "Authentication required"
            });
        }

        next();
    } catch (err) {
        return res.status(401).json({
            success: false,
            message: "Authentication required"
        });
    }
};

export default requireClerkAuth;
