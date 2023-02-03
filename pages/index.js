import axios from "axios";
import HomePage from "../Components/HomePage/HomePage";

export default function Home({TopArticles, SlideArticles, Error, triggerReload1}){
    return(
        <>
        <HomePage triggerReload1={triggerReload1} TopArticles={TopArticles} SlideArticles={SlideArticles} Error={Error}/>
        </> 
    )
}

export async function getStaticProps(req, res){
    let data = await axios.get("http://localhost:3000/api/fetchArticles")
    if(data.data.status === "success"){
        return{
            props: {
                TopArticles: data.data.data,
                SlideArticles: data.data.x
            }
        }
    }
    else{
        return{
            props: {
                Error: data.data.err
            }
        }
    }
}