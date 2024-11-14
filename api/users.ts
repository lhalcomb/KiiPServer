import { Request, Response, Router} from "express";
import bcrypt from "bcryptjs";
import connection from "../src/database";

const router = Router();

async function validCredentials(email, password, res: Response) {
    const [users] = await connection.query("SELECT * from User where email = ?", [email]);
    
    if (Array.isArray(users) && users.length === 0) {
        res.status(400).json({msg: "Invalid email or password"});
        return;
    }

    const result = await bcrypt.compare(password, users[0].password);

    if (result) {
        res.status(200).json({msg: "Password is correct"});
        return;
    }

    res.status(400).json({msg: "Invalid email or password"});
    return;
}


router.post('/auth', async (req: Request, res: Response) => {
    const { email, password } = req.body;

    try {
        await validCredentials(email, password, res);
    } catch(err) {
        res.status(500).json(err);
        return;
    }
});

export default router;
