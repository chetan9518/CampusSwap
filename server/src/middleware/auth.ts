import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/jwt.js";

export interface AuthRequest extends Request {
    user?: { uid: string; email: string };
}

export const auth = async (req: AuthRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith("Bearer")) {
        return res.status(401).json({
            success: false,
            message: "Invalid/Missing token"
        });
    }

    const token = authHeader.split(" ")[1];
    
    try {
        const decoded = verifyToken(token);
        req.user = { uid: decoded.uid, email: decoded.email };
        next();
    } catch (e) {
        console.error("JWT verification error:", e);
        return res.status(401).json({ 
            success: false,
            message: "Invalid token" 
        });
    }
};
