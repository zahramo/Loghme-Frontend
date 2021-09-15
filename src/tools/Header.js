import React from "react";
import axios from 'axios';
import './header.css';
import logo from '../Assets/LOGO.png';
import { Link } from 'react-router-dom';
import Cart from '../restaurantMenu/Cart'
import Modal from 'react-bootstrap/Modal'
import convertToPersian from './Converter'
import notify from "./Notify";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

class Header extends React.Component{
    constructor(probs) {
        super(probs);
        this.state = {foodCount : 0,
                       cartData :{
                        restaurantName : "",
                        foods :{},
                        totalCost : "",
                        restaurantId:""
                    },
                 }
        this.fetchCartDataIn = this.fetchCartDataIn.bind(this);
        this.handleLogOut = this.handleLogOut.bind(this);
    }

    handleLogOut(){
        localStorage.clear();
    }

    render() {
        return(
            <header>
                <ToastContainer
                position="top-right"
                hideProgressBar={false}
                autoClose={false}
                newestOnTop={true}
                closeOnClick={false}
                draggable={false}
                rtl={false}
                />
                <nav className="navbar navbar-expand-sm bg-light navbar-light fixed-top row">
                    <div className="col-sm-12">
                    {this.props.page === "home" ? '' :
                            <div className="nav navbar-nav navbar-right">
                                <Link to="/home"><img className="header-logo" src={logo} alt="logo"/></Link>
                            </div>
                        }
                        <ul className="nav navbar-nav">
                            <li><Link className="exit-command" to="/login" onClick={this.handleLogOut}>خروج</Link></li>
                            {this.props.page === "profile" ? '' :
                            <li><Link className="exit-command" to="/user">حساب کاربری</Link></li>
                            }

                            {this.props.page === "restaurant"?(
                            <CartInOtherPage page="header" cartData={this.props.cartData}
                                             fetchCartData={this.props.fetchCartData}
                                             foodCount={convertToPersian(this.props.foodCount)} fetchCartSize ={this.props.fetchCartSize}/>
                            ):this.props.page === "home"?(
                            <CartInOtherPage page="headerHome" fetchFoodPartyData = {this.props.fetchFoodPartyData}
                                             cartData={this.state.cartData} fetchCartData={this.fetchCartDataIn}
                                             foodCount={convertToPersian(this.props.foodCount)} fetchCartSize ={this.props.fetchCartSize}/>
                            ):this.props.page === "profile"?(
                            <CartInOtherPage page="headerProfile"  fetchUserInfo = {this.props.fetchUserInfo}
                                             cartData={this.state.cartData} fetchCartData={this.fetchCartDataIn}
                                             foodCount={convertToPersian(this.state.foodCount)} fetchCartSize ={this.fetchCartSizeIn} /> )
                            :(
                            <CartInOtherPage page="header" cartData={this.state.cartData}
                                             fetchCartData={this.fetchCartDataIn}
                                             foodCount={convertToPersian(this.state.foodCount)} fetchCartSize ={this.fetchCartSizeIn}/> )
                            }
                        </ul>
                    </div>
                </nav>
            </header>
        );
    }

    componentDidMount() {
        if(this.props.page === "restaurant"){}
        else if(this.props.page === "home"){
        this.fetchCartDataIn();}
        else{
        this.fetchCartSizeIn();
        this.fetchCartDataIn();
        }
        console.log("-----------HEADER DID MOUNT------------");
    }

    fetchCartSizeIn(){
        const config = {
            headers: {
                authorization: `Bearer ${localStorage.getItem("loghmeJwt")}`
            }
        };
        axios.get(`http://185.166.105.6:32002/cart/foodCount`,config)
		.then(response => {
            console.log(response.headers)
			this.setState({ 
                foodCount : response.data
            });
		})
		.catch(err => {
            if(err.response != null){
                if(err.response.status === 401 && localStorage.getItem("loghmeJwt") != null){
                    console.log("jwt expired")
                    localStorage.removeItem("loghmeJwt")
                    // window.location.hash = "#/login";
                }
                // notify(err.response.data);

            }
            console.log(err);
        } )
    }


    fetchCartDataIn(){
        const config = {
            headers: {
                authorization: `Bearer ${localStorage.getItem("loghmeJwt")}`
            }
        };
        axios.get(`http://185.166.105.6:32002/cart`, config)
		.then(response => {
            console.log(response)
            this.setState({
                cartData : response.data
            })
		})
		.catch(err => {
            if(err.response != null){
                if(err.response.status === 401 && localStorage.getItem("loghmeJwt") != null){
                    console.log("jwt expired")
                    localStorage.removeItem("loghmeJwt")
                    // window.location.hash = "#/login";
                }
                notify(err.response.data);

            }
            console.log(err)} )
        if(this.props.page === "restaurant"){
            this.props.fetchCartSize();
        }else if(this.props.page === "home"){
            this.props.fetchCartSize();
        }else{
            this.fetchCartSizeIn();
        } 
        
    }

    componentWillUnmount() {
        clearInterval(this.timerId);
    }

}


const CartInOtherPage = (data) => {
    const [isOpen, setIsOpen] = React.useState(false);
    const showModal = () => {
        data.fetchCartData();
      setIsOpen(true);
    };
    const hideModal = () => {
      setIsOpen(false);
    };
    return (
        
      <>
        <li><Link onClick={showModal} href="#" className="flaticon-smart-cart"/>
            <span className= "shopping-cart-count" data-count={data.foodCount}/>
        </li>      
        <Modal class="cart-detail  col-sm-3 center-block" {...data} show={isOpen} onHide={hideModal}>
          <Modal.Body class="shopping-cart">
              {data.page === "headerProfile"?
              (
                <Cart page = {data.page} cartData = {data.cartData}  fetchUserInfo = {data.fetchUserInfo}
                      fetchCartData ={data.fetchCartData} fetchCartSize ={data.fetchCartSize} />
              ):
              data.page === "headerHome"?
                (
                    <Cart page = {data.page} cartData = {data.cartData}  fetchFoodPartyData = {data.fetchFoodPartyData}
                          fetchCartData ={data.fetchCartData} fetchCartSize ={data.fetchCartSize} />
                ):
                <Cart page = {data.page} cartData = {data.cartData} fetchCartSize ={data.fetchCartSize}  fetchCartData ={data.fetchCartData} />

                }
          </Modal.Body>
        </Modal>
      </>
    );
  };


export default Header;