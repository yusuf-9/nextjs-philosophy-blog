import React, { useState, useEffect, useId } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link';
// import { NavLink, useNavigate, useParams } from 'react-router-dom'
import axios from 'axios'


export default function ResetPassword(props) {
    // const navigate = useNavigate()
    // const { action } = useParams()
    const router = useRouter();
    const [loading, setLoading] = useState(true)
    const [resetForm, setResetForm] = useState()
    const [error, setError] = useState()
    const [message, setMessage] = useState("")
    const [form, setForm] = useState()
    const [password, setPassword] = useState(null)

    useEffect(() => {
        // axios.get("/loginControl", { withCredentials: true }).then((x) => {
        //     if (x.data.status !== "success") {
        //         navigate("/")
        //     }
        // })
        // if (action === "email_sent") {
        //     setMessage("A password reset link has been sent to your email. Please use it to reset your password.")
        // }
        // else if (action === "reset_successful") {
        //     setMessage("Password changed successfully. Redirecting to login page in 5 seconds.")
        // }
        // else {
        const uid = window.location.href.split("/")[window.location.href.split("/").length - 1]
        axios.post(`/api/auth/local/checkUserAction`, { uid: uid }).then((x) => {
            if (x.data.status === "success") {
                setResetForm(true)
                setLoading(false)
                console.log(x.data)
            }
            else {
                setError(true)
                setLoading(false)
                console.log(x.data)
                // setMessage("User does not have permission to access this page. Redirecting to login page in 5 seconds.")
                // setTimeout(() => {
                //     navigate("/login")
                // }, 5000)
            }
        })
        // }
    }, [])

    function resetPassword(e) {
        e.preventDefault()
        var validated = true;
        if (password.length < 6) {
            validated = false
            document.getElementById("password-error").classList.remove("invisible")
            document.getElementById("password-error").style.color = "red"
        }
        if (validated === true) {
            document.querySelector(".lds-dual-ring").classList.remove("invisible")
            const uid = window.location.href.split("/")[window.location.href.split("/").length - 1]
            axios.post("/api/auth/local/resetPassword", { uid: uid, password: password }, { withCredentials: true }).then((x) => {
                if (x.data.status === "success") {
                    console.log(x.data)
                    document.querySelector(".lds-dual-ring").classList.add("invisible")
                    setResetForm(false)
                }
            })
        }
    }
    function Error(x) {
        if (x === 3) {
            document.getElementById('password-error').classList.remove("invisible")
        }
        else if (x === 6) {
            document.getElementById('password-error').classList.add("invisible")
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


    return (
        loading || resetForm ? (
            loading ? (
                <div className="contact-me-container">
                    <h2>Loading...</h2>
                </div>
            ) : (
                <div className="contact-me-container">
                    <h1>Enter new password</h1>
                    <form action='/login' method='post' className="contact-form">
                        <label htmlFor="password" className='full-width'>New password</label>
                        <input type="password" className="email input no-margin full-width" id="email" name="password" placeholder="Password" onFocus={() => { Error(3) }} onBlur={() => { Error(6) }} onChange={(e) => { setPassword(e.target.value); passwordValidator(e) }} required />
                        <span id='password-error' className='error-text invisible'>Password must be atleast 6 characters long</span>
                        <div className='button-container'>
                            <button type="submit" className="submit-button" onClick={(event) => { resetPassword(event) }}>Submit</button>
                            <div id="contact-form-loading" className="lds-dual-ring invisible"></div>
                        </div>
                        <span id='error'></span>
                        <Link href="/auth/login">Go back to login page</Link>
                        <span className='link'>Don't have an account?</span><Link href="/auth/register">Click here to register</Link>
                    </form>
                </div>
            )
        ) : (
            error ? (
                <div className="contact-me-container">
                    <h2>User does not have permission to access this page.</h2>
                </div>
            ) : (
                <div className="contact-me-container">
                    <h2>Password reset successfully!
                        <br></br>
                        Please log in using the new password.
                        <br></br>
                        <Link href="/auth/login">Click here to return to login page</Link>
                    </h2>
                </div>
            ))
    )
}

