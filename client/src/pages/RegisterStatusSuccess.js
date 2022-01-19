import React, { Component } from 'react';

class RegisterStatusSuccess extends Component {
    timer = null;

    componentDidMount() {
        this.timer = setTimeout( function() {
            console.log("hello");
            window.location.href = "/login";
        }, 3000)
    }
    
    componentWillUnmount() {
        clearTimeout(this.timer);
    }

    render() {
        return (
            <h1>
                Account Created! Welcome!
            </h1>
        );
    }
}

export default RegisterStatusSuccess;