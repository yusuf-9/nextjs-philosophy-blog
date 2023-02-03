import React, { useState, useEffect } from "react";
// import { NavLink, useNavigate, useParams } from "react-router-dom";
import { useRouter } from "next/router";
import Link from "next/link";
import axios from "axios";
import Image from "next/image";



function Article({ fetchedArticle1, Error, triggerReload1 }) {
    // Defining states
    const router = useRouter()
    let { articleName } = router.query;
    const [fetchedArticle, setFetchedArticle] = useState(fetchedArticle1)
    const [reloader, setReloader] = useState(0)
    const [admin, setAdmin] = useState()
    const [user, setUser] = useState()
    const [liked, setLiked] = useState()
    const [fetchedComments, setFetchedComments] = useState()

    useEffect(() => {
        fetch("/api/middleware/checkUserRole").then((y) => {
            y.json().then((x) => {
                console.log(x)
                if (x.user) {
                    setUser(x.user)
                    if (x.role === "admin") {
                        setAdmin(true)
                    }
                }
            })
        })
        // axios.get("/api/middleware/checkUserRole", { withCredentials: true }).then((x) => {
        //     console.log(x.data)
        //     if (x.data.user) {
        //         setUser(x.data.user)
        //         if (x.data.role === "admin") {
        //             setAdmin(true)
        //         }
        //     }
        // })
        axios.get(`/api/fetchArticles/commentsAndLikes?articleName=${articleName}`).then((x) => {
            if (x.data.liked) {
                setLiked(true)
            }
            setFetchedComments(x.data.data)
        })

        buttonHover()
    }, [reloader])


    // Some frontend JS
    function buttonHover() {
        const articles = document.querySelectorAll('.article');
        Array.from(articles).forEach((x) => {
            x.addEventListener("mouseover", function () {
                const articleChildren = x.children.item(3);
                articleChildren.children[0].style.animation = "onHover 0.5s forwards"
            })
        })
        Array.from(articles).forEach((x) => {
            x.addEventListener("mouseout", function () {
                const articleChildren = x.children.item(3);
                articleChildren.children[0].style.animation = "onMouseOut 0.5s forwards"
            })
        })
    }

    function routeAndTrigger(x) {
        triggerReload1()
        setFetchedComments(null)
        router.push(x)
        setTimeout(() => {
            setReloader(reloader + 1)
        }, 5000)
    }

    function deleteArticle() {
        axios.delete(`/api/articleActions/${fetchedArticle.data.link}`, { withCredentials: true }).then((x) => {
            console.log(x.data)
            router.push(`/articles`)

        })
    }

    function likeButtonFunctionality(e) {
        if (!user) {
            window.alert("You need to log in to be able to leave a like")
        }
        else {
            const likeCountSpan = document.querySelector(".like-count")
            const likeCount = likeCountSpan.innerText;
            if (!e.target.classList.contains("active")) {
                axios.post(`/api/articleActions/commentAndLike/like?articleName=${articleName}`, { action: "like" }, { withCredentials: true }).then((x) => {
                    if (x.status === 201) {
                        e.target.classList.add("active");
                        likeCountSpan.innerText = Number(likeCount) + 1
                    }
                    else {
                        window.alert(x.data.data)
                    }
                })

            }
            else {
                axios.post(`/api/articleActions/commentAndLike/like?articleName=${articleName}`, { action: "unlike" }, { withCredentials: true }).then((x) => {
                    if (x.status == 201) {
                        e.target.classList.remove("active");
                        likeCountSpan.innerText = likeCount - 1
                    }
                    else {
                        window.alert(x.data.data)
                    }
                })
            }
        }
    }

    function Emptier() {
        const textarea = document.getElementById("write-comment")
        textarea.value = ""
    }

    function postComment() {
        const commentCount = document.getElementById("comment-count")
        const textarea = document.getElementById("write-comment")
        if (textarea.value.trim().length > 0) {
            axios.post(`/api/articleActions/commentAndLike/comment?articleName=${articleName}`, { action: "post", comment: textarea.value }, { withCredentials: true }).then((x) => {
                console.log(x.data)
                if (x.status === 201) {
                    const commentDiv = document.createElement("div")
                    commentDiv.className = ("write-comment deletable-div")
                    const imgAndName = document.createElement("div")
                    imgAndName.classList.add("image-and-name")
                    const img = document.createElement("img")
                    img.classList.add("user-icon");
                    img.src = "../user-icon.webp"
                    const userName = document.createElement("span")
                    userName.classList.add("username");
                    userName.innerText = x.data.data.name
                    const commentText = document.createElement("textarea")
                    commentText.className = "write-a-comment auto-height deletable-text";
                    commentText.value = x.data.data.comment
                    commentText.setAttribute("readonly", true)
                    const deleteBtnDiv = document.createElement("div")
                    deleteBtnDiv.classList.add("comment-buttons")
                    const deleteBtn = document.createElement("button")
                    deleteBtn.classList.add("post-comment")
                    deleteBtn.innerText = "Delete comment"
                    deleteBtn.addEventListener("click", commentDeleter);
                    deleteBtnDiv.append(deleteBtn);
                    const textAndBtnDiv = document.createElement("div")
                    textAndBtnDiv.append(commentText, deleteBtnDiv)
                    imgAndName.append(img, userName)
                    commentDiv.append(imgAndName, textAndBtnDiv)
                    const commentSection = document.querySelector(".comment-section")
                    commentSection.append(commentDiv);
                    textarea.value = ""
                    commentCount.innerText = Number(commentCount.innerText) + 1
                }
                else {
                    window.alert("User not logged in")
                }
            })

        } else {
            window.alert("Please type a valid comment")
        }

    }

    function alert(e) {
        if (!user) {
            window.alert("You need to log in to be able to comment")
        }
    }

    function commentDeleter(e) {
        const commentCount = document.getElementById("comment-count")
        const commentText = e.target.parentNode.parentNode.children[0].value;
        axios.post(`/api/articleActions/commentAndLike/comment?articleName=${articleName}`, { action: "delete", comment: commentText }, { withCredentials: true }).then((x) => {
            if (x.status === 201) {
                const commentDiv = e.target.parentNode.parentNode.parentNode
                const commentSection = document.querySelector(".comment-section")
                commentSection.removeChild(commentDiv)
                commentCount.innerText = Number(commentCount.innerText) - 1
            }
        })
    }

    if (fetchedArticle1 !== fetchedArticle) {
        setFetchedArticle(fetchedArticle1)
        // setReloader(true)
    }

    return (
        fetchedArticle ? (
            <>
                <div className="article-container-2" onClick={() => { console.log(fetchedComments) }}>
                    {admin ? (
                        <>
                            <Link href={`/writeEdit/${fetchedArticle.data.link}`} id="edit">
                                <button>Edit article</button>
                            </Link>
                            <a onClick={deleteArticle} id="delete">
                                <button>Delete article</button>
                            </a>
                        </>
                    ) : (
                        <></>
                    )}
                    <div id="article-logo-background">
                        <Image src={`/${fetchedArticle.data.category}.jpg`} height="100" width={"100"} className="article-logo-img" alt="Article logo" />
                    </div>
                    <div className="heading-and-byline">
                        <h1 className="article-heading">{fetchedArticle.data.heading}</h1>
                        <div>
                            <span>{`By ${fetchedArticle.data.written_by} `}</span>  |  <span>{` ${fetchedArticle.data.date_created} `}</span>  |  <span>{` ${fetchedArticle.data.timeToRead} min read`}</span>
                        </div>
                    </div>
                    <div className="hr-2">
                        <hr />
                    </div>
                    <div className="article-content">
                        <p id="first_half" dangerouslySetInnerHTML={{ __html: fetchedArticle.data.first_half }}></p>
                        <div className="article-content-image-div">
                        <Image src={fetchedArticle.data.image} fill={true} className="article-content-image" alt="Article image" />
                        </div>
                        <p id="second_half" dangerouslySetInnerHTML={{ __html: fetchedArticle.data.second_half }}></p>
                        <div className="advertisement"></div>
                    </div>
                    <div className="hr-2">
                        <hr />
                    </div>
                    <div className="comments-and-morearticles">
                        {fetchedComments ? (
                            <div className="comment-section">
                                <div className="comments-and-likes-count">
                                    <h1 className="read-similar-articles-heading media-query" id="comments-heading">Comments (<span id="comment-count">{fetchedComments.comments.length}</span>)</h1>
                                    <div className="like-button-container">
                                        {liked ? (
                                            <span className="material-symbols-outlined active" onClick={(event) => { likeButtonFunctionality(event) }}>
                                                thumb_up
                                            </span>
                                        ) : (
                                            <span className="material-symbols-outlined" onClick={(event) => { likeButtonFunctionality(event) }}>
                                                thumb_up
                                            </span>
                                        )}
                                        <span className="like-count">
                                            {fetchedComments.likes.length}
                                        </span>
                                    </div>
                                </div>
                                <div className="write-comment">
                                    <div className="image-and-name">
                                        <Image src="/user-icon.webp" height={50} width={50} className="user-icon"  alt="user icon" />
                                        {user ? (
                                            <span className="username">
                                                {user.name}
                                            </span>
                                        ) : (<span className="username"></span>)}
                                    </div>
                                    <div>
                                        <textarea placeholder="Leave a comment" name="comment" className="write-a-comment"
                                            id="write-comment" onClick={(event) => { alert(event) }}></textarea>
                                        {user ? (
                                            <div className="comment-buttons">
                                                <button className="cancel-comment" onClick={Emptier}>Cancel</button>
                                                <button className="post-comment" onClick={postComment}>Post</button>
                                            </div>
                                        ) : (<></>)}

                                    </div>
                                </div>

                                {fetchedComments.comments.map((x) => {
                                    if (user) {
                                        if (user.email == x.email) {
                                            return (<div className="write-comment deletable-div">
                                                <div className="image-and-name">
                                                    <Image src="/user-icon.webp" height={50} width={50} className="user-icon"  alt="user icon" />
                                                    <span className="username">
                                                        {x.name}
                                                    </span>
                                                </div>
                                                <div>
                                                    <textarea className="write-a-comment auto-height deletable-text" value={x.comment}
                                                    readOnly></textarea>
                                                    <div className="comment-buttons">
                                                        {user && user.email == x.email && (
                                                            <button className="post-comment" onClick={(event) => { commentDeleter(event) }}>Delete comment</button>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>)
                                        }
                                        else {
                                            return (<div className="write-comment">
                                                <div className="image-and-name">
                                                    <Image src="/user-icon.webp" height={50} width={50} className="user-icon"  alt="user icon" />
                                                    <span className="username">
                                                        {x.name}
                                                    </span>
                                                </div>
                                                <div>
                                                    <textarea className="write-a-comment auto-height deletable-text" value={x.comment}
                                                     readOnly></textarea>
                                                    <div className="comment-buttons">
                                                    </div>
                                                </div>
                                            </div>)
                                        }
                                    }
                                    else {
                                        return (<div className="write-comment">
                                            <div className="image-and-name">
                                                <Image src="/user-icon.webp" height={50} width={50} className="user-icon" alt="user icon" />
                                                <span className="username">
                                                    {x.name}
                                                </span>
                                            </div>
                                            <div>
                                                <textarea className="write-a-comment auto-height deletable-text" value={x.comment}
                                                readOnly></textarea>
                                                <div className="comment-buttons">
                                                </div>
                                            </div>
                                        </div>
                                        )
                                    }
                                }
                                )
                                }
                            </div>
                        ) : (
                            <div className="comment-section">
                                <div className="loader-div">
                                    <div className="lds-dual-ring"></div>
                                </div>
                            </div>
                        )}

                        <div className="more-articles">
                            <h1 className="read-similar-articles-heading media-query">Read similar articles</h1>
                            <div className="article-showcase-2 exception-showcase">
                                {
                                    fetchedArticle.moreArticles.map((z, i) => {
                                        let link = `/article/${z.link}`;
                                        return (
                                            <div className="article exception new-size" key={z.heading}>
                                                <Image src={z.image} fill={true} className="article-background" alt="Article image" />
                                                <div className="article-logo">
                                                    <Image src={`/${z.category}.jpg`} fill={true} className="article-logo-relative" alt="Article logo" />
                                                </div>
                                                <div className="article-text">
                                                    <p className="smaller-font">{z.heading}</p>
                                                    <span>{z.date_created}</span> | <span>{`${z.timeToRead} min read`}</span>
                                                </div>
                                                <div className="button-wrap">
                                                    <a onClick={() => { routeAndTrigger(link) }} className="button-link">
                                                        <button className="toggle-button">Read article</button>
                                                    </a>
                                                </div>
                                            </div>
                                        )
                                    })}
                            </div>
                        </div>

                    </div>
                    <div className="advertisement"></div>
                </div>
            </>
        ) :
            (
                <div className="article-container-2">
                    <img className="article-logo-img" />
                    <div className="heading-and-byline">
                        <h1 className="article-heading"></h1>
                        <span></span><span></span><span></span>
                    </div>
                    <div className="hr-2">
                        <hr />
                    </div>
                    <div className="article-content">
                        <p id="first_half"></p>
                        <img />
                        <p id="second_half"></p>
                        <div className="advertisement"></div>
                    </div>
                    <div className="hr-2">
                        <hr />
                    </div>
                </div>
            )
    )
}




export default Article;