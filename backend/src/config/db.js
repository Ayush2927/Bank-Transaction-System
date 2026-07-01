import mongoose from "mongoose";

async function ConnectToDb() {
    await mongoose.connect(process.env.MONGO_DB_URI)
        .then(() => {
            console.log("Server is connected to DB")
        }).
        catch(err => {
            console.error("Error connecting to DB:", err)
            process.exit(1);
        });
}


export { ConnectToDb }