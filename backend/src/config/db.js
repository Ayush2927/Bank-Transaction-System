import mongoose from "mongoose";

async function ConnectToDb(){
await mongoose.connect(process.env.MONGO_DB_URI)
.then(()=>{
    console.log("Server is connected to DB")
}).
catch(err=>{
    console.log("Error connecting to DB")
    process.exit(1);
});
}


export {ConnectToDb}