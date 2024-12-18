import express from 'express';
import connection from './database.ts';
import users from '../api/users.ts';
import transactions from '../api/transactions.ts';

const app = express();
const port = 3000;

app.use(express.json());
app.use(users);
app.use(transactions);

app.listen(port, () => {
    console.log(`App listening on http://localhost:${port}`)
});


app.get('/users', async (_req, res) => {
    const [results, _fields] = await connection.query('SELECT * FROM User');
    res.status(200).json(results)
});

app.get('/transactions', async (_req, res) => {
    const [results, _fields] = await connection.query('SELECT * FROM Transactions');
    res.status(200).json(results)
});
