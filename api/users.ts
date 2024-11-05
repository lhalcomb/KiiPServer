import { Request, Response, Router} from "express";
import bcrypt from "bcrypt";
import connection from "../src/database";


export const router = Router();


router.post('/auth', async (req: Request, res: Response) => {
    const { email, password } = req.body;
    connection.query<any>("SELECT * from user where email = ?", [email], (err, rows) => {
        if (err){
            return res.status(500).json({msg: "Internal MySQL Error"});
        }
        else if (rows.length != 1) {
            return res.status(400).json({msg: "Invalid email or password"});
        }
        bcrypt.compare(password, rows[0].password)
        .then((result) => {
            if (result){
                connection.query("UPDATE  user set last_login=now() WHERE email = ?", [rows[0].email], (err) => {
                    if (err){
                        return res.status(500)
                        .json({msg: `Failed to create token: ${err}` });
                    }else{
                        //console.log({Useremail: email}, {password: password});
                        return res.status(200).json({token: jwt.encode({Useremail: email}, process.env.SECRET_KEY || "")});
                        
                    }
                });
            }else{
                return res.status(400).json({msg: "Invalid email or password"});
            }
        }).catch(() => {
            return res.status(403)
            .json({ msg: 'BCRYPT error' })
        });
    })
});

