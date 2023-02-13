import User from "../../models/userSchema"
import Article from "../../models/articleSchema"
import userActions from "../../models/userActions";
import GoogleUser from "../../models/googleUserSchema"
import transporter from "../../lib/nodemailer";
import { sign, verify } from "jsonwebtoken";
import { serialize } from "cookie";
import { v4 } from "uuid";
import bcrypt from "bcrypt";

// Fetch article API handlers
export async function fetchHomeArticles(req, res) {
    try {
        let articles = await Article.find({}, { heading: 1, description: 1, category: 1, image: 1, timeToRead: 1, date_created: 1 }).sort({ views: -1 });
        let Toparticles = articles.slice(0, 6);
        let random = Math.floor(Math.random() * (articles.length - 3));
        return res.status(200).json({ status: "success", data: Toparticles, x: articles.slice(random, random + 3) });
    } catch (err) {
        if (err) {
            return res.status(400).json({ status: "failed", data: err });
        }
    }
}

export async function fetchOneArticle(article, req, res) {
    try {
        const main = await Article.findOne({ link: article })
        const currentViews = main.views;
        main.views = currentViews + 1
        await main.save()
        const articleCount = await Article.find({ link: { $ne: article } }).count()
        var random = Math.floor(Math.random() * (articleCount - 3))
        const moreArticles = await Article.find({ link: { $ne: article } }, { heading: 1, image: 1, date_created: 1, timeToRead: 1, category: 1, link: 1 }).skip(random).limit(3)
        var liked;
        return res.status(200).json({ status: "success", data: main, moreArticles: moreArticles, })
    } catch (err) {
        if (err) {
            return res.json({ status: "failed", data: err })
        }
    }
}

export async function fetchShowcaseArticles(req, res) {
    var { page, filter } = req.query
    try {
        if (page && filter) {
            const articles = await Article.find({ category: { $in: filter } }, { heading: 1, image: 1, category: 1, timeToRead: 1, date_created: 1 }).sort({ last_updated: -1 }).skip(page * 9).limit(9)
            var nextPage = Number(page) + 1;
            var prevPage = Number(page) - 1;
            if (typeof (filter) == "string") {
                var categoryquery = `filter=${filter}&`
            }
            else {
                var categoryquery = filter.map((x) => { return `filter=${x}&` });
                categoryquery = categoryquery.join("")
            }
            if (articles.length < 9) {
                return res.json({ status: "success", data: articles, category: categoryquery, page: { prevPage: prevPage } })
            }
            else {
                return res.json({ status: "success", data: articles, category: categoryquery, page: { nextPage: nextPage, prevPage: prevPage } })
            }

        }
        else if (page) {
            const articles = await Article.find({}, { heading: 1, category: 1, image: 1, timeToRead: 1, date_created: 1 }).sort({ last_updated: -1 }).skip(page * 9).limit(9)
            var nextPage = Number(page) + 1;
            var prevPage = Number(page) - 1;
            if (articles.length < 9) {
                return res.json({ status: "success", data: articles, page: { prevPage: prevPage } })
            }
            else {
                return res.json({ status: "success", data: articles, page: { nextPage: nextPage, prevPage: prevPage } })
            }
        }
        else {
            const articles = await Article.find({}, { heading: 1, category: 1, image: 1, timeToRead: 1, date_created: 1 }).sort({ last_updated: -1 }).limit(9)
            return res.json({ status: "success", data: articles, page: { nextPage: 1 } })
        }
    } catch (err) {
        if (err) {
            return res.json({ status: "failed", data: err })
        }
    }
}

export async function fetchAllArticles(req, res) {
    try {
        const allArticles = await Article.find({}, { link: 1 })
        return res.json({ status: "success", data: allArticles })
    } catch (error) {
        if (err) {
            return res.json({ status: "failed", data: err })
        }
    }
}

export async function fetchCommentsAndLikes(articleName, req, res) {
    try {
        const main = await Article.findOne({ link: articleName }, { comments: 1, likes: 1 })
        let { cookies } = req;
        let { token } = cookies;
        if (token) {
            try {
                let liked;
                const verified = await verify(token, process.env.JWT)
                main.likes.forEach((x) => { if (x.email == verified.email) { liked = true } })
                return res.status(200).json({ data: main, liked: liked })
            } catch (err) {
                return res.status(200).json({ data: main, user: false })
            }
        } else {
            return res.status(200).json({ data: main })
        }
    } catch (err) {
        if (err) {
            return res.status(400).json({ data: err })
        }
    }
}

