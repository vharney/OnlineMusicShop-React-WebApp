import React, { Component  } from 'react';

class InvalidLogin extends Component {
    timer = null;

    componentDidMount() {
        this.timer = setTimeout( function() {
            window.location.href = "/login";
        }, 3000)
    }
    
    componentWillUnmount() {
        clearTimeout(this.timer);
    }

    render() {
        return (
            <h1>
                Invalid login, please login again.
            </h1>
        );
    }
}

export default InvalidLogin;