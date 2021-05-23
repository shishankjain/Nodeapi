import { Request, Response } from 'express';
import { pool } from './database';
import { QueryResult } from 'pg';
import express, { Application} from 'express';
import * as amqp from 'amqplib/callback_api';

amqp.connect('amqps://glfakzdj:3X6eWPsZwTTBUC0V0Z_PJeO4MF-311Uh@chimpanzee.rmq.cloudamqp.com/glfakzdj', (error0, connection) => {
     if (error0) {
         throw error0
     }

     connection.createChannel((error1, channel) => {
         if (error1) {
             throw error1
         }

const app=express();
app.use(express.json());
app.use(express.urlencoded({extended: false}));


app.get('/users', async (req: Request, res: Response)=> {const response: QueryResult = await
    pool.query('SELECT * FROM users');
     res.status(200).json(response.rows); } );
     
app.get('/users/:id', async (req: Request, res: Response) => {
     const id = parseInt(req.params.id);
     const response: QueryResult = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
     return res.json(response.rows)});

app.post('/users', async (req: Request, res: Response) => {
    const { name, dept } = req.body;
    const response = await pool.query('INSERT INTO users (name, dept) VALUES ($1, $2)', [name, dept]);
    channel.sendToQueue('added_name',Buffer.from((name)))
    channel.sendToQueue('added_dept',Buffer.from((dept)))
    res.json({
        message: 'User Added successfully',
        body: {
            user: { name, dept }
        }
    })
});

app.put('/users/:id',async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    const { name, dept } = req.body;
    channel.sendToQueue('updated_id',Buffer.from(req.params.id))
    channel.sendToQueue('updated_name',Buffer.from((name)))
    channel.sendToQueue('updated_dept',Buffer.from((dept)))
    const response = await pool.query('UPDATE users SET name = $1, dept = $2 WHERE id = $3', [
        name,
        dept,
        id
    ]);
    res.json('User Updated Successfully');
});

app.delete('/users/:id',async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    channel.sendToQueue('deleted_id',Buffer.from(req.params.id))
    await pool.query('DELETE FROM users where id = $1', [
        id
    ]);
    res.json(`User ${id} deleted Successfully`);
});

console.log('Listening to port: 3002')
app.listen(3002, () => {
     console.log("Started server on 3002");
   });
     })
})