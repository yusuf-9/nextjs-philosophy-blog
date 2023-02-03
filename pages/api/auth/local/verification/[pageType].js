import dbConnect from "../../../../../lib/dbConnect"
import {sendEmailVerification, verifyUser} from "../../../apiHandlers"



export default async function handler(req, res){
    await dbConnect()
    let { pageType } = req.query
    if(pageType === "register" || pageType === "login"){
        await sendEmailVerification(req, res)    
    }
    else if(pageType === "verify"){
        await verifyUser(req, res)
    }
}