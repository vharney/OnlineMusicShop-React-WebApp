import React, { Component } from 'react';
var axios = require('axios');

class LogOutStatus extends Component {
    timer = null;

    componentDidMount() {
        this.timer = setTimeout( function() {
            window.location.href = "/";
        }, 3000)

        axios.get("http://localhost:5001/logout", {withCredentials: true});
    }
    
    componentWillUnmount() {
        clearTimeout(this.timer);
    }

    render() {
        return (
             <h2>Logging out</h2>
        );
    }
}

export default LogOutStatus;