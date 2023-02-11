import axios from "axios";
import { verify } from "jsonwebtoken";
import dbConnect from "../../lib/dbConnect"
import Article from "../../models/articleSchema"
import WriteEdit from "../../Components/WriteEdit/WriteEdit"

export default function writeOrEdit({ write, article, triggerReload1 }) {
  if(write){
    return (
      <>
        <WriteEdit triggerReload1={triggerReload1} write={JSON.parse(write)}/>
      </>
    )
  }
  else if(article){
    return (
      <>
        <WriteEdit triggerReload1={triggerReload1} article={JSON.parse(article)} />
      </>
    )
  }
}


export async function getServerSideProps(context) {
  const { cookies } = context.req;
  if (!cookies) {
    
    return {
      redirect: {
        permanent: false,
        destination: '/',
      },
    };
  } else {
    try {
      let { token } = cookies;
      const verified = await verify(token, process.env.JWT)
      if (verified.role === "admin") {
        let { articleName } = context.query;
        if (articleName === "writeArticle") {
          return {
            props: { write: true }, 
          }
        }
        else {
          try {
            await dbConnect()
            const main = await Article.findOne({ link: articleName }, { heading: 1, description: 1, first_half: 1, second_half: 1, category: 1, image: 1 })
            if(main){
              return {
                props: {
                  article: JSON.stringify(main)
                }
              }
            }
            else{
              return {
                redirect: {
                  permanent: false,
                  destination: '/404',
                },
              }
            }
          } catch (err) {
            if (err) {
              return {
                redirect: {
                  permanent: false,
                  destination: '/',
                },
              }
            }
          }
          
        }
      }
      else {
        return {
          redirect: {
            permanent: false,
            destination: '/',
          },
        };
      }
    } catch (err) {
      return {
        redirect: {
          permanent: false,
          destination: '/',
        },
      };
    }
  }

}