export async function fetchOneArticleOnly(article, req, res) {
    try {
        const main = await Article.findOne({ link: article }, { heading: 1, description: 1, first_half: 1, second_half: 1, category: 1, image: 1 })
        return res.status(200).json({ data: main })
    } catch (err) {
        if (err) {
            return res.status(400).json({ data: err })
        }
    }
}

// Post article API handlers
export async function writeArticle(req, res) {
    let allCLear = null
    let { cookies } = req;
    let { token } = cookies
    if (token) {
        try {
            const verified = await verify(token, process.env.JWT)
            if (verified.role === "admin") {
                allCLear = true
            }
            else {
                return res.status(401).json({ message: "Unauthorized request" })
            }
        } catch (err) {
            return res.status(401).json({ message: "Unauthorized request" })
        }
    } else {
        return res.status(401).json({ message: "Unauthorized request" })
    }
    if (allCLear) {
        let { heading, description, first_half, second_half, category, image } = req.body;
        try {
            let newArticle = new Article({
                heading: heading,
                description: description,
                image: image,
                first_half: first_half,
                second_half: second_half,
                category: category,
                link: heading.split(" ").join("_").replace("?", ""),
                last_updated: Date.now(),
                timeToRead: Math.ceil((first_half.concat(second_half).split(" ").length / 4) / 60)
            })
            await newArticle.save()
            res.status(201).json({ status: "success" })
        } catch (err) {
            if (err) {
                res.status(400).json({ status: "failed", data: err })
            }
        }
    }
}

export async function updateArticle(articleName, req, res) {
    let allCLear = null
    let { cookies } = req;
    let { token } = cookies
    if (token) {
        try {
            const verified = await verify(token, process.env.JWT)
            if (verified.role === "admin") {
                allCLear = true
            }
            else {
                return res.status(401).json({ message: "Unauthorized request" })
            }
        } catch (err) {
            return res.status(401).json({ message: "Unauthorized request" })
        }
    } else {
        return res.status(401).json({ message: "Unauthorized request" })
    }
    if (allCLear) {
        let { heading, description, first_half, second_half, category, image } = req.body;
        try {
            const article = await Article.findOne({ link: articleName });
            article.heading = heading;
            article.description = description;
            article.image = image;
            article.first_half = first_half
            article.second_half = second_half;
            article.category = category;
            article.last_updated = Date.now();
            article.link = heading.split(" ").join("_").replace("?", "")
            await article.save()
            return res.status(204).end()
        } catch (err) {
            if (err) {
                return res.status(400).json({ status: "failed", data: err })
            }
        }
    }
}

// Delete article API handler
export async function deleteArticle(articleName, req, res) {
    let allCLear = null
    let { cookies } = req;
    let { token } = cookies
    if (token) {
        try {
            const verified = await verify(token, process.env.JWT)
            if (verified.role === "admin") {
                allCLear = true
            }
            else {
                return res.status(401).json({ message: "Unauthorized request" })
            }
        } catch (err) {
            return res.status(401).json({ message: "Unauthorized request" })
        }
    } else {
        return res.status(401).json({ message: "Unauthorized request" })
    }
    if (allCLear) {
        try {
            await Article.deleteOne({ link: articleName })
            return res.status(200).json({ status: "success" })
        } catch (err) {
            if (err) {
                return res.status(400).json({ status: "failed", data: err })
            }
        }
    }
}

// Comments and likes API handlers
export async function likeHandler(req, res) {
    let user;
    let { cookies } = req;
    let { token } = cookies
    if (token) {
        try {
            const user1 = await verify(token, process.env.JWT)
            user = user1
        } catch (err) {
            return res.status(401).json({ data: "User not logged in" })
        }
    } else {
        return res.status(401).json({ message: "User not logged in" })
    }
    if (user) {
        const { articleName } = req.query;
        const { action } = req.body;
        try {
            if (action == "like") {
                const like = {
                    email: user.email,
                    name: user.name,
                    time: Date.now()
                }
                const article = await Article.findOne({ link: articleName })
                article.likes.push(like)
                await article.save()
                return res.status(201).json({ status: "success" })
            }
            else if (action == "unlike") {
                const article = await Article.findOne({ link: articleName })
                article.likes = article.likes.filter((x) => { return x.email !== user.email })
                await article.save()
                return res.status(201).json({ status: "success" })
            }
        } catch (err) {
            if (err) {
                res.status(400).json({ status: "failed", data: err })
            }
        }
    }
}

