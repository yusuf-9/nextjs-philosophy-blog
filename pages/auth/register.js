import Register from "../../Components/Register/Register"
import { verify } from "jsonwebtoken";
import Head from "next/head";


export default function RegisterPage({ triggerReload1 }) {
    return (
        <>
    <Head>
        <title>Register</title>
        <meta name='description' content="Register page" />
    </Head>
        <Register triggerReload1={triggerReload1} />
        </>
    )
}

export async function getServerSideProps(context) {
    const { cookies } = context.req;
    if (!cookies) {
        return {
            props: {}
        }
    } else {
        try {
            let { token } = cookies;
            const verified = await verify(token, process.env.JWT)
            return {
                redirect: {
                    permanent: false,
                    destination: '/',
                }
            }
        } catch (err) {
            return {
                props: {}
            };
        }
    }
}