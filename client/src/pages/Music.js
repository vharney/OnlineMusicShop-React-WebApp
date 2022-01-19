import React, { Component } from 'react';
import { useParams } from "react-router-dom";
import axios from 'axios';
import './Music.css';
import NavBar from '../components/Navbar';
import NavbarLoggedIn from '../components/NavbarLoggedIn';
import {Link} from 'react-router-dom';

class Music extends Component {
    constructor(props) {
        super(props);
        this.state = {
            music: '',
            isLoggedIn: '',
            userId: '',
            quantity: 1,
        };
    }

    componentDidMount() {
        axios.get("http://localhost:5001/music", {withCredentials: true})
            .then(res=>{
                if (res.data !== "") {
                    console.log(res.data);
                    // res.data.forEach((item, index) => {
                    //     console.log(item.composer);
                    //     musicList.push( <li key={index}>{item.composer}</li>)
                    // })
                    let newMusic = []
                    const music = res.data.map(obj => {
                        if (obj._id === this.props.params.id) {
                            newMusic.push({
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
                    this.setState({ music: newMusic })
                }
            })


        axios.get("http://localhost:5001/currentUser", {withCredentials: true})
            .then(res=>{
                if (res.data.logged_in) {
                    this.setState({ isLoggedIn: true, userId: res.data.user });
                }
            });
    }

    handleRouteClick = event => {
        window.location = "/";
    }

    handleQuantityChange = event => {
        this.setState({
            quantity: event.target.value
        });
    }

    handleSubmit = event => {
        event.preventDefault();

        const purchase = {
            musicId: this.state.music[0]._id,
            musicName: this.state.music[0].name,
            musicImage: this.state.music[0].image,
            musicPrice: this.state.music[0].price,
            userId: this.state.userId ? this.state.userId.userId : "",
            quantity: this.state.quantity
        }

        // axios.defaults.withCredentials = true;
        axios.post("http://localhost:5001/cart/addCart", { purchase }, { withCredentials: true })
            .then(res=>{
                console.log(res.data);
                if (res.data.length !== 0) {
                    // console.log("Account successfully created");
                    // window.location = "/";
                }
                else {
                    // console.log("Account already existed");
                    // window.location = "/registerStatusFail";
                }
            })
        
        window.location = "/cart";
    };

    callbackFunction = childData => {
        window.localStorage.setItem('searchQuery', childData);  
        window.location = "/";
    }

    render() {
        // console.log(this.state.music[0]);
        let id;
        let name;
        let img;
        let composer;
        let published;
        let category;
        let description;
        let price;
        let mp3;

        var musicTemp = this.state.music[0];
        if (musicTemp) {
            id = musicTemp._id;
            name = musicTemp.name;
            img = musicTemp.image;
            composer = musicTemp.composer;
            published = musicTemp.published;
            category = musicTemp.category;
            description = musicTemp.description;
            price = musicTemp.price;
            mp3 = musicTemp.mp3;
            // console.log(mp3);
        }

        let navBar;

        if (!this.state.isLoggedIn) {
            navBar = <NavBar parentCallback={this.callbackFunction} />
        }
        else {
            navBar= <NavbarLoggedIn parentCallback={this.callbackFunction} />
        }

        
        return (
            <div className="Music-page">
                {navBar}
                <div className="Music-page-div">
                    <span className="Path">
                        <Link 
                            to="/"
                            onClick={this.handleRouteClick}
                        >
                            Home
                        </Link>
                        <span> / </span>
                        <Link
                            to={`/music/${id}`}
                        >
                            {name}
                        </Link>
                    </span>
                    <h1 className="Music-name">{name}</h1>
                    <div className="Information">
                        <img src={img} className="Image" />
                        <audio controls autoPlay src={mp3} className="Audio">
                            {/* <source src={mp3} type="audio/mpeg"></source>        */}
                        </audio>
                        <div className="Information-text">
                            <p>Composer: <b>{composer}</b></p>
                            <p>Published: <b>{published}</b></p>
                            <p>Category: <b>{category}</b></p>
                            <br/>
                            <p>
                                Description: 
                            </p>
                            <p>
                            {description}
                            </p>
                        </div>
                        <div className="Order">
                            <p>
                                <b>Price: $ {price}</b>
                            </p>

                            <form onSubmit={this.handleSubmit}>
                                Order: &nbsp;
                                <input 
                                    type="text"
                                    className="Quantity"
                                    defaultValue="1"
                                    onChange={this.handleQuantityChange}
                                />
                                <button className="AddCart" type="submit">
                                    Add to Cart
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default (props) => (
    <Music
        {...props}
        params={useParams()}
    />
);