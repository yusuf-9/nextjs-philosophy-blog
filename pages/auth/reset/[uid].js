import ResetPassword from "../../../Components/resetPassword/resetPassword"
import { verify } from "jsonwebtoken";
import Head from "next/head";

export default function verifyAndReset({triggerReload1}) {
    return (
        <>
    <Head>
    <title>Reset your password</title>
    <meta name='description' content="Reset your password" />
</Head>
        <ResetPassword triggerReload1={triggerReload1}/>
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
