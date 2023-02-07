import axios from "axios";
import dbConnect from "../lib/dbConnect";
import Article from "../models/articleSchema"

import Head from "next/head";
import ArticlesSection from "../Components/ArticlesSection/ArticlesSection";
Head

export default function articles({ fetchedArticles1, triggerReload1, Error }) {
    if(Error){
        return (
            <div className="contact-me-container">
                <h2 id='message-2'>
                    Sorry, something went wrong. PLease come back later
                </h2>
            </div>
        )
    }
    return (
        <>
            <Head>
                <title>Articles</title>
                <meta name='description' content="Browse articles focused on a range of topics such as religion, ethics, epistemology, consciousness, metaphysics and existentialism." />
            </Head>
            <ArticlesSection triggerReload1={triggerReload1} fetchedArticles1={JSON.parse(fetchedArticles1)} />
        </>
    )
}

export async function getStaticProps(context) {
    try {
        await dbConnect()
        const articles = await Article.find({}, { heading: 1, category: 1, image: 1, timeToRead: 1, date_created: 1 }).sort({ last_updated: -1 }).limit(9)
        return {
            props: {
                fetchedArticles1: JSON.stringify({ data: articles, page: { nextPage: 1 } }),
            },
            revalidate: 172800
        }
    } catch (error) {
        return {
            props: {
                Error: "Something went wrong"
            }
        }
    }
}