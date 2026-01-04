import { Request,Response,NextFunction } from "express"
import { firebaseadmin } from "../config/firsbaseadmin";
export interface AuthRequest extends Request {
    user?: { uid: string, email?: string };
}

export const auth = async(req: AuthRequest, res: Response, next: NextFunction)=>{
        const authHeader = req.headers.authorization;
        if(!authHeader||!authHeader.startsWith("Bearer")){
            return res.status(401).json({
                msg:"Invalid/Missing token"
            })
        }

        const token = authHeader.split(" ")[1];
        try{
        const result = await firebaseadmin.auth().verifyIdToken(token);
        req.user={uid:result.uid, email: result.email || undefined };
        next();
        }
        catch(e){
            console.error("Firebase token verification error:", e);
            return res.status(401).json({ msg: "Invalid token" });
        }

}