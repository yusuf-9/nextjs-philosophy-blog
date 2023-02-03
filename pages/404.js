import Head from "next/head"
import Link from "next/link"

export default function errorPage() {


    return (
        <>
            <Head>
                <title>404 | Page not found</title>
            </Head>
            <div className="contact-me-container">
                <h2 id='message-2'>
                    The requested page does not exist
                    <br></br>
                    <Link href="/">Click here to return to the home page</Link>
                </h2>
            </div>
        </>
    )
}