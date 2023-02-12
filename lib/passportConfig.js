import passport from "passport";
import { googleAuth } from "../pages/api/apiHandlers";
import { Strategy } from "passport-google-oauth2";
import dbConnect from "./dbConnect";

passport.use(new Strategy({
    clientID: "48739141356-ed1ptopbrq6u7mbl20kjsdmmt7588c2p.apps.googleusercontent.com",
    clientSecret: "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",
    callbackURL: "/api/auth/redirect"
}, async (accessToken, refreshToken, profile, done)=>{
    await dbConnect()
    await googleAuth(profile, done)
})) 