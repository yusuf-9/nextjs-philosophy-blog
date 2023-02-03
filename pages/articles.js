import axios from "axios";
import Head from "next/head";
import ArticlesSection from "../Components/ArticlesSection/ArticlesSection";
Head

export default function articles({ fetchedArticles1, triggerReload1 }) {
    return (
        <>
    <Head>
        <title>Articles</title>
        <meta name='description' content="Browse articles focused on a range of topics such as religion, ethics, epistemology, consciousness, metaphysics and existentialism." />
    </Head>
        <ArticlesSection triggerReload1={triggerReload1} fetchedArticles1={fetchedArticles1} />
        </>
    )
}

export async function getStaticProps(req, res) {
    let data = await axios.get("http://localhost:3000/api/fetchArticles/articles")
    if (data.data.status === "success") {
        return {
            props: {
                fetchedArticles1: data.data,
            }
        }
    }
    else {
        return {
            props: {
                Error: data.data.err
            }
        }
    }
}