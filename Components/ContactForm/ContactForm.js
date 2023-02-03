import React from "react";
import axios from "axios";


function ContactForm() {

    function registerUser(e) {
        e.preventDefault();
        const name = document.getElementById("name").value.trim()
        const email = document.getElementById("email").value.trim().toLowerCase()
        const message = document.getElementById("message").value
        if(name && email && message){

            document.querySelector(".lds-dual-ring").classList.remove("invisible")
            axios.post("/api/contact", { name: name, email: email, message: document.getElementById("message").value }).then((x) => {
            if (x.data.status === "success") {
                document.querySelector(".lds-dual-ring").classList.add("invisible")
                document.getElementById("error").style.color = "black"
                document.getElementById("error").innerText = "Message sent successfully"
            }
            else if (x.data.status === "failed") {
                document.querySelector(".lds-dual-ring").classList.add("invisible")
                document.getElementById("error").innerText = x.data.data
                console.log(x.data)
            }
        })
    }
    else{
        document.getElementById("error").innerText = "Please fill out the fields properly"
    }
    }



    return (
        <div id="contact-form" className="contact-me-container">
            <h1>Contact me</h1>
            <form action="submit" className="contact-form">
                <label htmlFor="name" className="full-width">Your Name</label>
                <input type="text" className="name input full-width" id="name" placeholder="Name" required />
                <label htmlFor="email" className="full-width">Your Email</label>
                <input type="email" className="email input full-width" id="email" placeholder="Email" required />
                <label htmlFor="message" className="full-width">Leave your message below</label>
                <textarea id="message" name="message" className="message input full-width" placeholder="Enter your message here"></textarea>
                <div className='button-container'>
                    <button type="submit" className="submit-button" onClick={registerUser}>Submit</button>
                    <div id="contact-form-loading" className="lds-dual-ring invisible"></div>
                </div>
                <span id="error"></span>
            </form>
        </div >
    )
}

export default ContactForm