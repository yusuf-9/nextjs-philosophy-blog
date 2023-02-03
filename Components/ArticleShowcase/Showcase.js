import React, { useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

function Showcase({ TopArticles }) {
    useEffect(() => {
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

    }, [])

    return (
        <div className="article-container">
            <h1>Top articles</h1>
            <Link href='/articles' className="view-all-articles">View all articles</Link>
            <div className="article-showcase">
                {TopArticles.map((x) => {
                    let link = `/article/${x.heading.split(" ").join("_")}`;
                    return (
                        <div className="article" key={x.heading}>
                            <Image src={x.image} fill={true} className="article-background" alt="Article image"/>
                            <div className="article-logo">
                            <Image src={`/${x.category}.jpg`} fill={true} className="article-logo-relative" alt="Article logo"/>
                            </div>
                            <div className="article-text">
                                <p className="larger-font">{x.heading}</p>
                                <span>{x.date_created}</span> | <span>{`${x.timeToRead} min read`}</span>
                            </div>
                            <div className="button-wrap">
                                <Link  href={link} className="button-link">
                                    <button className="toggle-button">Read article</button>
                                </Link>
                            </div>
                        </div>
                    )
                })}
            </div>

        </div>
    )
}
export default Showcase;