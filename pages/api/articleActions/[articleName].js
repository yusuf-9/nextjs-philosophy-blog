import dbConnect from "../../../lib/dbConnect";
import {writeArticle, updateArticle, deleteArticle} from "../apiHandlers";


export default async function handler(req, res){
    await dbConnect()
    let {articleName} = req.query;
    if(req.method === "POST"){
        if(articleName === "write"){
            await writeArticle(req, res)
        }
        else{
            await updateArticle(articleName, req, res)
        }
    }
    else if(req.method === "DELETE"){
        await deleteArticle(articleName, req, res)
    }
}