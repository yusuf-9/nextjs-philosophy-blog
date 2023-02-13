import React, { useState, useEffect } from "react";
import Link from "next/link";
import axios from "axios";
import Image from "next/image";
import Logo from "./logo1.png"


function Header({reloader1, triggerReload1}) {
    const [reloader, setReloader] = useState(reloader1)
    const [user, setUser] = useState()
    const [admin, setAdmin] = useState()
    const [checked, setChecked] = useState()

    useEffect(() => {
        axios.get("/api/middleware/checkUserRole", {withCredentials: true}).then((x)=>{
            if (x.data.user) {
                setUser(true)
                if (x.data.role === "admin") {
                    setAdmin(true)
                }
                else{
                    setAdmin(false)
                }
            } else {
                setAdmin(false)
                setUser(false)
                setChecked(true)
            }
        })
    }, [reloader])

    if(reloader !== reloader1){
        setReloader(reloader1)
    }

    // Adding functionality to navbar toggle button
    function toggle() {
        const links = document.querySelector(".nav-links")
        if (links.className == "nav-links") {
            var active = "0%"
            links.style.setProperty("--position", active);
            links.classList.add("active-2");
        } else {
            links.className = "nav-links";
            var notActive = "-102%";
            links.style.setProperty("--position", notActive);
        }
    }

    async function logoutHandler(){
        const response = await axios.get("/api/auth/local/logOut", {withCredentials:true});
        console.log(response)
        if(response.status === 200){
            triggerReload1()
        }
    }
    return (
        <header className="navbar" >
            <Link href='/' className="Page-name">
                The Skeptic Hawk
            </Link>
            <Image src={Logo} className="logo" alt="Logo"/>
            {
                user ? (
                    admin ? (<>
                        <ul className="nav-links">
                            <Link href='/' onClick={toggle} className="nav-link" >
                                <li>Home</li>
                            </Link >
                            <Link href='/articles' onClick={toggle} className="nav-link" >
                                <li>Articles</li>
                            </Link>
                            <Link href='/writeEdit/writeArticle' onClick={toggle} className="nav-link" >
                                <li>Write an article</li>
                            </Link>
                            <a onClick={()=>{logoutHandler(); toggle()}} className="nav-link" >
                                <li>Log out</li>
                            </a>
                            <Link href='/contact' onClick={toggle} className="nav-link">
                                <li>Contact me</li>
                            </Link>
                        </ul >
                        <div className="toggleBtn" title="Show navigation bar" onClick={toggle}>
                            <div className="burger"></div>
                            <div className="burger"></div>
                            <div className="burger"></div>
                        </div>
                    </>
                    ) : (

                        <>
                            <ul className="nav-links"  onClick={toggle}>
                                <Link href='/' className="nav-link" >
                                    <li>Home</li>
                                </Link >
                                <Link href='/articles' onClick={toggle} className="nav-link" >
                                    <li>Articles</li>
                                </Link>
                                <a onClick={()=>{logoutHandler(); toggle()}} className="nav-link" >
                                    <li>Log out</li>
                                </a>
                                <Link href='/contact' onClick={toggle} className="nav-link">
                                    <li>Contact me</li>
                                </Link>
                            </ul >
                            <div className="toggleBtn" title="Show navigation bar" onClick={toggle}>
                                <div className="burger"></div>
                                <div className="burger"></div>
                                <div className="burger"></div>
                            </div>
                        </>
                    )
                ) : ( checked ? (
                    <>
                            <ul className="nav-links">
                                <Link href='/' onClick={toggle} className="nav-link" >
                                    <li>Home</li>
                                </Link >
                                <Link href='/articles' onClick={toggle} className="nav-link" >
                                    <li>Articles</li>
                                </Link>
                                <Link href='/auth/login' onClick={toggle} className="nav-link" >
                                    <li>Login</li>
                                </Link>
                                <Link href='/contact' onClick={toggle} className="nav-link">
                                    <li>Contact me</li>
                                </Link>
                            </ul >
                            <div className="toggleBtn" title="Show navigation bar" onClick={toggle}>
                                <div className="burger"></div>
                                <div className="burger"></div>
                                <div className="burger"></div>
                            </div>
                        </>
                ) : (
            <div id="header-loading" className="lds-dual-ring"></div>
                )
                )
            }
        </header >

    )
}

export default Header;