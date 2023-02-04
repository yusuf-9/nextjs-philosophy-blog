import axios from "axios";
import Article from "../../Components/Article/Article";
import Head from "next/head";

export default function articleName({ fetchedArticle1, Error, triggerReload1 }) {
    let {data} = fetchedArticle1;
    let {heading} = data;
    let {description} = data;
    return (
        <>
            <Head>
                <title>{heading}</title>
                <meta name='description' content={description} />
            </Head>
            <Article triggerReload1={triggerReload1} fetchedArticle1={fetchedArticle1} Error={Error} />
        </>
    )
}

export async function getStaticPaths() {
    let data = await axios.get("http://localhost:3000/api/fetchArticles/getAllArticles")
    if (data.data.status === "success") {
        return {
            paths: data.data.data.map((x) => {
                return {
                    params: { articleName: x.link }
                }
            }),
            fallback: "blocking",
        }
    }
}

export async function getStaticProps(context) {
    let data = await axios.get(`http://localhost:3000/api/fetchArticles/article?articleName=${context.params.articleName}`)
    if (data.data.status === "success") {
        return {
            props: {
                fetchedArticle1: data.data,
            }, 
            revalidate: 172800 ,
        }
    }
    else{
        return {
            notFound: true
        }
    }
}