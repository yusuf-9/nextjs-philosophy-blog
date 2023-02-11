import React, { useState, useEffect } from 'react'
import axios from 'axios';
// import { useNavigate, useParams } from 'react-router-dom';
import { useRouter } from 'next/router';
import storage from "../../lib/firebase"
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';


export default function WriteEdit({ write, article }) {

    // Defining states
    const router = useRouter()
    const [category, setcategory] = useState("religion");
    const [heading, setHeading] = useState(null);
    const [description, setDescription] = useState(null)
    const [firstHalf, setFirstHalf] = useState(null)
    const [secondHalf, setSecondHalf] = useState(null)
    const [image, setImage] = useState(null)

    // Post request
    function sendData(e) {
        e.preventDefault()
        document.querySelector(".lds-dual-ring").classList.remove("invisible")
        if (!article) {
            // Uploading file to firebase
            const upload = ref(storage, `images/${image.name}`)
            uploadBytes(upload, image).then((snapshot) => {
                getDownloadURL(snapshot.ref).then((url) => [
                    axios.post("/api/articleActions/write", { category: category, heading: heading, description: description, first_half: firstHalf, second_half: secondHalf, image: url }, { withCredentials: true }).then((x) => {
                        if (x.status == 201) {
                            document.querySelector(".lds-dual-ring").classList.add("invisible")
                            router.push("/articles")
                        }
                        else if(x.status === 401){
                            router.push("/")
                        }
                        else {
                            document.querySelector(".lds-dual-ring").classList.add("invisible")
                        }
                    })
                ])
            })
        }
        else {
            let {articleName} = router.query
            // Uploading file to firebase
            const upload = ref(storage, `images/${image.name}`)
            uploadBytes(upload, image).then((snapshot) => {
                getDownloadURL(snapshot.ref).then((url) => [
                    axios.post(`/api/articleActions/${articleName}`, { ...article, image: url }, { withCredentials: true }).then((x) => {
                        if (x.status == 204) {
                            document.querySelector(".lds-dual-ring").classList.add("invisible")
                            router.push("/articles")
                        }
                        else if(x.status === 401){
                            router.push("/")
                        }
                        else {
                            document.querySelector(".lds-dual-ring").classList.add("invisible")
                            console.log(x.data)
                        }
                    })
                ])
            })
        }
    }


useEffect(() => {
    function frontendJS() {
        // Displaying article image on page for preview
        const fileInput = document.querySelector(".image_upload")
        const imageDiv = document.querySelector(".article_image_preview")
        fileInput.addEventListener("change", () => {
            const reader = new FileReader();
            reader.addEventListener("load", () => {
                imageDiv.style.backgroundImage = `url(${reader.result})`
            })
            reader.readAsDataURL(fileInput.files[0])
        })
        // Changing logo image
        const categoryInput = document.getElementById("category");
        var category = categoryInput.value;
        const categoryLogo = document.querySelector(".logo_display")
        if (category == "religion") {
            categoryLogo.style.backgroundImage = "url(../religion.jpg)"
        }
        categoryInput.addEventListener("change", (e) => {
            let category = e.target.value;
            if (category == "religion") {
                categoryLogo.style.backgroundImage = "url(../religion.jpg)"
            }
            else if (category == "metaphysics") {
                categoryLogo.style.backgroundImage = "url(../metaphysics.jpg)"
            }
            else if (category == "epistemology") {
                categoryLogo.style.backgroundImage = "url(../epistemology.jpg)"
            }
            else if (category == "consciousness") {
                categoryLogo.style.backgroundImage = "url(../consciousness.jpg)"
            }
            else if (category == "existentialism") {
                categoryLogo.style.backgroundImage = "url(../existentialism.jpg)"
            }
            else {
                categoryLogo.style.backgroundImage = "url(../ethics.jpg)"
            }
        })
    }
    frontendJS()
}, [])


return (
    write ? (
        <div className="contact-me-container-2">
            <h1 >Write article</h1>
            <form className="contact-form" encType="multipart/htmlForm-data">
                <label htmlFor="category" className='write-input'>Choose article category</label>
                <select name="category" id="category" onChange={(e) => { setcategory(e.target.value) }}>
                    <option value="religion">Religion</option>
                    <option value="metaphysics">Metaphysics</option>
                    <option value="epistemology">Epistemology</option>
                    <option value="ethics">Ethics</option>
                    <option value="existentialism">Existentialism</option>
                    <option value="consciousness">Consciousness</option>
                </select>
                <div className="logo_display"></div>
                <label htmlFor="heading" className='write-input'>Article heading</label>
                <input name="heading" type="text" className="name input write-input" id="name" placeholder="Article heading" onChange={(e) => { setHeading(e.target.value) }} required />
                <label htmlFor="description" className='write-input'>Article description</label>
                <input name="description" type="text" className="email input write-input" id="email" placeholder="Article description" onChange={(e) => { setDescription(e.target.value) }}
                    required />
                <label htmlFor="first_half" className='write-input'>First half of article</label>
                <textarea id="message" name="first_half" className="message input write-input"
                    placeholder="First half of article" onChange={(e) => { setFirstHalf(e.target.value) }}></textarea>
                <label htmlFor="image" className='write-input'>Choose article image</label>
                <input type="file" accept="image/*" name="image" className="image_upload" onChange={(e) => { setImage(e.target.files[0]) }} />
                <div className="article_image_preview" ></div>
                <label htmlFor="second_half" className='write-input'>Second half of article</label>
                <textarea id="message2" name="second_half" className="message input write-input"
                    placeholder="Second half of article" onChange={(e) => { setSecondHalf(e.target.value) }}></textarea>
                <div className='button-container'>
                    <input type="submit" className="submit-button" value="Submit" onClick={(event) => { sendData(event) }} />
                    <div id='contact-form-loading' className="lds-dual-ring invisible"></div>
                </div>
            </form>
        </div>
    ) : (
        <div className="contact-me-container-2">
            <h1 >Edit article</h1>
            <form className="contact-form" encType="multipart/htmlForm-data">
                <label htmlFor="category" className='write-input'>Choose article category</label>
                <select name="category" value={article.category} id="category" onChange={(e) => { setcategory(e.target.value); article.category = e.target.value }}>
                    <option value="religion">Religion</option>
                    <option value="metaphysics">Metaphysics</option>
                    <option value="epistemology">Epistemology</option>
                    <option value="ethics">Ethics</option>
                    <option value="existentialism">Existentialism</option>
                    <option value="consciousness">Consciousness</option>
                </select>
                <div className="logo_display" style={{ backgroundImage: `url(../${article.category}.jpg)` }}></div>
                <label htmlFor="heading" className='write-input'>Article heading</label>
                <input name="heading" value={article.heading} type="text" className="name input write-input" id="name" placeholder="Article heading" onChange={(e) => { setHeading(e.target.value); article.heading = e.target.value }} required />
                <label htmlFor="description" className='write-input'>Article description</label>
                <input name="description" value={article.description} type="text" className="email input write-input" id="email" placeholder="Article description" onChange={(e) => { setDescription(e.target.value); article.description = e.target.value }}
                    required />
                <label htmlFor="first_half" className='write-input'>First half of article</label>
                <textarea id="message" name="first_half" className="message input write-input" value={article.first_half}
                    placeholder="First half of article" onChange={(e) => { setFirstHalf(e.target.value); article.first_half = e.target.value }}></textarea>
                <label htmlFor="image" className='write-input'>Choose article image</label>
                <input type="file" accept="image/*" name="image" className="image_upload " onChange={(e) => { setImage(e.target.files[0]) }} />
                <div className="article_image_preview" style={{ backgroundImage: `url(${article.image})` }}></div>
                <label htmlFor="second_half" className='write-input'>Second half of article</label>
                <textarea id="message2" name="second_half" className="message input write-input" value={article.second_half}
                    placeholder="Second half of article" onChange={(e) => { setSecondHalf(e.target.value); article.second_half = e.target.value }}></textarea>
                <div className='button-container'>
                    <input type="submit" className="submit-button" value="Submit" onClick={(event) => { sendData(event) }} />
                    <div id='contact-form-loading' className="lds-dual-ring invisible"></div>
                </div>
            </form>
        </div>
    )
)}

