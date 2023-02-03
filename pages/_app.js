import Head from 'next/head'
import Link from 'next/link'
import "../styles/Article.css"
import "../styles/ArticlesSection.css";
import "../styles/Edit.css"
import "../styles/Footer.css"
import "../styles/global.css"
import "../styles/Header.css"
import "../styles/HomePage.css";
import "../styles/LoginRegister.css"
import "../styles/Register.css"
import "../styles/RegisterProcess.css"
import "../styles/resetPassword.css"
import "../styles/Showcase.css"
import "../styles/WriteEdit.css";
import "../styles/ContactForm.css";
import Header from '../Components/Header/Header'
import Footer from '../Components/Footer/Footer'
import { useState } from 'react';

function MyApp({ Component, pageProps }) {

  const [reloader, setReloader] = useState(0)
  function triggerReload() {
    setReloader(reloader + 1)
  }
  return (
    <>
      <Head>
        <title>The Skeptic Hawk</title>
        <meta name='description' content="The Skeptic Hawk: A philosphy blog where humanity's greatest ideas are presented in a simplified manner for everyone to understand" />
      </Head>
      <Header reloader1={reloader} triggerReload1={triggerReload} />
      <Component {...pageProps} triggerReload1={triggerReload} />
      <Footer />
    </>
  )
}

export default MyApp
