import dbConnect from "../lib/dbConnect";
import HomePage from "../Components/HomePage/HomePage";
import Article from "../models/articleSchema"

export default function Home({TopArticles, SlideArticles, Error, triggerReload1}){
    if(Error){
        return (
            <div className="contact-me-container">
                <h2 id='message-2'>
                    Sorry, something went wrong. PLease come back later
                </h2>
            </div>
        )
    }
    return(
        <>
        <HomePage triggerReload1={triggerReload1} TopArticles={JSON.parse(TopArticles)} SlideArticles={JSON.parse(SlideArticles)} Error={Error}/>
        </> 
    )
}

export async function getStaticProps(context){
    try {
        await dbConnect()
        let articles = await Article.find({}, { heading: 1, description: 1, category: 1, image: 1, timeToRead: 1, date_created: 1 }).sort({ views: -1 });
        let Toparticles = articles.slice(0, 6);
        let random = Math.floor(Math.random() * (articles.length - 3));
        return{
            props: {
                TopArticles: JSON.stringify(Toparticles),
                SlideArticles: JSON.stringify(articles.slice(random, random + 3))
            },
            revalidate: 172800
        }
        
    } catch (err) {
        if (err) {
            return{
                props: {
                    Error: "SOmething went wrong"
                }
            }
        }
    }
}