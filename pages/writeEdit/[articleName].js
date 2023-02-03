import axios from "axios";
import { verify } from "jsonwebtoken";
import WriteEdit from "../../Components/WriteEdit/WriteEdit"

export default function writeOrEdit({ write, article, triggerReload1 }) {
  return (
    <>
      <WriteEdit triggerReload1={triggerReload1} write={write} article={article} />
    </>
  )
}


export async function getServerSideProps(context) {
  const { cookies } = context.req;
  if (!cookies) {
    console.log("no cookies route hit")
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
            props: { write: true }, // will be passed to the page component as props
          }
        }
        else {
          const article = await axios.get(`http://localhost:3000/api/fetchArticles/oneArticle?articleName=${articleName}`, {withCredentials:true})
          console.log(article)
          if (article.status === 200) {
            console.log("success block")
            return {
              props: {
                article: article.data.data
              }
            }
          } else {
            console.log("failed block")
            return {
              redirect: {
                permanent: false,
                destination: '/',
              },
            }
          }
        }
      }
      else {
        console.log("unauthenticated block")
        return {
          redirect: {
            permanent: false,
            destination: '/',
          },
        };
      }
    } catch (err) {
      console.log("error block")
      return {
        redirect: {
          permanent: false,
          destination: '/',
        },
      };
    }
  }

}