import Express from "express";
import "dotenv/config";
import { createTextEmbeddings } from "./storing-pdf";
const app = Express();

app.use('/', Express.json())

app.get('/test', (req, res) => {
    res.send("Reachable")
})

app.post('/chat', async (req, res) => {
    // Convert chat to embedding
    let {chat} = req.body;

    let chatEmbedding = await createTextEmbeddings(chat);

    // Vector search db
    
})

app.all('*', (req, res) => {
    res.status(404).json({message: "Route Does Not Exist"});
})

let port = process.env.PORT ?? 5000;
app.listen(port, () => {
    console.log(`Server is listening on port ${port}...`)
})