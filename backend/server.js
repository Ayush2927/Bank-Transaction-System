import dotenv from "dotenv";
import { app } from "./src/app.js";
import { ConnectToDb } from "./src/config/db.js";
import { initCron } from "./src/services/cron.service.js";


dotenv.config({
    path: './.env'
});
ConnectToDb();

app.listen(process.env.PORT || 8000, () => {
    console.log(`Server is running on port ${process.env.PORT || 8000}`);
})
initCronJobs();

app.get("/", (req, res) => {

    res.send("Hello")
})