import passport from "passport";
import { googleAuth } from "../pages/api/apiHandlers";
import { Strategy } from "passport-google-oauth2";
import dbConnect from "./dbConnect";

passport.use(new Strategy({
    clientID: "953457323821-b70njhd0l070p60g2kvqk9l7fg5sgctr.apps.googleusercontent.com",
    clientSecret: "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",
    callbackURL: "/api/auth/redirect"
}, async (accessToken, refreshToken, profile, done)=>{
    await dbConnect()
    await googleAuth(profile, done)
})) 