import React, { Component } from 'react';
import axios from 'axios';
import NavBar from '../components/Navbar';
import NavbarLoggedIn from '../components/NavbarLoggedIn';
import { Link, useParams } from "react-router-dom";
import './Category.css';

class Category extends Component {
    constructor(props) {
        super(props);
        this.state = {
                musicList: [],
                categoryList: [],
                musicBasedOnCategory: [],
                currCategory: "",
                searchData: this.props.searchData,
                isLoggedIn: false
            };
        }

    componentDidMount() {
        axios.get("http://localhost:5001/music", {withCredentials: true})
            .then(res=> {
                if (res.data !== "") {
                    let matchedCategory = []
                    const music = res.data.map(obj => {
                        if (obj.category === this.props.params.category) {
                            matchedCategory.push({
                                _id: obj._id,
                                name: obj.name,
                                category: obj.category,
                                composer: obj.composer, 
                                description: obj.description,
                                price: obj.price,
                                published: obj.published,
                                newArrival: obj.newArrival,
                                image: require("../materials/" + obj.image),
                                mp3: require("../materials/" + obj.mp3),
                            })
                        } 
                    });
                    this.setState({ musicList: matchedCategory, currCategory: this.props.params.category })
                }
            })
        
        axios.get("http://localhost:5001/music/uniqueCategory", {withCredentials: true})
            .then(res=>{
                if (res.data !== "") {
                    const category = res.data.map(obj => ({
                        category: obj,
                    }));
                    this.setState({ categoryList: category });
                }
            })
        
        
        axios.get("http://localhost:5001/currentUser", {withCredentials: true})
            .then(res=>{
                if (res.data.logged_in) {
                    this.setState({ isLoggedIn: true, userId: res.data.user });
                }
            });
    }

    handleCategoryClick = event => {
        window.location = "/" + event.target.innerHTML;
    }

    callbackFunction = childData => {
        window.localStorage.setItem('searchQuery', childData);  
        window.location = "/";
    }

    render() {
        let bach = require("../images/bach.png")
        let navBar;
        if (!this.state.isLoggedIn) {
            navBar = <NavBar parentCallback={this.callbackFunction} />
        }
        else {
            navBar= <NavbarLoggedIn parentCallback={this.callbackFunction} />
        }

        return (
             <div>
                 {navBar}
                 <div className="Left-category">
                    <h2>
                        Category
                    </h2>
                    { 
                    this.state.categoryList.map(category => 
                        <Link key={category.category} to={`/${category.category}`} className="Link-remove"> 
                            <div className="Category-item" onClick={this.handleCategoryClick}>
                                {category.category}
                            </div> 
                        </Link>)
                    }
                </div>
                <div className="Music-list">
                    <span className="Path-home">
                        <Link
                            to="/"
                            onClick={this.handleRouteClick}
                        >
                            Home 
                        </Link>
                        &nbsp; / &nbsp;
                        <Link
                            to={`/${this.state.currCategory}`}
                        >
                            {this.state.currCategory}
                        </Link>
                    </span>
                    <h2>All {this.state.currCategory}</h2>
                    { this.state.musicList.map(music => 
                    <div id={music._id} key={music._id} className="Music-card" onClick={this.handleClick}>
                        <div className="Music-link-div">
                            <Link to={`/music/${music._id}`} className="Music-link" >
                                <h3 id={music._id}>{music.name}</h3>
                            </Link>
                        </div>
                        <div style={{"height": "90px"}}></div>
                        <img id={music._id} className="Music-card-img" src={music.image} alt=""/>
                        {music.newArrival === "Yes" ? <div className="New-arrival">New Arrival</div> : <div></div>}
                        <div id={music._id} >Composer: {music.composer}</div>
                        <div id={music._id} >Price: <b>${music.price}</b></div>
                    </div>) 
                    }
                </div>
                <img className="Bach-bg" src={bach} />
             </div>
        );
    }


}

export default (props) => (
    <Category
        {...props}
        params={useParams()}
    />
);