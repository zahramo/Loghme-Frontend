import React from "react";
import './restaurant.css';
import Header from '../tools/Header'
import Footer from '../tools/Footer'
import axios from 'axios';
import Modal from 'react-bootstrap/Modal'
import "bootstrap/dist/css/bootstrap.min.css";
import Cart from './Cart'
import { Link } from 'react-router-dom';
import 'react-notifications/lib/notifications.css';
import convertToPersian from '../tools/Converter'
import notify from "../tools/Notify";
import "react-toastify/dist/ReactToastify.css";


class Restaurant extends React.Component{
    constructor(probs) {
        super(probs);
        this.state = {
            restaurantData :{
                name : "",
                logo : "",
                menu : {}
            },
            restaurantDataLoaded : false,
            cartData :{
                restaurantName : "",
                foods :{},
                totalCost : "",
                restaurantId:""
            },
            cartDataLoaded : false,
            foodCount:0
        };
        this.fetchRestaurantData = this.fetchRestaurantData.bind(this);
        this.fetchCartData = this.fetchCartData.bind(this);
        this.fetchCartSize = this.fetchCartSize.bind(this);
    }

    fetchCartSize(){
        const config = {
            headers: {
                authorization: `Bearer ${localStorage.getItem("loghmeJwt")}`
            }
        };
        axios.get(`http://185.166.105.6:32002/cart/foodCount`, config)
		.then(response => {
            console.log(response)
			this.setState({ 
                foodCount : response.data
            });
		})
		.catch(err => {
            console.log(err) 
            if(err.response != null){
                if(err.response.status === 401 && localStorage.getItem("loghmeJwt") != null){
                    console.log("jwt expired")
                    localStorage.removeItem("loghmeJwt")
                    
                    // window.location.hash = "#/login";
                }
                // notify(err.response.data);
            }
            
        } )
    }


    fetchCartData(){
        const config = {
            headers: {
                authorization: `Bearer ${localStorage.getItem("loghmeJwt")}`
            }
        };
        axios.get(`http://185.166.105.6:32002/cart`, config)
		.then(response => {
			this.setState({ 
                cartData : response.data,
                cartDataLoaded : true
            });
            this.fetchCartSize()
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
            console.log(err) } )
        
    }

    fetchRestaurantData(id){
        const config = {
            headers: {
                authorization: `Bearer ${localStorage.getItem("loghmeJwt")}`
            }
        };
        axios.get(`http://185.166.105.6:32002/restaurant/`+id, config)
		.then(response => {
            console.log(response.data)
			this.setState({ 
                restaurantData : response.data,
                restaurantDataLoaded : true
            });
		})
		.catch(err => {
            if(err.response != null){
                if(err.response.status === 401 && localStorage.getItem("loghmeJwt") != null){
                    console.log("jwt expired")
                    localStorage.removeItem("loghmeJwt")
                    
                    // window.location.hash = "#/login";
                }
                //  notify(err.response.data);
                
            }
            console.log(err) } )
    }
    componentDidMount(){
        if(localStorage.getItem("loghmeJwt") === null){
            window.location.hash = "#/login";
        }
        else{
            const { id } = this.props.match.params;
            this.fetchCartSize();
            this.fetchCartData();
            this.fetchRestaurantData(id);
        }

    }

    render() {
        
        return(
            <>
                <Header page = "restaurant" cartData = {this.state.cartData} fetchCartSize={this.fetchCartSize}
                        fetchCartData={this.fetchCartData} foodCount={this.state.foodCount}/>
                <body className="body-default">
                    <PinkBar imgAddr ={this.state.restaurantData.logo} restaurantName={this.state.restaurantData.name} />
                    <div>
                        <div class="row">
                            <div class="col-sm-8 name"> 
                                <div class="col-sm-3 col-sm-offset-3  menu-name ">
                                    منوی غذا
                                </div>
                            </div>
                        </div>
                        <div dir="rtl" class="row d-flex flex-row-reverse all-foods">
                            <Menu foods={this.state.restaurantData.menu} fetchCartSize={this.fetchCartSize}
                                  restaurantName = {this.state.restaurantData.name} fetchCartData={this.fetchCartData}/>
                            <Cart page = "restaurant" cartData = {this.state.cartData} fetchCartData ={this.fetchCartData}
                                  fetchCartSize={this.fetchCartSize}/>
                        </div>
                    </div>
                    {this.state.restaurantDataLoaded ? '' :
                    <div className="d-flex justify-content-center">
                        <div className="spinner-border restaurant-spinner" role="status">
                            <span className="sr-only">Loading...</span>
                        </div>
                    </div>
                } 

                </body>
                <Footer/>
            </>
            
        );
    }
}

