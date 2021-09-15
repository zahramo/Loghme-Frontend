import React from "react";
import axios from "axios";
import Footer from '../tools/Footer'
import './signup.css';
import '../Assets/Fonts/vazir-fonts/fonts.css';
import notify from "../tools/Notify";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// import "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css";
var md5 = require('md5');
class Signup extends React.Component{
    render() {
        return(
            <>
                <main> 
                <body className="body-default">
                <ToastContainer
                position="top-right"
                hideProgressBar={false}
                autoClose={false}
                newestOnTop={true}
                closeOnClick={false}
                draggable={false}
                rtl={false}
                /> 
                    <PinkBar></PinkBar>
                    <Form></Form>
                </body>
                </main> 
                <Footer></Footer>
            </>
            
        );
    }

    componentDidMount(){
        if(localStorage.getItem("loghmeJwt") != null){
            window.location.hash = "#/home";
        }
    }
}

class PinkBar extends React.Component{
    render() {
        return(
            <div class="row">
            <div class="col-sm-12 pink-bar">
                <img class="logo center-block" alt="loghme logo" src={require("../Assets/LOGO.png")}/>
            </div>
            </div>
        );
    }
}

class Form extends React.Component{
    constructor(probs) {
        super(probs);
        this.state = {firstname: '', lastname: '',
                        phonenumber: '', email: '',
                        password: '', repeatPassword: ''};
        this.handleFirstNameChange = this.handleFirstNameChange.bind(this);
        this.handleLastNameChange = this.handleLastNameChange.bind(this);
        this.handlePhoneNumberChange = this.handlePhoneNumberChange.bind(this);
        this.handleEmailChange = this.handleEmailChange.bind(this);
        this.handlePasswordChange = this.handlePasswordChange.bind(this);
        this.handleRepeatPasswordChange = this.handleRepeatPasswordChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleFirstNameChange(event){
        this.setState({firstname: event.target.value});
    }

    handleLastNameChange(event){
        this.setState({lastname: event.target.value});
    }

    handlePhoneNumberChange(event){
        this.setState({phonenumber: event.target.value});
    }

    handleEmailChange(event){
        this.setState({email: event.target.value});
    }

    handlePasswordChange(event){
        this.setState({password: event.target.value});
    }

    handleRepeatPasswordChange(event){
        this.setState({repeatPassword: event.target.value});
    }

    handleSubmit(event){
        console.log("--- sign up ---")
        event.preventDefault()
        if(this.state.password !== this.state.repeatPassword){
            notify("تکرار رمز عبور و رمز عبور یکی نیستند");
            return false;
        }
        else{
            var hashPassword = md5(this.state.password);
            console.log("---------")
            console.log(hashPassword)
            
            axios.post('http://185.166.105.6:32002/signup', 
            {
                "Access-Control-Allow-Origin" : "*",
                'Access-Control-Request-Headers': '*'
            },
            {
                params: {
                    firstName: this.state.firstname,
                    lastName: this.state.lastname,
                    phoneNumber: this.state.phonenumber,
                    email: this.state.email,
                    password: hashPassword
                }
            })
              .then(response => {
                  console.log("---i can't believe---")
                window.location.hash = "#/login";
                console.log(response.data);
              })
              .catch( err => {
                  if(err.response != null){
                    console.log(err.response.data);
                    notify(err.response.data)
                  }
              });
        }
    }

    render() {
        return(
            <form class="row" onSubmit={this.handleSubmit}>
            <div class="col-sm-6 col-sm-offset-3 signup-box">
                <div class="row center-block signup-bar">
                    <div class="bar-title center-block">خوش آمدید</div>
                </div>
                <div class="row">
                    <div class="center-block col-sm-7">
                        <input type="text" name="firstname" id="firstname" placeholder="نام" class="signup-field"
                               onChange={this.handleFirstNameChange} required/>
                    </div>
                    <div class="center-block col-sm-7">
                        <input type="text" name="lastname" id="lastname" placeholder="نام خانوادگی" class="signup-field"
                               onChange={this.handleLastNameChange} required/>
                    </div>
                    <div class="center-block col-sm-7">
                        <input type="tel" name="phonenumber" id="phonenumber" placeholder="شماره تماس" class="signup-field"
                               pattern="[0-9]{11}"
                               onChange={this.handlePhoneNumberChange} required/>
                    </div>
                    <div class="center-block col-sm-7">
                        <input type="email" name="emailaddress" id="emailaddress" placeholder="ایمیل" class="signup-field"
                               onChange={this.handleEmailChange} required/>
                    </div>
                    <div class="center-block col-sm-7">
                        <input type="password" name="password" id="password" placeholder="رمز عبور" class="signup-field"
                               onChange={this.handlePasswordChange} required/>
                    </div>
                    <div class="center-block col-sm-7">
                        <input type="password" name="re-password" id="re-password" placeholder= "تکرار رمز عبور" class="signup-field"
                               onChange={this.handleRepeatPasswordChange} required/>
                    </div>
                    <div class="center-block col-sm-7">
                        <input type="submit" name="userpass" value="ثبت نام" id="button" class="submit-button"/>
                    </div>
                </div>
            </div>
        </form>
        );
    }
}

export default Signup;