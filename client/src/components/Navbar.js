import React, { Component } from 'react';
import './Navbar.css';
import { BrowserRouter as Link, NavLink } from 'react-router-dom';
import axios from 'axios';

class SearchBar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            input: '',
        };
    }

    sendData = () => {
        this.props.parentCallback(this.state.input);
    }

    handleChange = event => {
        this.setState({
            input: event.target.value
        });
    }

    handleSearch = event => {
        this.sendData();
    }

    render() {
        return (
            <div className="Search">
                <input
                    type="text"
                    placeholder="Keyword(s)"
                    onChange={this.handleChange}
                    className="Search-bar"
                />
                <button className="Search-button" onClick={this.handleSearch}>
                    <b>Search</b>
                </button>
            </div>
        );
    }
}

class NavButtons extends Component {
    constructor(props) {
        super(props);
        this.state = {
          orders: 0,
        };
    }

    componentDidMount() {
        axios.get("http://localhost:5001/cart", {withCredentials: true})
            .then(res=>{
                if (res.data !== "") {
                    let orders = 0
                    for (let x of res.data) {
                        orders += x.quantity;
                    }
                    this.setState({ orders: orders })
                }
            })
    }

    componentDidUpdate() {
        axios.get("http://localhost:5001/cart", {withCredentials: true})
            .then(res=>{
                if (res.data !== "") {
                    let orders = 0
                    for (let x of res.data) {
                        orders += x.quantity;
                    }
                    if (orders != this.state.orders) {
                        this.setState({ orders: orders })
                    }
                }
            })
    }

    render() {
        return (
             <div className="Nav-buttons">
                <NavLink
                    className="Navbar-item"
                    // activeClassName="is-active"
                    to="/login"
                >
                    Sign In
                </NavLink> 
                <NavLink
                    className="Navbar-item"
                    // activeClassName="is-active"
                    to="/register"
                >
                    Register
                </NavLink>                 
                <NavLink to="/cart" className="Cart-button-div">
                    <button className="Cart">
                        Cart
                    </button>              
                    <p className="Cart-counter">
                        {this.state.orders}
                    </p>
                </NavLink>
             </div>
        );
    }
}

class NavBar extends Component {

    sendData = (data) => {
        this.props.parentCallback(data);
    }

    callbackFunction = childData => {
        this.sendData(childData);
    }

    render() {
        return (
            <div className="Navbar">
                <NavButtons />
                <SearchBar  parentCallback={this.callbackFunction}/>
            </div>
        );
    }
}

export default NavBar;