import express, {Request, Response} from  "express";
import cors from "cors";
import dotenv from 'dotenv';
// import routes from "./routes";
dotenv.config();
import { info } from "@repo/logs/logs";
import routes from "./routes";

const app = express();

app.use(express.json());

app.use(cors());

const port = process.env.PORT || 1338;




app.listen(port , async () => {
    info(`App is running at port: http://localhost:${port}`);
    routes(app);
})


export default app;