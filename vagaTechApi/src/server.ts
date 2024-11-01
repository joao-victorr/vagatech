
import express, { ErrorRequestHandler, type Request, type Response } from 'express';
import dotenv from 'dotenv';


import { router } from "./Router/router";


dotenv.config();
const server = express();


server.use(express.urlencoded({ extended: true }));
server.use(express.json());
// server.use(express.static(path.join(__dirname, '../public')));



server.use(router)

server.use("/", (req: Request, res: Response) => {
    res.send("Hello World")
})



server.listen(process.env.PORT, () => {
    console.log(`Servidor rodando na porta ${process.env.PORT}`);
});