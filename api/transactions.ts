import { Request, Response, Router} from "express";
import connection from "../src/database";

const router = Router();

async function getTransaction(user_id) {
    const [transactions] = await connection.query("SELECT * FROM Transactions WHERE fk_User_id = ?", [user_id]);
    return transactions;
}

async function createTransaction(req: Request, res: Response) {
    const { fk_User_id, memo, title, amount, isPayment, isRecurring} = req.body;
    try {
        await connection.query("INSERT INTO Transactions (fk_User_id, memo, title, amount, isPayment, isRecurring) VALUES (?, ?, ?, ?, ?, ?)", [fk_User_id, memo, title, amount, isPayment, isRecurring]);
        res.status(200).send({message: "Transaction posted successfully. "});
    } catch {
        res.status(500).send({message: "Error creating transactions data. "});
    }
}

router.get('/transactions', async (req: Request, res: Response) => {
    const user_id = req.body.user_id as string;

    if (!user_id){
        res.status(400).send({message: "User ID is required"});
    }
    
    try {
        const transactions = await getTransaction(user_id);
        res.status(200).send(transactions);

    } catch {
        res.status(500).send({message: "Error fetching transactions data. "});
    }
});

router.post('/transactions', async (req: Request, res: Response) => {
    await createTransaction(req, res);
});

export default router;
