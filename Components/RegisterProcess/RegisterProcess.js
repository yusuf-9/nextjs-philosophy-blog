import React, { useEffect, useState } from 'react'
import "./RegisterProcess.css"
import { NavLink, useNavigate } from 'react-router-dom'
import axios from 'axios'


export default function RegisterProcess(props) {
  const navigate = useNavigate()
  const [pageType, setPageType] = useState(null)
  const [error, setError] = useState()

  useEffect(() => {
    const url = window.location.href.split("/");
    let page = url[url.length - 2]
    if (page === "registerProcess") {
      axios.get(`/register/${url[url.length - 1]}`, { withCredentials: true }).then((x) => {
        if (x.data.status == "success") {
          setPageType("registerPage")
        }
        else {
          setError(x.data.data)
        }
      })
    }
    else if (page === "verify") {
      axios.get(`/verifyAPI/${url[url.length - 1]}`, { withCredentials: true }).then((x) => {
        if (x.data.status === "success") {
          setPageType({ page: "verificationPage", text: "Your email has been verified." })
          setTimeout(() => {
            const refresher = props.refresher
            refresher()
            navigate("/")
          }, 5000)
        }
        else if (x.data.status === "failed") {
          setPageType({ page: "verificationPage", text: "Your email has already been verified." })
          setTimeout(() => {
            const refresher = props.refresher
            refresher()
            navigate("/")
          }, 5000)

        }
        else {
          setTimeout(() => {
            const refresher = props.refresher
            refresher()
            navigate("/")
          }, 5000)
        }
      })
    }
  }, [])




  return (
    pageType ? (
      pageType === "registerPage" ? (
        <div className="contact-me-container">
          <h2 id='message-2'>
            A verification email has been sent to your email. Please confirm your email to log in.
            <br></br>
            If you cannot find the email, please check your spam folder.
            <br></br>
            <NavLink to="/home">Click here to return to the home page</NavLink>
          </h2>
        </div>
      ) : (
        <div className="contact-me-container">
          <h2 id='message-2'>
            {pageType.text}
            <br>
            </br>
            Auto-redirecting to home page in 5 seconds.
          </h2>
        </div>
      )
    ) : (
      error ? (
        <div className="contact-me-container">
          <h2 id='message-2'>
            {error}
          </h2>
        </div>
      ) : (
        <div className="contact-me-container">
          <h2 id='message-2'>
            Loading...
          </h2>
        </div>
      )

    )
  )
}
