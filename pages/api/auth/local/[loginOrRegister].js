import dbConnect from "../../../../lib/dbConnect"
import { serialize } from "cookie"
import bcrypt from "bcrypt"
import User from "../../../../models/userSchema"
import { loginUser, registerUser, resetPassword, checkUserAction, logOut } from "../../apiHandlers"


export default async function handler(req, res){
    await dbConnect()
    let {loginOrRegister} = req.query
    if(loginOrRegister === "register" && req.method === "POST"){
        await registerUser(req, res)
    }
    else if(loginOrRegister === "login" && req.method === "POST"){
        await loginUser(req, res)
    }
    else if(loginOrRegister === "checkUserAction"){
        await checkUserAction(req, res)
    }
    else if(loginOrRegister === "logOut"){
        await logOut(req, res)
    }
    else if(loginOrRegister === "resetPassword" && req.method === "POST"){
        await resetPassword(req, res)
    }
}