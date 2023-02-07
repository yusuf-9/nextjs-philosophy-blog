import axios from "axios";
import dbConnect from "../../lib/dbConnect";
import Article from "../../models/articleSchema"
import ArticleComponent from "../../Components/Article/Article";
import Head from "next/head";
import { parse } from "cookie";

export default function articleName({ fetchedArticle1, Error, triggerReload1 }) {
    if(Error){
        return (
            <div className="contact-me-container">
                <h2 id='message-2'>
                    Sorry, something went wrong. PLease come back later
                </h2>
            </div>
        )
    }
    let {data} = JSON.parse(fetchedArticle1);
    let {heading} = data;
    let {description} = data;
    return (
        <>
            <Head>
                <title>{heading}</title>
                <meta name='description' content={description} />
            </Head>
            <ArticleComponent triggerReload1={triggerReload1} fetchedArticle1={JSON.parse(fetchedArticle1)} />
            <>Hell world</>
        </>
    )
}

export async function getStaticPaths() {
    try {
        await dbConnect()
        const allArticles = await Article.find({}, { link: 1 })
        return {
            paths: allArticles.map((x) => {
                return {
                    params: { articleName: x.link }
                }
            }),
            fallback: "blocking",
        }
    } catch (error) {
        
    }
    // let data = await axios.get("http://localhost:3000/api/fetchArticles/getAllArticles")
    // if (data.data.status === "success") {
    //     return {
    //         paths: data.data.data.map((x) => {
    //             return {
    //                 params: { articleName: x.link }
    //             }
    //         }),
    //         fallback: "blocking",
    //     }
    // }
}

export async function getStaticProps(context) {
    try {
        await dbConnect()
        const main = await Article.findOne({ link: context.params.articleName })
        const currentViews = main.views;
        main.views = currentViews + 1
        await main.save()
        const articleCount = await Article.find({ link: { $ne: context.params.articleName } }).count()
        let random = Math.floor(Math.random() * (articleCount - 3))
        const moreArticles = await Article.find({ link: { $ne: context.params.articleName } }, { heading: 1, image: 1, date_created: 1, timeToRead: 1, category: 1, link: 1 }).skip(random).limit(3)
        return {
            props: {
                fetchedArticle1: JSON.stringify({ data: main, moreArticles: moreArticles }),
            }, 
            revalidate: 172800 ,
        }
    } catch (err) {
        if (err) {
            return {
                redirect: {
                  permanent: false,
                  destination: '/404',
                },
              }
        }
    }
    // let data = await axios.get(`http://localhost:3000/api/fetchArticles/article?articleName=${context.params.articleName}`)
    // if (data.data.status === "success") {
    //     return {
    //         props: {
    //             fetchedArticle1: data.data,
    //         }, 
    //         revalidate: 172800 ,
    //     }
    // }
    // else{
    //     return {
    //         notFound: true
    //     }
    // }
}