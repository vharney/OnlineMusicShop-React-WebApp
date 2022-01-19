
import React, { Component } from 'react';
import './LogIn.css';
import NavBar from '../components/Navbar';
// import { createUser } from './api/index';
// import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
// import { useNavigate } from 'react-router-dom';
// import RegisterStatus from './pages/RegisterStatusSuccess'
// import CreateAccount from './CreateAccount';
// import RegisterStatusSuccess from './RegisterStatusSuccess';
// import RegisterStatusFail from './RegisterStatusFail';


var axios = require('axios');
// const navigate = useNavigate();

// function App() {
//   return (
//     <div className="App">
//       <header className="App-header">
//         <img src={logo} className="App-logo" alt="logo" />
//         <p>
//           REYNARD TIKBAY
//         </p>
//         <a
//           className="App-link"
//           href="https://reactjs.org"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           Learn React
//         </a>
//       </header>
//     </div>
//   );
// }

// class SearchBar extends Component {
//     render() {
//         return (
//             <form>
//                 <input
//                     type="text"
//                     placeholder="Keyword(s)"
//                 />
//                 <button>
//                     Search
//                 </button>
//             </form>
//         );
//     }
// }

class LogInInfo extends Component {
    constructor(props) {
        super(props);
        this.state = {
          userId: '',
          password: '',
        };
    }

    navigateToRegister = event => {
        window.location = '/register';
    }

    handleUsernameChange = event => {
        this.setState({
            userId: event.target.value
        });
    }

    handlePasswordChange = event => {
        this.setState({
            password: event.target.value
        });
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

        // axios.defaults.withCredentials = true;
        axios.post("http://localhost:5001/login", { user }, { withCredentials: true })
            .then(res=>{
                console.log(res.data);
                if (res.data.length !== 0) {
                    console.log("Account successfully created");
                    window.location = "/";
                }
                else {
                    console.log("invalid login");
                    window.location = "/invalidLogin";
                }
            })
    };

    render() {
        let bach = require("../images/bach.png")

        return (
            <div className="Log-in-info">
                <h2 className="Log-in-info-title">
                    US MUSIC SHOP - LOGIN
                </h2>
                <p className="Login-reg-instructions">
                    Welcome back! <br/>
                    Log-in with your username and password below and then click the submit button
                </p>
                <form className="LogInUserPass" onSubmit={this.handleSubmit}>
                    <input
                        className="Log-in-user-pass-input"
                        type = "text"
                        placeholder="Username"
                        id="userId"
                        name="userId"
                        onChange={this.handleUsernameChange}
                    />
                    <br/>
                    <input
                        className="Log-in-user-pass-input"
                        type = "password"
                        placeholder="Password"
                        id="password"
                        name="password"
                        onChange={this.handlePasswordChange}
                    />
                    <p className="Login-reg-instructions">
                        Don't have an account? <br/>
                        Click the create button below and enter your credentials accordingly
                    </p>
                    <div>
                        <button className="Log-in-reg-button" type="submit">
                            Submit
                        </button>
                        <button type="button" className="Log-in-reg-button" onClick={this.navigateToRegister}>
                            Create
                        </button>
                    </div>
                </form>
                <img className="Bach" src={bach} />
            </div>
            
        );
    }
}

class LogIn extends Component {
    callbackFunction = childData => {
        window.localStorage.setItem('searchQuery', childData);  
        window.location = "/";
    }

    render() {
        return (
            <div className="Log-in">
                <NavBar parentCallback={this.callbackFunction} />
                <LogInInfo />
            </div>
        );
    }
}

export default LogIn;