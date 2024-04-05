import React, { Component } from "react"
import './Page.css'
import Header from '../components/header/Header'
import Footer from '../components/footer/Footer'
import Grid from '../components/grid/Grid'

class Page extends Component {
    render() {
        return (
            <div className="page">
                <Header />
                <div className="content-wrapper">
                    <div className="content">
                        <Grid />
                    </div>
                </div>
                <Footer />
            </div>
        )
    }
}

export default Page;
