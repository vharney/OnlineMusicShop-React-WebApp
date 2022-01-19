import axios from 'axios';
import React, { Component } from 'react';
import './Invoice.css';

class Invoice extends Component {
    constructor(props) {
        super(props);
        this.state = {
            ... JSON.parse(window.localStorage.getItem('state'))
        };
    }

    componentDidMount() {
        window.localStorage.removeItem('state');
        axios.delete("http://localhost:5001/cart/clearCart", {withCredentials: true})
            .then(res=>{
                console.log(res);
            })
    }

    handleClick = event => {
        
        window.location = "/";
    }

    render() {
        let bach = require("../images/bach.png")
        let total = 0;
        for (let x of this.state.cartList) {
            total += x.musicPrice * x.quantity;
            console.log(total)
        }
        console.log(total)

        return (
             <div>
                <div className="Invoice">
                    <h1 >Invoice Page</h1>
                    <div>
                        <span>
                            <b>Full Name: </b> {this.state.fullName}
                            &nbsp; &nbsp; &nbsp; &nbsp;
                            <b>Company: </b> {this.state.companyName ? this.state.companyName : "N/A"}
                        </span>
                    </div>
                    <div>
                        <b>Address Line 1: </b> &nbsp; {this.state.address1}
                    </div>
                    <div>
                        <b>Address Line 2: </b>  &nbsp; {this.state.address2 ? this.state.address2 : "N/A"}
                    </div>
                    <div>
                        <span>
                            <b>City:</b> {this.state.city}
                            &nbsp; &nbsp; &nbsp; &nbsp;
                            <b>Region:</b> {this.state.region ? this.state.region : "N/A"}
                            &nbsp; &nbsp; &nbsp; &nbsp; 
                            <b>Country:</b> {this.state.country}
                        </span>
                    </div>
                    <div>
                        <b>Postcode: </b> {this.state.zip}
                    </div>
                    <br/>
                    <div>
                        { 
                            this.state.cartList.map(item => 
                            <div key={item.musicId}>
                                <span> {item.quantity}x &nbsp; {item.musicName} &nbsp; &nbsp; HK$ {item.musicPrice}</span>
                            </div>
                            )
                        }
                    </div>
                    <p><b>Total Price: HK$ {total}</b></p>
                </div>
                <div className="Thank-you">
                    <p><b>Thanks for ordering. Your music will be delivered within 7 working days.</b></p>
                    <button onClick={this.handleClick}>OK</button>
                </div>
                <img className="Bach-bg" src={bach} />
            </div>
        );
    }

}

export default Invoice;