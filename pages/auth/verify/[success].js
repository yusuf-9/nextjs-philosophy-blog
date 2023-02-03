import Head from "next/head";
import Link from "next/link";
import { useEffect } from "react";

export default function verify({ success, alreadyDone, triggerReload1 }) {
    useEffect(() => {
        if (success) {
            triggerReload1()
        }
    }, [])

    return (
        <>
            <Head>
                <title>Verify your email</title>
                <meta name='description' content="Verify your email" />
            </Head>
            success ? (
            <div className="contact-me-container">
                <h2 id='message-2'>
                    Email verified successfully! You are logged in now.
                    <br></br>
                    <Link href="/">Click here to return to the home page</Link>
                </h2>
            </div>
            ) : alreadyDone ? (
            <div className="contact-me-container">
                <h2 id='message-2'>
                    Email already verified. Please log in with this email.
                    <br></br>
                    <Link href="/auth/login">Click here to go to the login page</Link>
                </h2>
            </div>
            ) : (
            <div className="contact-me-container">
                <h2 id='message-2'>
                    Invalid verification link.
                    <br></br>
                    <Link href="/auth/login">Click here to go to the login page</Link>
                </h2>
            </div>
            )
        </>

    )
}

export function getServerSideProps(context) {
    let { success } = context.query;
    if (success === "true") {
        return {
            props: {
                success: true
            }
        }
    }
    else if (success === "alreadyDone") {
        return {
            props: {
                alreadyDone: true
            }
        }
    }
    else if (success === "false") {
        return {
            props: {
            }
        }
    }
}