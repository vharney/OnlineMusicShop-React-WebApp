import React, { Component } from 'react';
import axios from 'axios';
import './Cart.css'
import NavBar from '../components/Navbar';
import NavbarLoggedIn from '../components/NavbarLoggedIn';

class Cart extends Component {
    constructor(props) {
        super(props);
        this.state = {
            cartList: [],
            isLoggedIn: false,
        };
    }

    componentDidMount() {
        axios.get("http://localhost:5001/cart", {withCredentials: true})
            .then(res=>{
                if (res.data !== "") {
                    console.log(res.data);
                    // res.data.forEach((item, index) => {
                    //     console.log(item.composer);
                    //     musicList.push( <li key={index}>{item.composer}</li>)
                    // })
                    const cart = res.data.map(obj => ({
                        _id: obj._id,
                        musicId: obj.musicId,
                        musicName: obj.musicName,
                        musicImage: obj.musicImage,
                        musicPrice: obj.musicPrice,
                        userId: obj.userId,
                        quantity: obj.quantity, 
                    }));
                    this.setState({ cartList: cart })
                }
            })

        axios.get("http://localhost:5001/currentUser", {withCredentials: true})
            .then(res=>{
                if (res.data.logged_in) {
                    this.setState({ isLoggedIn: true });
                }
            });
    }

    handleBack = event => {
        window.location = "/";
    }

    handleCheckout = event => {
        window.location = "/checkout";
    }

    handleDelete = event => {
        console.log(event.target.id)
        axios.delete(`http://localhost:5001/cart/deleteCart/${event.target.id}`, {withCredentials: true})
            .then(res=>{
                console.log(res);
                axios.get("http://localhost:5001/cart", {withCredentials: true})
                    .then(res=>{
                        if (res.data !== "") {
                            console.log(res.data);
                            // res.data.forEach((item, index) => {
                            //     console.log(item.composer);
                            //     musicList.push( <li key={index}>{item.composer}</li>)
                            // })
                            const cart = res.data.map(obj => ({
                                _id: obj._id,
                                musicId: obj.musicId,
                                musicName: obj.musicName,
                                musicImage: obj.musicImage,
                                musicPrice: obj.musicPrice,
                                userId: obj.userId,
                                quantity: obj.quantity, 
                            }));
                            this.setState({ cartList: cart })
                        }
                    })
            }
        );
    }

    callbackFunction = childData => {
        window.localStorage.setItem('searchQuery', childData);  
        window.location = "/";
    }

    render() {
        // console.log(this.state.cartList);

        let navBar;

        if (!this.state.isLoggedIn) {
            navBar = <NavBar parentCallback={this.callbackFunction}/>
        }
        else {
            navBar= <NavbarLoggedIn parentCallback={this.callbackFunction}/>
        }

        let totalPrice = 0;

        if (this.state.cartList) {
            for (let x of this.state.cartList) {
                totalPrice += x.musicPrice * x.quantity;
            }
        }
        
        let bach = require("../images/bach.png")

        return (
            <div >
                {navBar}
                <div className="Cart-page">
                    <h2
                        className="Heading"
                    >
                        My Shopping Cart
                    </h2>
                    { 
                        this.state.cartList.map(item => 
                        <div key={item._id} className="Cart-item">
                            <h4 className="Cart-item-heading">{item.musicName}</h4>
                            <img src={item.musicImage} className="Cart-item-img"/>
                            <p>Price: <b>${item.musicPrice}</b></p>
                            <p>Quantity: <b>{item.quantity}</b></p>
                            <p>Total for this item: <b>${item.quantity * item.musicPrice}</b></p>
                            <button type="submit" id={item._id} className="Delete-item" onClick={this.handleDelete}>
                                Delete
                            </button>
                        </div>) 
                    }
                    <div className="Total-price"><b>Total Price: ${totalPrice}</b></div>
                    <div className="Back-checkout-button">
                        <button className="Back-item" onClick={this.handleBack}><b>Back</b></button>
                        <button className="Checkout-item" onClick={this.handleCheckout}><b>Checkout</b></button>
                    </div>
                </div>
                <img className="Bach-bg" src={bach} />
            </div>
        );
    }
}

export default Cart;