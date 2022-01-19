
import React, { Component } from 'react';
import './App.css';
import NavBar from './components/Navbar';
import NavbarLoggedIn from './components/NavbarLoggedIn';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import LogIn from './pages/LogIn';
import CreateAccount from './pages/CreateAccount';
import RegisterStatusSuccess from './pages/RegisterStatusSuccess';
import RegisterStatusFail from './pages/RegisterStatusFail';
import LogOutStatus from './pages/LogOutStatus';
import Music from './pages/Music';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Invoice from './pages/Invoice';
import Category from './pages/Category';
import InvalidLogin from './pages/InvalidLogin';


var axios = require('axios');

class MusicList extends Component {
    constructor(props) {
    super(props);
    this.state = {
            musicList: [],
            categoryList: [],
            musicBasedOnCategory: [],
            currCategory: "",
            searchData: this.props.searchData,
            isCategory: false,
            isSearching: false,
            fromOtherPage: false,
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
                    const music = res.data.map(obj => ({
                        _id: obj._id,
                        name: obj.name,
                        category: obj.category,
                        composer: obj.composer, 
                        description: obj.description,
                        price: obj.price,
                        published: obj.published,
                        newArrival: obj.newArrival,
                        image: require("./materials/" + obj.image),
                        mp3: obj.mp3
                        
                    }));

                    
                    this.setState({ 
                        musicList: music,
                        musicBasedOnCategory: music,
                     })

                    if (window.localStorage.getItem('searchQuery')) {
                        let query = window.localStorage.getItem('searchQuery');
                        window.localStorage.removeItem("searchQuery");
                        this.setState({ searchData: query, fromOtherPage: true });
                    }
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
    }

    // When there is new search result
    componentDidUpdate() {
        if (this.props.searchData !== this.state.searchData || this.state.fromOtherPage ) {
            console.log(this.props.searchData.split(' '));
            let filterSearch = []
            
            for (let x of this.props.searchData.split(' ')) {
                this.state.musicList.map(obj => {
                    if (obj.composer.includes(x) || obj.name.includes(x)) {
                        filterSearch.push({
                            _id: obj._id,
                            name: obj.name,
                            category: obj.category,
                            composer: obj.composer, 
                            description: obj.description,
                            price: obj.price,
                            published: obj.published,
                            newArrival: obj.newArrival,
                            image: obj.image,
                            mp3: obj.mp3,
                        })
                    }
                });
            }

            if (this.state.fromOtherPage) {
                filterSearch = [];
                for (let x of this.state.searchData.split(' ')) {
                    this.state.musicList.map(obj => {
                        if (obj.composer.includes(x) || obj.name.includes(x)) {
                            filterSearch.push({
                                _id: obj._id,
                                name: obj.name,
                                category: obj.category,
                                composer: obj.composer, 
                                description: obj.description,
                                price: obj.price,
                                published: obj.published,
                                newArrival: obj.newArrival,
                                image: obj.image,
                                mp3: obj.mp3,
                            })
                        }
                    });
                }
            }

            this.setState({
                fromOtherPage: false,
                searchData: this.props.searchData,
                isCategory: false,
                musicBasedOnCategory: filterSearch,
                isSearching: true,
            });
            
        }
    };
    

    handleClick = event => {
        console.log(event.target.id);
    }

    handleCategoryClick = event => {
        window.location = "/" + event.target.innerHTML;
    }

    handleRouteClick = event => {
        window.location = "/";
    }



    render() {
        let separator;
        let h2 = <h2>All Music</h2>;

        if (this.state.currCategory) {
            separator = <span>  /  </span>;
            h2 = <h2>All {this.state.currCategory}</h2>;
        }

        if (this.state.isSearching) {
            h2 = <h2>Searching Results</h2>;
        }


        return (
            <div>
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
                        {separator}
                        <Link
                            to={`/${this.state.currCategory}`}
                        >
                            {this.state.currCategory}
                        </Link>
                    </span>
                    {h2}
                    { this.state.musicBasedOnCategory.map(music => 
                    <div id={music._id} key={music._id} className="Music-card" onClick={this.handleClick}>
                        <div className="Music-link-div">
                            <Link to={`/music/${music._id}`} className="Music-link" >
                                <h3 id={music._id}>{music.name}</h3>
                            </Link>
                        </div>
                        <div style={{"height": "90px"}}></div>
                        <img id={music._id} className="Music-card-img" src={music.image} alt=""/>
                        
                        {music.newArrival === "Yes" ? <div className="New-arrival">New Arrival</div> : <div></div>}
                        <div id={music._id} >Composer: <b>{music.composer}</b></div>
                        <div id={music._id} >Price: <b>${music.price}</b></div>
                    </div>) 
                    }
                    
                </div>
            </div>
        );
    }
}


class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoggedIn: false,
            searchData: ""
        };
    }

    callbackFunction = childData => {
        // console.log(childData)
        this.setState({ searchData: childData });
    }

    componentDidMount() {
        axios.get("http://localhost:5001/currentUser", {withCredentials: true})
        .then(res=>{
            if (res.data.logged_in) {
                let currUser = res.data.user.userId;
                
                this.setState({ isLoggedIn: true } );
                axios.get("http://localhost:5001/sessionCart", {withCredentials: true})
                    .then(res=>{
                        if (res.data) {

                            const forloop = async() => {
                                for (let x of res.data) {
                                    x.userId = currUser;
                                    console.log(x);
                                    let result = await axios.post("http://localhost:5001/cart/addCart", { purchase:x }, { withCredentials: true })
                                    console.log(result);
                                    
                                }
                            }
                            forloop().then(_ => {
                                console.log("SELESAI ANJING")
                                this.setState({ isLoggedIn: true } );
                            });
                            
                           
                            // for (let x of res.data) {
                            //     x.userId = currUser;
                            //     console.log(x);
                            //     axios.post("http://localhost:5001/cart/addCart", { purchase:x }, { withCredentials: true })
                            //         .then(res=>{
                            //             console.log(res.data);
                            //             this.setState({ isLoggedIn: true } );
                                        
                            //         })
                            // }
                                // console.log(result);
                                
                            // }
                            
                            // forloop();
                            // this.setState({ isLoggedIn: true } );
                        }
                    })
            }
        });
        
    }

    render() {
        console.log("DONE")
        let bach = require("./images/bach.png")
        let navBar;
        console.log(this.state.searchData + "cek")
        if (!this.state.isLoggedIn) {
            navBar = <NavBar parentCallback={this.callbackFunction} />
        }
        else {
            navBar= <NavbarLoggedIn parentCallback={this.callbackFunction} />
        }

        return (
            <div className="Home">
                { navBar }
                <MusicList className="Music-list" searchData={this.state.searchData} />
                <img className="Bach-bg" src={bach} />
            </div>
        );
    }
}


class App extends Component {
    render() {
        return (
            <Router>
                <Routes>
                    <Route path="/" element={<Home />}/>
                    <Route path="/:category" element={<Category />}/>
                    <Route path="/login" element={<LogIn />}/>
                    <Route path="/register" element={<CreateAccount />}/>
                    <Route path="/registerStatusSuccess" element={<RegisterStatusSuccess />}/>
                    <Route path="/registerStatusFail" element={<RegisterStatusFail />}/>
                    <Route path="/logOutStatus" element={<LogOutStatus />} />
                    <Route path="/music/:id" element={<Music />} />
                    <Route path="/cart" element={<Cart />} />
                    <Route path="/checkout" element={<Checkout />} />
                    <Route path="/invoice" element={<Invoice />} />
                    <Route path="/invalidLogin" element={<InvalidLogin />} />
                </Routes>
            </Router>
        )
    }
}

export default App;
