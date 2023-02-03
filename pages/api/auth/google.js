import passport from "passport"
import dbConnect from "../../../lib/dbConnect";
import "../../../lib/passportConfig"

export default function handler(req, res, next) {
    passport.authenticate("google", {
        scope: ["profile", "email"],
        session: false
    })(req, res, next);
}