import express from "express";
import dbConnect, { card } from "./db";
import path from "path";
import bodyParser from "body-parser";

const URI = "mongodb://localhost:27017/card_trick";
const hostName: string = "127.0.0.1";
const port: number = 5000;
// const DB_NAME = "card_trick";

const app: express.Application = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
let dataBase = dbConnect;
app.get("/secret", (req: express.Request, res: express.Response) =>
    res.sendFile(path.join(__dirname, "secret.html")),
);

app.post("/secret", async (req: express.Request, res: express.Response) => {
    const entry = {
        name: req.body.name.toLowerCase(),
        card: req.body.number + "_of_" + req.body.suit,
    };
    try {
        if (!dataBase) {
            return res.status(500).json({
                msg: "Database connection not available",
            });
        }

        const cards = dataBase.collection<card>("names");
        const query =entry;
        const cardData = await cards.insertOne(query);
        if (!cardData) {
            return res.status(404).json({
                msg: "card not added success",
            });
    }else {
        res.status(200).json({
            msg:"data added sucess"
        });
    }
 } catch (error) {
        console.error("Error adding card:", error);
        return res.status(500).json({
            msg: "An error occurred while adding card data",
        });
    }
});

app.get("/secret/:name", async (req: express.Request, res: express.Response) => {
    const name:string= req.params.name.toLowerCase();

    try {
        if (!dataBase) {
            return res.status(500).json({
                msg: "Database connection not available",
            });
        }

        const cards = dataBase.collection("names");
        const query = { name: name };
        const cardData = await cards.find(query).toArray();

        if (cardData.length === 0) {
            return res.status(404).json({
                msg: "No cards found",
            });
        }

        console.log(cardData);
        return res.status(200).sendFile(path.join(__dirname,"/cards/",`/${cardData[cardData.length -1].card}.png`));
    } catch (error) {
        console.error("Error fetching cards:", error);
        return res.status(500).json({
            msg: "An error occurred while fetching card data",
        });
    }
});

if (hostName && port) {
    app.listen(port, hostName, () => {
        console.log(`server is running at http://${hostName}:${port}`);
    });
}
