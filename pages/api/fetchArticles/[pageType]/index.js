import dbConnect from "../../../../lib/dbConnect";
import {fetchShowcaseArticles, fetchOneArticle, fetchAllArticles, fetchCommentsAndLikes, fetchOneArticleOnly} from "../../apiHandlers";


export default async function handler(req, res){
    await dbConnect()
    let {pageType, articleName} = req.query;
    if(req.method === "GET"){
        if(pageType === "articles"){
            await fetchShowcaseArticles(req, res)
        }
        else if(pageType === "article"){
            await fetchOneArticle(articleName, req, res)
        }
        else if(pageType === "oneArticle"){
            await fetchOneArticleOnly(articleName, req, res)
        }
        else if(pageType === "getAllArticles"){
            await fetchAllArticles(req, res)
        }
        else if(pageType === "commentsAndLikes"){
            await fetchCommentsAndLikes(articleName, req, res)
        }
    }
    else if(req.method === "POST"){

    }
}