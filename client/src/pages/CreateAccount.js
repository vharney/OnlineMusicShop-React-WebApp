import React, { Component } from 'react';
import NavBar from '../components/Navbar';
import './CreateAccount.css';

var axios = require('axios');

class RegisterInfo extends Component {
    constructor(props) {
        super(props);
        this.state = {
          userId: '',
          password: '',
        };
    }

    navigateToLogin = event => {
        window.location = '/login';
    }

    handleUsernameChange = event => {
        this.setState({
            userId: event.target.value
        });
        console.log(this.state.userId);
    }

    handlePasswordChange = event => {
        this.setState({
            password: event.target.value
        });
        console.log(this.state.password);
    }

    handleSubmit = event => {
        event.preventDefault();
        // alert("submitted form");
        const user = {
            userId: this.state.userId,
            password: this.state.password
        }

        if (this.state.userId === "" || this.state.password === "") {
            alert("Please do not leave the fields empty");
            return
        }

        axios.post("http://localhost:5001/register", { user })
            .then(res=>{
                if (res.data === "") {
                    console.log("Account successfully created");
                    window.location = "/registerStatusSuccess";
                }
                else {
                    console.log("Account already existed");
                    window.location = "/registerStatusFail";
                }
            })
    };

    render() {
        let bach = require("../images/bach.png")
        return (
            <div className="Register-info">
                <h2 className="Register-info-title">
                    US MUSIC SHOP - CREATE ACCOUNT
                </h2>
                <p className="Login-reg-instructions" >
                    Don't have an account? <br/>
                    Enter your new desired username and password
                </p>
                <form className="RegisterUserPass" onSubmit={this.handleSubmit}>
                    <input
                        className="Register-user-pass-input"
                        type = "text"
                        placeholder="Desired Username"
                        id="userId"
                        name="userId"
                        onChange={this.handleUsernameChange}
                    />
                    <br/>
                    <input
                        className="Register-user-pass-input"
                        type = "password"
                        placeholder="Desired Password"
                        id="password"
                        name="password"
                        onChange={this.handlePasswordChange}
                    />
                    <p className="Login-reg-instructions" >
                        Welcome back! <br/>
                        If you already have an account press the back button below
                    </p>
                    <div>
                        <button className="Register-button" type="submit">
                            CONFIRM
                        </button>
                        <button type="button" className="Register-button" onClick={this.navigateToLogin}>
                            BACK
                        </button>
                    </div>
                </form>
                <img className="Bach" src={bach} />
            </div>
            
        );
    }
}

class Register extends Component {
    callbackFunction = childData => {
        window.localStorage.setItem('searchQuery', childData);  
        window.location = "/";
    }

    render() {
        
        return (
            <div className="Register">
                <NavBar parentCallback={this.callbackFunction}/>
                <RegisterInfo />
                
            </div>
        );
    }
}

export default Register;