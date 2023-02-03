import dbConnect from "../../../../lib/dbConnect";
import { likeHandler, commentHandler} from "../../apiHandlers";


export default async function handler(req, res) {
    await dbConnect()
    let { type, articleName } = req.query;

    if (type === "comment") {
        if (req.method === "POST") {
            await commentHandler(req, res)
        }
    }
    else if (type === "like") {
        if (req.method === "POST") {
            await likeHandler(req, res)
        }
    }
}