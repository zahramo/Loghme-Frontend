import React, { Component } from 'react'
import notify from "../tools/Notify";
import axios from "axios";
import { GoogleLogin, GoogleLogout } from 'react-google-login';
import '../userLogin/login.css'

const CLIENT_ID = '761073171153-n74eqv173v91frbt9v833h18llg801p0.apps.googleusercontent.com';

class GoogleBtn extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLogined: false,
      accessToken: ''
    };

    this.login = this.login.bind(this);
    this.handleLoginFailure = this.handleLoginFailure.bind(this);
    this.logout = this.logout.bind(this);
    this.handleLogoutFailure = this.handleLogoutFailure.bind(this);
  }

  login (response) {
    if(response.accessToken){
        axios.post('http://185.166.105.6:32002/googleLogin', 
        {
            "Access-Control-Allow-Origin" : "*",
            'Access-Control-Request-Headers': '*'
        },
        {
            params: {
                email: response.profileObj.email
            }
        })
        .then(response => {
            window.location.hash = "#/home";
            console.log(response.data);
            localStorage.setItem("loghmeJwt", response.data[0]);
            this.setState(state => ({
                isLogined: true,
                accessToken: response.accessToken
              }));
        })
        .catch( err => {
            if(err.response != null){
                console.log(err.response);
                this.setState(state => ({
                    isLogined: false,
                    accessToken: ''
                  }));
                if(err.response.status === 401 && localStorage.getItem("loghmeJwt") != null){
                  console.log("jwt expired")
                  localStorage.removeItem("loghmeJwt")
                }
                else if(err.response.status === 401){
                    window.location.hash = "#/signup";
                }
                notify(err.response.data)
            }
        });
    }
  }

  logout (response) {
    this.setState(state => ({
      isLogined: false,
      accessToken: ''
    }));
  }

  handleLoginFailure (response) {
    notify('ورود از طریق گوگل غیرفعال است')
  }

  handleLogoutFailure (response) {
    notify('خروج از طریق گوگل غیر فعال است')
  }

  render() {
    return (
    <div>
      { this.state.isLogined ?
        <GoogleLogout
          clientId={ CLIENT_ID }
          buttonText='Logout'
          onLogoutSuccess={ this.logout }
          onFailure={ this.handleLogoutFailure }
        >
        </GoogleLogout>
        : <GoogleLogin
          clientId={CLIENT_ID}
          buttonText='Google ورود با'
          onSuccess={ this.login }
          onFailure={ this.handleLoginFailure }
          cookiePolicy={ 'single_host_origin' }
          responseType='code,token'
        />
      }

    </div>
    )
  }
}

export default GoogleBtn;