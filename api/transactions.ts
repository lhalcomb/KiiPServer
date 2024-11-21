import { Request, Response, Router} from "express";
import connection from "../src/database";
import {AuthorizeUser} from "./users.ts";

const router = Router();

async function getTransaction(user_id) {
    const [transactions] = await connection.query("SELECT * FROM Transactions WHERE fk_User_id = ?", [user_id]);
    return transactions;
}

async function createTransaction(user_id, req: Request, res: Response) {
    const { memo, title, amount, isPayment, isRecurring} = req.body;
    try {
        await connection.query("INSERT INTO Transactions (fk_User_id, memo, title, amount, isPayment, isRecurring) VALUES (?, ?, ?, ?, ?, ?)", [user_id, memo, title, amount, isPayment, isRecurring]);
        res.status(200).send({message: "Transaction posted successfully. "});
        return;
    } catch {
        console.log('five hundy')
        res.status(500).send({message: "Error creating transactions data. "});
        return;
    }
}

router.post('/transactions', async (req: Request, res: Response) => {
    const user_id = await AuthorizeUser(res, req);

    if (!user_id) {
        return;
    }

    console.log(user_id);
    if (!user_id){
        res.status(400).send({message: "User ID is required"});
        return;
    }
    
    try {
        const transactions = await getTransaction(user_id);
        res.status(200).send(transactions);
        return;

    } catch {
        res.status(500).send({message: "Error fetching transactions data. "});
        return;
    }
});

router.post('/transaction', async (req: Request, res: Response) => {
    const userId =  await AuthorizeUser(res, req);

    if (!userId) {
        console.log('no user id')
        return;
    }

    await createTransaction(userId, req, res);
});

export default router;
