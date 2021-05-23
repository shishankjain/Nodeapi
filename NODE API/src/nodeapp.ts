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
     channel.assertQueue('added_name', {durable: false})
     channel.assertQueue('added_dept', {durable: false})
     channel.assertQueue('updated_id', {durable: false})
     channel.assertQueue('updated_name', {durable: false})
     channel.assertQueue('updated_dept', {durable: false})
     channel.assertQueue('deleted_id', {durable: false})

const app=express();
app.use(express.json());
app.use(express.urlencoded({extended: false}));
let name:string;
let dept:string;
let up_name:string;
let up_dept:string;
let up_id:number;
let del_id:number;

channel.consume('added_name',  async(msg) => {
    name= (msg?.content.toString())!;
    console.log(name)
})
channel.consume('added_dept',async(msg) => {
    dept=(msg?.content.toString())!
    console.log('department added')
    await pool.query('INSERT INTO users (name, dept) VALUES ($1, $2)', [name, dept]);
})

channel.consume('updated_id', async(msg) =>{
up_id=parseInt((msg?.content.toString())!)
console.log(up_id)
})
channel.consume('updated_name',  async(msg) => {
    up_name= (msg?.content.toString())!;
    console.log(up_name)
})
channel.consume('updated_dept',async(msg) => {
    up_dept=(msg?.content.toString())!
    console.log(up_dept)
    await pool.query('UPDATE users SET name = $1, dept = $2 WHERE id = $3', [
        up_name,
        up_dept,
        up_id
    ]);
})
channel.consume('deleted_id', async(msg) =>{
    del_id=parseInt((msg?.content.toString())!)
    console.log('Id deleted')
    await pool.query('DELETE FROM users where id = $1', [
        del_id
    ]);
})
app.get('/users', async (req: Request, res: Response)=> {const response: QueryResult = await
    pool.query('SELECT * FROM users ORDER BY id ASC'); //Employees sorted by id
     res.status(200).json(response.rows); } );
     
app.get('/users/:id', async (req: Request, res: Response) => {
     const id = parseInt(req.params.id);
     const response: QueryResult = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
     res.json(response.rows)});

     console.log('Listening to port: 4001')
     app.listen(4001, () => {
          console.log("Started server on 4001");
        });
     })
     })