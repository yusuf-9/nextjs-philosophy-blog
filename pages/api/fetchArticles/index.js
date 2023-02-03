import dbConnect from "../../../lib/dbConnect";
import {fetchHomeArticles} from "../apiHandlers";

export default async function handler  (req, res) {
    await dbConnect();
    await fetchHomeArticles(req, res)
}
