import express, {type Express, type Request, type Response} from "express"
import "dotenv/config";
import { PORT } from "./secrets.js";
import router from "./routes/index.js";

const app: Express = express();

app.use(express.json());

app.use("/api", router)

app.get("/", (req,res)=>{
  res.send("working")
})

app.listen(PORT, () =>{
  console.log(`App is running on port ${PORT}`)
})

