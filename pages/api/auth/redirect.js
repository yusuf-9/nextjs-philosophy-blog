import passport from "passport"
import { sendGoogleAuthCookie } from "../apiHandlers";
import "../../../lib/passportConfig"
import { sign } from "jsonwebtoken";
import { serialize } from "cookie";

export default function handler(req, res, next) {
    passport.authenticate("google", 
        async (err, user, data) => {
            await sendGoogleAuthCookie(err, user, res)
            // return res.redirect("/")
    })(req, res, next)
    // return res.redirect("/")
}