export async function commentHandler(req, res) {
    let user;
    let { cookies } = req;
    let { token } = cookies
    if (token) {
        try {
            const user1 = await verify(token, process.env.JWT)
            user = user1
        } catch (err) {
            return res.status(401).json({ data: "User not logged in" })
        }
    } else {
        return res.status(401).json({ message: "User not logged in" })
    }
    if (user) {
        const { articleName } = req.query;
        const { comment, action } = req.body;
        try {
            if (action == "post") {
                const newComment = {
                    email: user.email,
                    name: user.name,
                    comment: comment
                }
                const article = await Article.findOne({ link: articleName })
                article.comments.push(newComment)
                await article.save()
                return res.status(201).json({ status: "success", data: newComment })
            }
            else if (action == "delete") {
                const article = await Article.findOne({ link: articleName })
                article.comments = article.comments.filter((x) => {
                    return x.comment != comment
                })
                await article.save()
                return res.status(201).json({ status: "success" })
            }
        } catch (err) {
            if (err) {
                res.status(400).json({ status: "failed", data: err })
            }
        }
    }
}

// Auth API handlers
export async function registerUser(req, res) {
    let allClear = null;
    let { cookies } = req;
    let { token } = cookies;
    if (!token) {
        allClear = true;
    } else {
        try {
            const user = await verify(token, process.env.JWT)
            return res.status(401).json({ status: "user unauthenticated" })
        } catch (err) {
            allClear = true;
        }
    }
    if (allClear) {
        try {
            let { name, email, password } = req.body
            name = name.trim().split(" ").map((x) => {
                return x.replace(x[0], x[0].toUpperCase())
            }).join(" ")
            email = email.trim().toLowerCase()
            const hashedPassword = await bcrypt.hash(password, 10)
            const alreadyExists = await User.findOne({ email: email })
            if (alreadyExists) {
                return res.json({ status: "failed", data: "Email already exists" })
            }
            if (email === "yusufahmed195@gmail.com") {
                const user = new User({
                    name: name,
                    email: email,
                    password: hashedPassword,
                    role: "admin"
                })
                await user.save()
            }
            else {
                const user = new User({
                    name: name,
                    email: email,
                    password: hashedPassword,
                })
                await user.save()
            }
            return res.redirect(`/api/auth/local/verification/register?email=${email}`)
        } catch (err) {
            if (err) {
                return res.json({ status: "error", data: err })
            }
        }
    }

}

export async function loginUser(req, response) {
    let allClear = null;
    let { cookies } = req;
    let { token } = cookies
    if (!token) {
        allClear = true;
    } else {
        try {
            const user = await verify(token, process.env.JWT)
            return res.status(401).json({ status: "user unauthenticated" })
        } catch (err) {
            allClear = true;
        }
    }
    if (allClear) {
        const { email, password } = req.body
        try {
            const user = await User.findOne({ email: email })
            if (user) {
                bcrypt.compare(password, user.password, function (err, res) {
                    if (err) {
                        return response.json({ status: "error", data: err })
                    }
                    else if (res) {
                        if (user.verified === true) {
                            const token = sign({ name: user.name.split(" ")[0] + " " + user.name.split(" ")[1], role: user.role, email: user.email }, process.env.JWT);
                            let authCookie = serialize("token", token, { httpOnly: true, secure: true, sameSite: "strict", path: "/" });
                            response.setHeader("Set-Cookie", authCookie)
                            return response.json({ status: "successful login" })
                        }
                        else {
                            return response.redirect(`/api/auth/local/verification/login?email=${email}`)
                        }
                    }
                    else {
                        return response.json({ status: "failed", data: "Invalid password" })
                    }
                })

            }
            else {
                return response.json({ status: "failed", data: "Email not registered" })
            }
        } catch (err) {
            if (err) {
                return response.json({ status: "error", data: err })
            }
        }
    }
}

