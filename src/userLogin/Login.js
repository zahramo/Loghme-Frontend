import React from "react";
import './login.css'
import Footer from '../tools/Footer'
import LoghmeLogo from '../Assets/LOGO.png'
import '../Assets/my-icons-collection/font/flaticon.css';
import '../Assets/Fonts/vazir-fonts/fonts.css';
import notify from "../tools/Notify";
import {ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import GoogleBtn from '../tools/GoogleBtn'


// comment

var md5 = require('md5');
class Login extends React.Component{
    render() {
        return(
            <>
                <div className="body-default">
                    <PinkBar />
                    <LoginForm />
                </div>
                <Footer />
            </>
        );
    }
    
    componentDidMount(){
        console.log("---checking kubernetes deployment---");
        if(localStorage.getItem("loghmeJwt") != null){
            window.location.hash = "#/home";
        }
    }
}

class PinkBar extends React.Component{
    render() {
        return(
            <div className="row">
                <div className="col-sm-12 pink-bar">
                    <img className="logo center-block" alt="loghme logo" src={LoghmeLogo}/>
                </div>
            </div>
        );
    }
}

class LoginForm extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            username : '',
            password : ''
        }
        this.handleEmailChange = this.handleEmailChange.bind(this);
        this.handlePasswordChange = this.handlePasswordChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleEmailChange(event){
        this.setState({username: event.target.value});
    }

    handlePasswordChange(event){
        this.setState({password: event.target.value});
    }

    handleSubmit(event){
        event.preventDefault();
        var hashPassword = md5(this.state.password);
        
        axios.post('http://185.166.105.6:32002/login', 
        {
            "Access-Control-Allow-Origin" : "*",
            'Access-Control-Request-Headers': '*'
        },
        {
            params: {
                email: this.state.username,
                password: hashPassword
            }
        })
        .then(response => {
            window.location.hash = "#/home";
            localStorage.setItem("loghmeJwt", response.data[0]);
            })
        .catch( err => {
        console.log("---here---")
            if(err.response != null){
                console.log(err.response.data);
                notify(err.response.data)
            }
        });
    }

    render() {
        return(
            <div className="row">
                <ToastContainer
                position="top-right"
                hideProgressBar={false}
                autoClose={false}
                newestOnTop={true}
                closeOnClick={false}
                draggable={false}
                rtl={false}
                />  
                <div className="col-sm-6 col-sm-offset-3 login-box">
                    <div className="row center-block login-bar">
                        <div className="bar-title center-block">خوش آمدید</div>
                    </div>
                    <form className="row" onSubmit={this.handleSubmit}>
                        <div className="username center-block col-sm-7">
                            <input type="email" name="email" placeholder="ایمیل"
                                   className="login-field" onChange={this.handleEmailChange} required />
                            <span className="fa fa-envelope"/>
                        </div>
                        <div className="password center-block col-sm-7">
                            <input type="password" name="password" placeholder="رمز عبور"
                                   className="login-field" onChange={this.handlePasswordChange} required />
                                <span className="fa fa-lock"/>
                        </div>
                        <div className="center-block col-sm-7">
                            <input type="submit" name="userpass" value="ورود" className="submit-button" />
                        </div>
                        <div className="center-block col-sm-7 google-signIn">
                        <GoogleBtn className="center-block"/>
                    
                        </div>
                    </form>
                    
                </div>
            </div>
        );
    }
}



export default Login;