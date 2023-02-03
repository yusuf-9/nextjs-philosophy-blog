import Head from "next/head";
import ContactForm from "../Components/ContactForm/ContactForm";



export default function contact() {
    return (
        <>
            <Head>
                <title>Contact me</title>
                <meta name='description' content="Leave me a message for a prompt response." />
            </Head>
            <ContactForm />
        </>
    )
}