import React, { Component,  } from 'react';

class RegisterStatusFail extends Component {
    timer = null;

    componentDidMount() {
        this.timer = setTimeout( function() {
            console.log("hello");
            window.location.href = "/register";
        }, 3000)
    }
    
    componentWillUnmount() {
        clearTimeout(this.timer);
    }

    render() {
        return (
            <h1>
                Account already existed
            </h1>
        );
    }
}

export default RegisterStatusFail;