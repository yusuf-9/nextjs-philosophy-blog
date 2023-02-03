import React from "react"
import LoginRegister from "../../Components/LoginRegister/LoginRegister"
import { verify } from "jsonwebtoken";
import Head from "next/head";

export default function authPage({ triggerReload1 }) {
    return (
        <>
    <Head>
        <title>Login</title>
        <meta name='description' content="Login page" />
    </Head>
        <LoginRegister triggerReload1={triggerReload1} />
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