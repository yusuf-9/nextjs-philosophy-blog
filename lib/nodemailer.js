import { createTransport } from "nodemailer"

const transporter = createTransport({
    service: "hotmail",
    auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD
    }
})

transporter.verify((error, success) => {
    if (error) { console.log(error) }
    else {
        console.log("mailer is working")
    }
})

export default transporter;