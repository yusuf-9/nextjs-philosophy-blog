import React, { useState, useEffect } from 'react'
// import { NavLink, useNavigate } from 'react-router-dom'
import Link from 'next/link'
import Router, { useRouter } from 'next/router'
import axios from 'axios'


export default function LoginRegister({ passwordPage, triggerReload1 }) {
  // const navigate = useNavigate()
  const router = useRouter()
  const [resetPasswordPage, setResetPasswordPage] = useState()
  const [emailSent, setEmailSent] = useState()
  const [resetemailSent, setResetEmailSent] = useState()
  const [email, setEmail] = useState(null)
  const [password, setPassword] = useState(null)

  function login(e) {
    e.preventDefault()
    document.querySelector(".lds-dual-ring").classList.remove("invisible")
    axios.post("/api/auth/local/login", { email: email, password: password }, { withCredentials: true }).then((x) => {
    document.querySelector(".lds-dual-ring").classList.add("invisible")
      if (x.data.status == "successful login") {
        // const refresher = props.refresher
        // refresher()
        // navigate("/")
        console.log(x.data.data)
        triggerReload1()
        router.push("/")
      }
      else if (x.data.status == "successful verification") {
        setEmailSent(true)
      }
      else {
        document.getElementById("error").innerText = x.data.data
        console.log(x.data)
      }
    })
  }

  function resetPassword(e) {
    e.preventDefault()
    document.querySelector(".lds-dual-ring").classList.remove("invisible")
    axios.post("/api/auth/local/resetPassword", { email: email }, { withCredentials: true }).then((x) => {
      if (x.data.status === "success") {
        document.querySelector(".lds-dual-ring").classList.add("invisible")
        document.getElementById("error").innerText = ""
        setResetEmailSent(true)
        setResetPasswordPage(false)
      }
      else {
        document.querySelector(".lds-dual-ring").classList.add("invisible")
        console.log(x.data)
        document.getElementById("error").innerText = x.data.data
      }
    })
  }

  function forgotPasswordPage() {
    setResetPasswordPage(true)
  }

  function changeTologinPage() {
    setResetPasswordPage(false)
    setEmailSent(false)
    setResetEmailSent(false)
  }

  // useEffect(() => {
  //   axios.get("/loginControl", { withCredentials: true }).then((x) => {
  //     if (x.data.status !== "success") {
  //       navigate("/")
  //     }
  //   })
  // }, [])


  return (
    emailSent ? (
      <div className="contact-me-container">
        <h2 id='message-2'>
          A verification email has been sent to your email. Please confirm your email to log in.
          <br></br>
          If you cannot find the email, please check your spam folder.
          <br></br>
          <Link href="/">Click here to return to the home page</Link>
        </h2>
      </div>
    ) : resetPasswordPage ? (
      <div id="contact-form" className="contact-me-container">
        <h1>Reset your password</h1>
        <form action='/login' method='post' className="contact-form">
          <label htmlFor="email" id="name-label" className="full-width">Your email</label>
          <input type="email" className="name input full-width" id="name" name="email" placeholder="Email" onChange={(e) => { setEmail(e.target.value) }} required />
          <div className='button-container'>
            <button type="submit" className="submit-button" onClick={(event) => { resetPassword(event) }}>Submit</button>
            <div id="contact-form-loading" className="lds-dual-ring invisible"></div>
          </div>
          <span id='error'></span>
          <a onClick={changeTologinPage}>Go back to login page</a>
          <span className='link'>Don't have an account?</span><Link href="/auth/register">Click here to register</Link>
        </form>
      </div>
    ) : resetemailSent ? (
      <div className="contact-me-container">
        <h2 id='message-2'>
          A password reset link has been sent to your email. Please use it to change your password.
          <br></br>
          If you cannot find the email, please check your spam folder.
          <br></br>
          <a style={{ "textDecoration": "underline", "color": "Highlight" }} onClick={changeTologinPage}>Click here to return to the login page</a>
        </h2>
      </div>
    ) : (
      <div id="contact-form" className="contact-me-container">
        <h1>Login</h1>
        <form action='/login' method='post' className="contact-form">
          <label htmlFor="email" id="name-label" className="full-width">Your email</label>
          <input type="email" className="name input full-width" id="name" name="email" placeholder="Email" onChange={(e) => { setEmail(e.target.value) }} required />
          <label htmlFor="password" id="email-label" className="full-width">Your password</label>
          <input type="password" className="email input full-width" id="email" name="password" placeholder="Password" onChange={(e) => { setPassword(e.target.value) }} required />
          <a onClick={forgotPasswordPage} className="forgot-link">Forgot your password?</a>
          <div className='button-container'>
            <button type="submit" className="submit-button" onClick={(event) => { login(event) }}>Log in</button>
            <div id="contact-form-loading" className="lds-dual-ring invisible"></div>
          </div>
          <span id='error'></span>
          <a className='google-login' href="/api/auth/google">
            Login with google
            <img src='../google.svg' className='google-logo' />
          </a>

          <span className='link'>Don't have an account?</span><Link className='no-decoration' href="/auth/register">Click here to register</Link>
        </form>
      </div>
    )
  )
}