export async function sendEmailVerification(req, res) {
    let allClear = null;
    let { cookies } = req;
    let { token } = cookies
    if (!token) {
        allClear = true;
    } else {
        console.log("cookie block 2")
        try {
            const user = await verify(token, process.env.JWT)
            return res.status(401).json({ status: "user unauthenticated" })
        } catch (err) {
            allClear = true;
        }
    }
    if (allClear) {
        let { pageType, email } = req.query
        try {
            const user = await User.findOne({ email: email })
            if (!user) {
                return res.json({ status: "failed", data: "Email not registered" })
            }
            else if (user.verified === true) {
                return res.json({ status: "failed", data: "Email already registered and verified. Please log in with this email." })
            }
            else {
                if (pageType === "register") {
                    await transporter.sendMail({
                        from: process.env.EMAIL,
                        to: user.email,
                        subject: "Email verification",
                        html: `<p>Click the following link to verify your account</p>
                <p><a href="https://nextjs-philosophy-blog.vercel.app/api/auth/local/verification/verify?id=${user._id}">Verify email</a></p>`
                    })
                    return res.json({ status: "success" })
                }
                else {
                    await transporter.sendMail({
                        from: process.env.EMAIL,
                        to: user.email,
                        subject: "Email verification",
                        html: `<p>Click the following link to verify your account</p>
                <p><a href="https://nextjs-philosophy-blog.vercel.app/api/auth/local/verification/verify?id=${user._id}">Verify email</a></p>`
                    })
                    return res.json({ status: "successful verification", pageType: "login" })
                }
            }
        } catch (err) {
            if (err) {
                return res.json({ status: "error", data: "Something went wrong..." })
            }
        }
    }
}

// Need to do verification on client side using useEffect
export async function verifyUser(req, res) {
    let { id } = req.query;
    try {
        const user = await User.findOne({ _id: id });
        if (!user) {
            return res.redirect("/auth/verify/false")
        }
        if (user.verified === true) {
            return res.redirect("/auth/verify/alreadyDone")
        }
        else {
            user.verified = true;
            await user.save()
            const token = sign({ name: user.name.split(" ")[0] + " " + user.name.split(" ")[1], role: user.role, email: user.email }, process.env.JWT)
            let authCookie = serialize("token", token, { httpOnly: true, secure: true, sameSite: "strict", path: "/" });
            res.setHeader("Set-Cookie", authCookie)
            return res.redirect("/auth/verify/true")
        }
    } catch (err) {
        if (err) {
            return res.redirect("/auth/verify/false")
        }
    }
}

export async function checkUserAction(req, res) {
    let allClear = null;
    let { cookies } = req;
    let { token } = cookies
    if (!token) {
        allClear = true;
    } else {
        try {
            const user = await verify(token, process.env.JWT)
            res.json({ status: "error", data: err })
        } catch (err) {
            allClear = true;
        }
    }
    if (allClear) {
        const { uid } = req.body
        console.log(uid)
        try {
            const userExists = await userActions.findOne({ unique_id: uid });
            if (userExists) {
                res.json({ status: "success" })
            }
            else {
                res.json({ status: "failed" })
            }
        } catch (err) {
            res.json({ status: "error", data: err })
        }
    }
}

export async function resetPassword(req, res) {
    let allClear = null;
    let { cookies } = req;
    let { token } = cookies
    if (!token) {
        allClear = true;
    } else {
        try {
            const user = await verify(token, process.env.JWT)
            return res.status(401).json({ status: "user unauthenticated" })
        } catch (err) {
            allClear = true;
        }
    }
    if (allClear) {
        let { email, password } = req.body
        if (email && !password) {
            try {
                const userExists = await User.findOne({ email: email })
                if (userExists) {
                    const userActionExists = await userActions.findOne({ email: email })
                    let uid = v4()
                    if (userActionExists) {
                        userActionExists.unique_id = uid;
                        await userActionExists.save()
                    }
                    else {
                        const user = new userActions({
                            email: email,
                            unique_id: uid,
                        })
                        await user.save();
                    }
                    await transporter.sendMail({
                        from: process.env.EMAIL,
                        to: userExists.email,
                        subject: "Reset your password",
                        html: `<p>Click the following link to reset your password</p>
                    <p><a href="https://nextjs-philosophy-blog.vercel.app/auth/reset/${uid}">Reset password</a></p><p>The link will expire in 24 hours</p>`
                    })
                    return res.json({ status: "success", message: "Password reset link sent to email" })
                }
                else {
                    return res.json({ status: "failed", data: "Email not registered. Please enter valid email" })
                }
            } catch (err) {
                return res.json({ status: "error", data: err })
            }
        }
        else if (password && !email) {
            try {
                const { uid } = req.body
                console.log(uid)
                const userAction = await userActions.findOne({ unique_id: uid });
                const email = userAction.email;
                const user = await User.findOne({ email: email })
                const hashedPassword = await bcrypt.hash(password, 10)
                user.password = hashedPassword;
                await user.save()
                await userActions.deleteOne({ unique_id: uid })
                return res.json({ status: "success", message: "password reset successfully" })
            } catch (error) {
                return res.json({ status: "error", data: err })
            }

        }
    }
}

