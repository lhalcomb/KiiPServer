import { Request, Response, Router} from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import connection from "../src/database";
import 'dotenv/config';

const router = Router();

async function encodeToken(userId, secretKey){
    const token = jwt.sign({UserId: userId}, secretKey || "");
    return token;
}

async function decodeToken(token: any, secretKey){
    const dtoken = jwt.decode(token, secretKey || "");
    return dtoken;
}

async function validCredentials(email, password, res: Response, secretKey) {
    const [users] = await connection.query("SELECT * from User where email = ?", [email]);
    
    
    if (Array.isArray(users) && users.length === 0) {
        res.status(400).json({msg: "Invalid email or password"});
        return;
    }

    const result = await bcrypt.compare(password, users[0].password);

    if (result) {
        const encodetoken = await encodeToken(users[0].User_id, secretKey);
        res.status(200).json({msg: "Password is correct", token: encodetoken});
        return;
    }

    res.status(400).json({msg: "Invalid email or password"});
    return;
}



export async function AuthorizeUser(res: Response, req: Request){
    const token = req.body.token;
    const secretKey = process.env.SECRET_KEY;
    try{
        const decoded = await decodeToken(token, secretKey);
        if(decoded){
            return decoded.UserId; 
        }
    }
    catch(err){
        res.status(401).json({msg: "Decode Token Error"});
    }
   
}

router.post('/auth', async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const secretKey = process.env.SECRET_KEY;

    try {
        await validCredentials(email, password, res, secretKey);
    } catch(err) {
        res.status(500).json(err);
        return;
    }
});

export default router;
