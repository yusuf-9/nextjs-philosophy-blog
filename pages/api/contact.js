import { sendContactEmail } from "../api/apiHandlers"
import dbConnect from "../../lib/dbConnect"

export default async function handler(req, res){
    await dbConnect()
    if(req.method === "POST"){
        await sendContactEmail(req, res)
    }
}