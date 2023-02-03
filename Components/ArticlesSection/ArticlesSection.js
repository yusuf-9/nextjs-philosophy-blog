import React, { useState, useEffect } from "react";
import axios from "axios"
import Link from "next/link";
import Image from "next/image";
import ReligionLogo from "./public/religion.jpg"
import MetaphysicsLogo from "./public/metaphysics.jpg"
import EthicsLogo from "./public/ethics.jpg"
import ConsciousnessLogo from "./public/consciousness.jpg"
import ExistentialismLogo from "./public/existentialism.jpg"
import EpistemologyLogo from "./public/epistemology.jpg"

function ArticlesSection({ fetchedArticles1, triggerReload1 }) {
    // Defining states
    const [fetchedArticles, setFetchedArticles] = useState(fetchedArticles1)
    const [pageNumber, setpageNumber] = useState(0)
    const [Filter, setFilter] = useState("")
    const [loading, setLoading] = useState(false)
    const [reloader, setRealoader] = useState(true)

    // Useeffect
    useEffect(() => {
        if (!reloader) {
            const data = axios.get(`http://localhost:3000/api/fetchArticles/articles?page=${pageNumber}&${Filter}`).then((x) => {
                if (x.data.status === "success") {
                    setFetchedArticles({ data: x.data.data, page: x.data.page })
                    setRealoader(true)
                }
                else {
                    setError("Something went wrong. Please come back later")
                    console.log(x.data)
                }

            })
        }
        else {
            buttonHover()
        }
    }, [pageNumber, Filter, reloader])
    // Some frontend JS
    const articleFilter = (e) => {
        let activeFilter = e.target.parentNode;
        const articles = Array.from(document.querySelectorAll(".article"));
        if (!activeFilter.classList.contains("active")) {
            activeFilter.classList.add("active");
            activeFilter.children[0].classList.add("activated-img")
            activeFilter.children[1].classList.add("activated-span")
            console.log(activeFilter.children)
            let activeFilters = Array.from(document.querySelectorAll(".topic-name")).filter((x) => { return x.classList.contains("active") })
            let innerText = activeFilters.map((x) => {
                return x.children[1].innerText;
            });
            const articles = Array.from(document.querySelectorAll(".article"));
            let hiddenArticles = articles.filter((x) => {
                return !innerText.includes(x.classList[1])
            })
            let notHiddenArticles = articles.filter((x) => {
                return innerText.includes(x.classList[1])
            })
            notHiddenArticles.forEach((x) => {
                if (x.classList.contains("hidden")) {
                    x.classList.remove("hidden")
                }
            })
            hiddenArticles.forEach((x) => {
                x.classList.add("hidden")
            })
        }
        else {
            activeFilter.classList.remove("active");
            activeFilter.children[0].classList.remove("activated-img")
            activeFilter.children[1].classList.remove("activated-span")
            let activeFilters = Array.from(document.querySelectorAll(".topic-name")).filter((x) => { return x.classList.contains("active") })
            if (activeFilters.length > 0) {
                let innerText = activeFilters.map((x) => {
                    return x.children[1].innerText;
                });
                let hiddenArticles = articles.filter((x) => {
                    return !innerText.includes(x.classList[1])
                })
                let notHiddenArticles = articles.filter((x) => {
                    return innerText.includes(x.classList[1])
                })
                notHiddenArticles.forEach((x) => {
                    if (x.classList.contains("hidden")) {
                        x.classList.remove("hidden")
                    }
                })
                hiddenArticles.forEach((x) => {
                    x.classList.add("hidden")
                })
            }
            else {
                articles.forEach((x) => {
                    if (x.classList.contains("hidden")) {
                        x.classList.remove("hidden")
                    }
                })
            }



        }
    }
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
    //Changing states for pagination and filters
    function fetch(x) {
        if (x == 1) {
            setRealoader(false)
            setpageNumber(pageNumber + 1)
        }
        else {
            setRealoader(false)
            setpageNumber(pageNumber - 1)
        }
    }
    function filterChanger(x, num) {
        if (!Filter.includes(x)) {
            setFilter(`filter=${x}&${Filter}`)
            const topicNames = Array.from(document.querySelectorAll('.topic-name'))
            topicNames.forEach((y) => {
                if (y.children[1].innerText.toLowerCase() == x) {
                    y.children[0].classList.add("activated-img")
                    y.children[1].classList.add("activated-span")
                }
            })
            setRealoader(false)
            setpageNumber(0)
        }
        else {
            setFilter(Filter.replace(`filter=${x}&`, ""))
            const topicNames = Array.from(document.querySelectorAll('.topic-name'))
            topicNames.forEach((y) => {
                if (y.children[1].innerText.toLowerCase() == x) {
                    y.children[0].classList.remove("activated-img")
                    y.children[1].classList.remove("activated-span")
                }
            })
            setRealoader(false)
            setpageNumber(0)
        }
    }

    return (
        loading ? (
            <div className="article-container low-padding">
                <div className="browse-articles">
                    <h2>Browse Articles by Topic</h2>
                    <div className="topic-names">
                        <div className="topic-set first">
                            <div className="topic-name" onClick={() => { filterChanger("religion") }}>
                                <Image src={ReligionLogo} className="topic-img" alt="religion logo"/>
                                <span >Religion</span>
                            </div>
                            <span className="vertical-line"></span>
                            <div className="topic-name" onClick={() => { filterChanger("epistemology") }}>
                                <Image src={EpistemologyLogo} className="topic-img" alt="epistemology logo"/>
                                <span>Epistemology</span>
                            </div>
                            <span className="vertical-line"></span>
                            <div className="topic-name" onClick={() => { filterChanger("metaphysics") }}>
                                <Image src={MetaphysicsLogo} className="topic-img" alt="metaphysics logo"/>
                                <span>Metaphysics</span>
                            </div>
                        </div>
                        <span className="vertical-line removable"></span>
                        <div className="topic-set last">
                            <div className="topic-name" onClick={() => { filterChanger("consciousness") }}>
                                <Image src={ConsciousnessLogo} className="topic-img" alt="consciousness logo"/>
                                <span>Consciousness</span>
                            </div>
                            <span className="vertical-line modified"></span>
                            <div className="topic-name" onClick={() => { filterChanger("ethics") }}>
                                <Image src={EthicsLogo} className="topic-img" alt="ethics logo"/>
                                <span>Ethics</span>
                            </div>
                            <span className="vertical-line modified"></span>
                            <div className="topic-name" onClick={() => { filterChanger("existentialism") }}>
                                <Image src={ExistentialismLogo} className="topic-img" alt="existentialism logo"/>
                                <span >Existentialism</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="hr"><hr /></div>
                <div className="loader-div">
                    <div className="lds-dual-ring"></div>
                </div>
            </div>
        ) : (
            <div className="article-container low-padding">
                {fetchedArticles.page.nextPage ? (
                    <a onClick={() => { fetch(1) }} className="next-page">Next page</a>
                ) : (<></>)}
                {pageNumber > 0 &&
                    <a onClick={() => { fetch(0) }} className="prev-page">Previous page</a>
                }
                <div className="browse-articles">
                    <h2>Browse Articles by Topic</h2>
                    <div className="topic-names">
                        <div className="topic-set first">
                            <div className="topic-name" onClick={() => { filterChanger("religion") }}>
                                <Image src={ReligionLogo} className="topic-img" alt="religion logo"/>
                                <span >Religion</span>
                            </div>
                            <span className="vertical-line"></span>
                            <div className="topic-name" onClick={() => { filterChanger("epistemology") }}>
                                <Image src={EpistemologyLogo} className="topic-img" alt="epistemology logo"/>
                                <span>Epistemology</span>
                            </div>
                            <span className="vertical-line"></span>
                            <div className="topic-name" onClick={() => { filterChanger("metaphysics") }}>
                                <Image src={MetaphysicsLogo} className="topic-img" alt="metaphysics logo"/>
                                <span>Metaphysics</span>
                            </div>
                        </div>
                        <span className="vertical-line removable"></span>
                        <div className="topic-set last">
                            <div className="topic-name" onClick={() => { filterChanger("consciousness") }}>
                                <Image src={ConsciousnessLogo} className="topic-img" alt="consciousness logo"/>
                                <span>Consciousness</span>
                            </div>
                            <span className="vertical-line modified"></span>
                            <div className="topic-name" onClick={() => { filterChanger("ethics") }}>
                                <Image src={EthicsLogo} className="topic-img" alt="ethics logo"/>
                                <span>Ethics</span>
                            </div>
                            <span className="vertical-line modified"></span>
                            <div className="topic-name" onClick={() => { filterChanger("existentialism") }}>
                                <Image src={ExistentialismLogo} className="topic-img" alt="existentialism logo"/>
                                <span >Existentialism</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="hr"><hr /></div>

                <div className="article-showcase">
                    {fetchedArticles.data.map((x) => {
                        let link = `/article/${x.heading.split(" ").join("_")}`;
                        let categoryclass = `article ${x.category}`
                        return (
                            <div className={categoryclass} key={x.heading}>
                                <Image src={x.image} fill={true}  className="article-background" alt="Article image" />
                                <div className="article-logo">
                                    <Image src={`/${x.category}.jpg`} fill={true} className="article-logo-relative" alt="Article logo" />
                                </div>
                                <div className="article-text">
                                    <p className="larger-font">{x.heading}</p>
                                    <span>{x.date_created}</span> | <span>{`${x.timeToRead} min read`}</span>
                                </div>
                                <div className="button-wrap">
                                    <Link href={link} onClick={() => { triggerReload1() }} s className="button-link">
                                        <button className="toggle-button">Read article</button>
                                    </Link>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
        )
    )
}

export default ArticlesSection;