import React, { Component } from 'react';
import axios from 'axios';
import {Link, Navigate} from 'react-router-dom';
import './Checkout.css'

class Checkout extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoggedIn: false,
            searchData: "",
            cartList: [],
            userName: "",
            password: "",
            fullName: "",
            companyName: "",
            address1: "",
            address2: "",
            city: "",
            region: "",
            country: "",
            zip: "",
            price: 0,
            warningUsername: false,
            redirect: false,
        };
    }

    componentDidMount() {
        axios.get("http://localhost:5001/currentUser", {withCredentials: true})
            .then(res=>{
                if (res.data.logged_in) {
                    this.setState({ isLoggedIn: true });
                }
            });

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

    checkUsername = event => {
        if (this.state.userName) {
            let allUsername;
                axios.get("http://localhost:5001/allUser")
                    .then(res=>{
                        allUsername = res.data;
                        console.log(res.data)
                        for (let x of allUsername){
                            console.log(this.state.userName)
                            console.log(this.state.password)
                            if (this.state.userName[0] === x.userId) {
                                this.setState({
                                    userName: "",
                                    warningUsername: true,
                                })
                                return false;
                            }
                        }
                        
                        this.setState({
                            userName: this.state.userName[0],
                            warningUsername: false,
                        })
                    });
        }
    }
        
    handleInputChange = event => {
        console.log(this.state)
        this.setState({
            [event.target.name]: [event.target.value] 
        })
    }

    handleSubmit = event => {
        event.preventDefault();

        if (!this.state.isLoggedIn) {  
            const user = {
                userId: this.state.userName,
                password: this.state.password[0]
            }

            axios.post("http://localhost:5001/register", { user }).then(res=>{
                this.setState({
                    redirect: true
                });
                window.localStorage.setItem('state', JSON.stringify(this.state));    
            }); 
               
        }
        else {
            this.setState({
                redirect: true
            });
            window.localStorage.setItem('state', JSON.stringify(this.state));    
        }
    }

    render() {
        let bach = require("../images/bach.png")
        let options;
        let form;
        let total = 0;
        let warningUsername;
        
        for (let x of this.state.cartList) {
            total += x.musicPrice * x.quantity;
        }
        
        if (this.state.warningUsername) {
            warningUsername = <span className="Warning" style={{"color": "red"}}> Username Duplicated! </span>;
        }

        if (!this.state.isLoggedIn) {
            options = 
            <div className="Not-login">
                <span><b>I'm a new customer</b> &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;</span>
                <span><b>I'm already a customer</b></span>
                <div></div>
                <span>Please checkout below &nbsp; &nbsp; &nbsp;</span>
                <span>or &nbsp; &nbsp; &nbsp; &nbsp;</span>
                <span>
                    <Link
                        to="/login"
                    >
                        Sign In
                    </Link>
                </span>
            </div>;

            form = 
                <form className="Shipping-address" onSubmit={this.handleSubmit}> 
                    <h2>Create Account:</h2>
                    <div>
                        Username &nbsp; 
                        <input
                            type="text"
                            name="userName"
                            value={this.state.userName}
                            placeholder="Desired Username"
                            onBlur={this.checkUsername}
                            onChange={this.handleInputChange}
                            required
                        />
                        {warningUsername}
                     </div>
                     <div>
                        Password &nbsp; 
                        <input
                            type="password"
                            name="password"
                            placeholder="Desired Password"
                            onChange={this.handleInputChange}
                            required
                        />
                     </div>
                     <h3>Delivery Address:</h3>
                     <div>
                        Full Name &nbsp;
                        <input
                            type="text"
                            name="fullName"
                            placeholder="Required"
                            onChange={this.handleInputChange}
                            required
                        />
                     </div>
                     <div>
                        Company Name &nbsp;
                        <input
                            name="companyName"
                            type="text"
                            onChange={this.handleInputChange}
                        />
                     </div>
                     <div>
                        Address Line 1 &nbsp;
                        <input
                            type="text"
                            name="address1"
                            placeholder="Required"
                            onChange={this.handleInputChange}
                            required
                        />
                     </div>
                     <div>
                        Address Line 2 &nbsp;
                        <input
                            name="address2"
                            type="text"
                        />
                     </div>
                     <div>
                        City &nbsp;
                        <input
                            type="text"
                            name="city"
                            placeholder="Required"
                            onChange={this.handleInputChange}
                            required
                        />
                     </div>
                     <div>
                        Region/State/District &nbsp;
                        <input
                            name="region"
                            type="text"
                            onChange={this.handleInputChange}
                        />
                     </div>
                     <div>
                        Country &nbsp;
                        <input
                            type="text"
                            name="country"
                            placeholder="Required"
                            onChange={this.handleInputChange}
                            required
                        />
                     </div>
                     <div>
                        Postcode/Zip Code &nbsp;
                        <input
                            type="text"
                            name="zip"
                            placeholder="Required"
                            onChange={this.handleInputChange}
                            required
                        />
                     </div>
                     <div id="Your-order">
                        Your Order &nbsp;
                        <Link
                        to="/cart"
                        >(change)
                        </Link>
                        <h4>Free Standard Shipping</h4>
                        { 
                        this.state.cartList.map(item => 
                        <div className="Your-order-items"  key={item.musicId}>
                            <span> {item.quantity}x &nbsp; {item.musicName} &nbsp; &nbsp; HK$ {item.musicPrice}</span>
                        </div>
                        )
                        }
                        <p><b>Total Price: HK$ {total}</b></p>
                    </div>
                    <button className="Submit" >Confirm</button>
                    
                </form>;
        }
        else {
            form = 
                <form className="Shipping-address" onSubmit={this.handleSubmit}>
                     <h2>Delivery Address:</h2>
                     <div>
                        Full Name &nbsp;
                        <input
                            type="text"
                            name="fullName"
                            placeholder="Required"
                            onChange={this.handleInputChange}
                            required
                        />
                     </div>
                     <div>
                        Company Name &nbsp;
                        <input
                            name="companyName"
                            type="text"
                            onChange={this.handleInputChange}
                        />
                     </div>
                     <div>
                        Address Line 1 &nbsp;
                        <input
                            type="text"
                            name="address1"
                            placeholder="Required"
                            onChange={this.handleInputChange}
                            required
                        />
                     </div>
                     <div>
                        Address Line 2 &nbsp;
                        <input
                            name="address2"
                            type="text"
                        />
                     </div>
                     <div>
                        City &nbsp;
                        <input 
                            type="text"
                            name="city"
                            placeholder="Required"
                            onChange={this.handleInputChange}
                            required
                        />
                     </div>
                     <div>
                        Region/State/District &nbsp;
                        <input
                            name="region"
                            type="text"
                            onChange={this.handleInputChange}
                        />
                     </div>
                     <div>
                        Country &nbsp;
                        <input
                            type="text"
                            name="country"
                            placeholder="Required"
                            onChange={this.handleInputChange}
                            required
                        />
                     </div>
                     <div>
                        Postcode/Zip Code &nbsp;
                        <input
                            type="text"
                            name="zip"
                            placeholder="Required"
                            onChange={this.handleInputChange}
                            required
                        />
                     </div>
                     <div id="Your-order">
                        Your Order &nbsp;
                        <Link
                        to="/cart"
                        >(change)
                        </Link>
                        <h4>Free Standard Shipping</h4>
                        { 
                        this.state.cartList.map(item => 
                        <div className="Your-order-items"  key={item.musicId}>
                            <span > {item.quantity}x &nbsp; {item.musicName} &nbsp; &nbsp; HK$ {item.musicPrice}</span>
                        </div>
                        )
                        }
                        <p><b>Total Price: HK$ {total}</b></p>
                    </div>
                    <button className="Submit">Confirm</button>
                 </form>;
        }

        let redirect;
        if (this.state.redirect) {
            redirect = <Navigate to="/invoice" data={this.state}/>
            // console.log(this.state);
        }

        return (
             <div>
                 {redirect}
                 {options}
                 {form}
                 <img className="Bach-bg" src={bach} />
             </div>
        );
    }
}

export default Checkout;