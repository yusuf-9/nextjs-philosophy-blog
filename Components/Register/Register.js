import React, { useEffect, useState } from 'react'
// import { NavLink, useNavigate } from 'react-router-dom'
import Link from 'next/link'
import axios from 'axios'


export default function Register() {
  // const navigate = useNavigate()
  const [registerProcess, setRegisterProcess] = useState()
  const [name, setName] = useState(null)
  const [email, setEmail] = useState(null)
  const [password, setPassword] = useState(null)

  function nameValidator(e) {
    if (e.target.value.trim().length < 6) {
      document.getElementById("name-error").style.color = "red"
    }
    else {
      document.getElementById("name-error").style.color = "black"
    }
  }
  function passwordValidator(e) {
    if (e.target.value.length < 6) {
      document.getElementById("password-error").style.color = "red"
    }
    else {
      document.getElementById("password-error").style.color = "black"
    }
  }
  function emailValidator(e) {
    if (e.target.value.length < 14 || !e.target.value.includes("@")) {
      document.getElementById("email-error").style.color = "red"
    }
    else {
      document.getElementById("email-error").style.color = "black"
    }
  }
  function Error(x) {
    if (x === 1) {
      document.getElementById('name-error').classList.remove("invisible")
    }
    else if (x === 2) {
      document.getElementById('email-error').classList.remove("invisible")
    }
    else if (x === 3) {
      document.getElementById('password-error').classList.remove("invisible")
    }
    else if (x === 4) {
      document.getElementById('name-error').classList.add("invisible")
    }
    else if (x === 5) {
      document.getElementById('email-error').classList.add("invisible")
    }
    else if (x === 6) {
      document.getElementById('password-error').classList.add("invisible")

    }
  }

  function registerUser(e) {
    e.preventDefault();
    var validated = true;
    if (name.trim().length < 6 || password.length < 6 || email.length < 14 || !email.includes("@")) {
      validated = false
      if (name.trim().length < 6) {
        document.getElementById("name-error").classList.remove("invisible")
        document.getElementById("name-error").style.color = "red"
      }
      if (password.length < 6) {
        document.getElementById("password-error").classList.remove("invisible")
        document.getElementById("password-error").style.color = "red"
      }
      if (email.length < 14 || !email.includes("@")) {
        document.getElementById("email-error").classList.remove("invisible")
        document.getElementById("email-error").style.color = "red"
      }
    }
    if (validated === true) {
      document.querySelector(".lds-dual-ring").classList.remove("invisible")
      axios.post("/api/auth/local/register", { name: name, email: email, password: password }, {withCredentials:true}).then((x) => {
        document.querySelector(".lds-dual-ring").classList.add("invisible")
        if (x.data.status === "success") {
          setRegisterProcess(true)
        }
        else if (x.data.status === "failed") {
          document.getElementById("error").innerText = x.data.data
        }
        else {
          document.getElementById("error").innerText = "An error occurred. Please try again later"

        }
      })
    }


  }

  // useEffect(() => {
  //   axios.get("/loginControl", { withCredentials: true }).then((x) => {
  //     if (x.data.status !== "success") {
  //       navigate("/")
  //     }
  //   })
  // }, [])



  return (
    registerProcess ? (
      <div className="contact-me-container">
        <h2 id='message-2'>
          A verification email has been sent to your email. Please confirm your email to log in.
          <br></br>
          If you cannot find the email, please check your spam folder.
          <br></br>
          <Link href="/">Click here to return to the home page</Link>
        </h2>
      </div>
    ) : (
      <div className="contact-me-container">
        <h1>Register</h1>
        <form className="contact-form">
          <label htmlFor="name" className='full-width'>Your name</label>
          <input type="text" className="name input no-margin full-width" id="name1" name="name" placeholder="Name" onFocus={() => { Error(1) }} onBlur={() => { Error(4) }} onChange={(e) => { setName(e.target.value); nameValidator(e) }} required />
          <span id='name-error' className='error-text invisible'>Name must be atleast 6 characters long</span>
          <label htmlFor="email" className='full-width'>Your email</label>
          <input type="email" className="name input no-margin full-width" id="name" name="email" placeholder="Email" onFocus={() => { Error(2) }} onBlur={() => { Error(5) }} onChange={(e) => { setEmail(e.target.value); emailValidator(e) }} required />
          <span id='email-error' className='error-text invisible'>Email must be valid</span>
          <label htmlFor="password" className='full-width'>Your password</label>
          <input type="password" className="email input no-margin full-width" id="email" name="password" placeholder="Password" onFocus={() => { Error(3) }} onBlur={() => { Error(6) }} onChange={(e) => { setPassword(e.target.value); passwordValidator(e) }} required />
          <span id='password-error' className='error-text invisible'>Password must be atleast 6 characters long</span>
          <div className='button-container'>
            <button type="submit" className="submit-button" onClick={(event) => { registerUser(event) }}>Register</button>
            <div id="contact-form-loading" className="lds-dual-ring invisible"></div>
          </div>


          <span id='error'></span>
          <a className='google-login' href="/api/auth/google">
            Register with google
            <img src='../google.svg' className='google-logo' />
          </a>
          <span className='link-2'>Already have an account?</span><Link href="/auth/login">Click here to Log in</Link>
        </form>
      </div>
    )
  )
}
