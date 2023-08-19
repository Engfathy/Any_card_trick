import { MongoClient } from "mongodb";

const uri = "mongodb://localhost:27017/card_trick";
const client = new MongoClient(uri);

export interface card {
    name: string;
   card:string
}

function dbConnect() {
    try {
        
        const client = new MongoClient(uri);
        const database = client.db();
        if(client){
            console.log("database connected succefully");
            return database;
        }else{
            console.log("database error");

        }
    } catch (error){
        console.log(error);
    }
};


export default dbConnect();
