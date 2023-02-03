import { checkUserRole } from "../apiHandlers";
import dbConnect from "../../../lib/dbConnect";

export default async function middleware(req, res){
    await dbConnect()
    let {task} = req.query;
    if(task === "checkUserRole"){
        await checkUserRole(req, res)
    }
}