class PinkBar extends React.Component{
    render() {
        const imgAddr = this.props.imgAddr;
        const restaurantName = this.props.restaurantName;
        return(
            <div class="row">
                <div class="col-sm-12 pink-bar">
                <img class="restaurant-logo center-block" alt="restaurant logo" src= {imgAddr}/>
                    <div class="restaurant-name">
                        {restaurantName}
                    </div>
                </div>
            </div>
        );
    }
}

class Menu extends React.Component{
    render() {
        const foods = this.props.foods;
        const restaurantName = this.props.restaurantName;
        return(
                <div class="col-sm-8 food-menu"> 
                    {Object.keys(foods).map((keyName, i) => (
							<Food fetchCartSize={this.props.fetchCartSize} data={foods[keyName]}
                                  restaurantName={restaurantName} fetchCartData={this.props.fetchCartData}/>
					))}
                </div>
        );
    }
}


class Food extends React.Component{
    constructor(probs) {
        super(probs);
        this.addToCart = this.addToCart.bind(this);
    }


    componentDidMount(){
    }

    addToCart(i){
        const config = {
            headers: {
                authorization: `Bearer ${localStorage.getItem("loghmeJwt")}`
            }
        };
        axios.post('http://185.166.105.6:32002/cart/'+ this.props.data.name +'/'+this.props.data.restaurantId +'/'+ i,{
            "Access-Control-Allow-Origin" : "*",
            'Access-Control-Request-Headers': '*'
        }, config)
		.then(response => {
            this.props.fetchCartData()
            this.props.fetchCartSize()
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
            console.log(err) } )
    }


    render() {
        const data = this.props.data;
        const restaurantName = this.props.restaurantName;
        return(
            <form>
                <div className="col-sm-3 food-box">
                    <div>
                        <img src={data.image} alt="food" class="center-block food-image"/>
                    </div>
                    <div className="food-name center-block">
                        {data.name}
                        <span className="star">
                            {convertToPersian(data.popularity)}
                            <img src={require("../Assets/star.png")} alt="star"/>
                        </span>
                    </div>
                    <div className="center-block food-price">
                        {convertToPersian(data.price)}
                        تومان
                    </div>
                    <FoodDetail food={data} restaurant={restaurantName} addToCart={this.addToCart}/>
                </div>
            </form>
        );
    }
}


const FoodDetail = (data) => {
    const [isOpen, setIsOpen] = React.useState(false);
    const [foodNumber, setFoodNumber] = React.useState(0);
    const showModal = (event) => {
        event.preventDefault();
        initialFoodNumber();
          setIsOpen(true);
    };
    const hideModal = () => {
      setIsOpen(false);
    };
    const increaseFoodNumber = () =>{
        setFoodNumber(foodNumber+1)
    };

    const decreaseFoodNumber = () =>{
        if(foodNumber>0) {
            setFoodNumber(foodNumber - 1)
        }
    };

    const initialFoodNumber = () =>{
        setFoodNumber(0)
    };

    const handleSubmit = (event) =>{
        event.preventDefault();
        data.addToCart(foodNumber);
        hideModal();
    };

    return (
      <>
        <button onClick={showModal}  class="center-block add-to-cart exist">
            افزودن به سبد خرید
        </button>
        <Modal className="food-detail col-sm-6 col-sm-offset-3" {...data} show={isOpen} onHide={hideModal}>
          <Modal.Body className="box">
              <div className="restaurant center-block">  
                  {data.restaurant}
              </div>
              <form onSubmit={handleSubmit}>
              <div className="details row">
                    <div className="col-sm-7">
                        <div className="name">
                        <span className="star">
                            {convertToPersian(data.food.popularity)}
                            <img src={require("../Assets/star.png")} alt="star"/>
                        </span>
                        {data.food.name}
                        </div>
                        <div className="description">
                        {data.food.description}
                        </div>
                        <div dir="rtl" className="price" >
                        {convertToPersian(data.food.price)}
                        تومان
                        </div>
                    </div>
                    <div className="col-sm-5">
                        <img class="food-pic center-block" alt="food logo" src={data.food.image}/>
                    </div>
              </div>
              <div dir="ltr" className="add-to-cart-final">
                <button onClick={handleSubmit} >
                    اضافه‌کردن به سبد خرید
                </button>
                <Link onClick={decreaseFoodNumber}>
                <span class="flaticon-minus">
                </span>
                </Link>
                <span dir="ltr" class="food-number">
                   {convertToPersian(foodNumber)}
                </span>
                <Link onClick={increaseFoodNumber}>
                <span dir="ltr" class="flaticon-plus">
                </span>
                </Link>
              </div>
            </form>
          </Modal.Body>
        </Modal>
      </>
    );
  };

  



export default Restaurant;