export async function googleAuth(profile, done) {
    try {
        let { displayName, email } = profile
        const alreadyExists = await GoogleUser.findOne({ email: email })
        if (alreadyExists) {
            return done(null, profile)
        }
        if (email === "yusufahmed195@gmail.com") {
            const user = new GoogleUser({
                name: displayName,
                email: email,
                role: "admin"
            })
            await user.save()
        }
        else {
            const user = new GoogleUser({
                name: displayName,
                email: email,
            })
            await user.save()
        }
        profile.randomText = "hello world"
        return done(null, profile, { data: "hello world" })
    } catch (err) {
        if (err) {
            return done(err, null, { data: "hello world" })
        }
    }
}

export async function sendGoogleAuthCookie(err, user, res) {
    try {
        if (err || !user) {
            // return res.redirect("/")
            return res.send("error occured 1")
        }
        if (user) {
            const userExists = await GoogleUser.findOne({ email: user.email })
            if (userExists) {
                const token = sign({ name: userExists.name.split(" ")[0] + " " + userExists.name.split(" ")[1], role: userExists.role, email: userExists.email }, process.env.JWT);
                let authCookie = serialize("token", token, { httpOnly: true, secure: true, sameSite: "strict", path: "/" });
                res.setHeader("Set-Cookie", authCookie)
                // return res.send("cookie set and user authenticated")
                return res.redirect("/")
            }
        }
    } catch (error) {
        // return res.redirect("/")
        return res.send("error occured 2")
    }
}

export async function logOut(req, res) {
    let authCookie = serialize("token", "", { httpOnly: true, secure: true, sameSite: "strict", path: "/", maxAge: 0 });
    res.setHeader("Set-Cookie", authCookie)
    return res.json({ status: "success", message: "cookie cleared" })
}

// Contact API handler
export async function sendContactEmail(req, res) {
    let { name, email, message } = req.body
    name = name.trim()
    email = email.toLowerCase().trim()
    try {
        transporter.sendMail({
            from: process.env.EMAIL,
            to: "yusufahmed195@gmail.com",
            subject: "Contact message",
            html: `<p>Email sent by - ${name}</p><p>Their email is - ${email}</p><p>Message - ${message}</p>`
        }).then((x) => {
            return res.json({ status: "success" })
        })
    } catch (err) {
        if (err) {
            return res.json({ status: "failed", data: err })
        }
    }
}

// Middleware handlers 
export async function checkUserRole(req, res) {
    let { cookies } = req;
    let { token } = cookies
    if (token) {
        try {
            const verified = await verify(token, process.env.JWT)
            return res.status(200).json({ user: verified, role: verified.role })
        } catch (err) {
            return res.status(200).json({ user: false })
        }
    } else {
        return res.status(200).json({ user: false })
    }
}

async function adminOnly(req, res) {
    let { cookies } = req;
    let { token } = cookies
    if (token) {
        try {
            const verified = await verify(token, process.env.JWT)
            console.log(verified)
            if (verified.role === "admin") {
                return true
            }
            else {
                return res.status(401).json({ message: "Unauthorized request" })
            }
        } catch (err) {
            return res.status(401).json({ message: "Unauthorized request" })
        }
    } else {
        return res.status(401).json({ message: "Unauthorized request" })
    }
}

async function usersOnly(req, res) {
    let { cookies } = req;
    let { token } = cookies
    if (token) {
        try {
            const user = await verify(token, process.env.JWT)
            return user
        } catch (err) {
            return res.status(401).json({ data: "User not logged in" })
        }
    } else {
        return res.status(401).json({ message: "User not logged in" })
    }
}

async function loggedOutOnly(req, res) {
    let { cookies } = req;
    let { token } = cookies
    if (!token) {
        return true
    } else {
        try {
            const user = await verify(token, process.env.JWT)
            console.log(user)
            return res.status(401).json("User unauthorized")
        } catch (err) {
            return true
        }
    }
}
