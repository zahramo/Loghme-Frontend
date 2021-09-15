import React from "react";
import './restaurant.css';
import axios from 'axios';
import { Link } from 'react-router-dom';
import 'react-notifications/lib/notifications.css';
import convertToPersian from '../tools/Converter'
import notify from "../tools/Notify";
import "react-toastify/dist/ReactToastify.css";


class Cart extends React.Component{
    constructor(probs) {
        super(probs);
        this.finalizeOrder = this.finalizeOrder.bind(this);
        this.addFoodToCart = this.addFoodToCart.bind(this);
        this.deleteFoodFromCart = this.deleteFoodFromCart.bind(this);
        axios.defaults.headers.common = {'authorization': `${localStorage.getItem("loghmeJwt")}`}
    }

    finalizeOrder(event){
        event.preventDefault();
        const config = {
            headers: {
                authorization: `Bearer ${localStorage.getItem("loghmeJwt")}`
            }
        };
        axios.post(`http://185.166.105.6:32002/order`,{
            "Access-Control-Allow-Origin" : "*",
            'Access-Control-Request-Headers': '*'
        },config)
		.then(response => {
            console.log(response);
            this.props.fetchCartData();
            if(this.props.page === "headerProfile"){
                this.props.fetchUserInfo()
            }
            else if(this.props.page === "headerHome"){
                this.props.fetchFoodPartyData()
            }
            this.props.fetchCartSize();
            notify("سفارش شما با موفقیت ثبت شد، وضعیت سفارش را از صفحه‌ی پروفایل خود دنبال کنید ");
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
            console.log(err)
        } )
    }
    addFoodToCart(e, food){
        e.preventDefault();
        const config = {
            headers: {
                authorization: `Bearer ${localStorage.getItem("loghmeJwt")}`
            }
        };
        if(food.isUnderSale === "1"){
            axios.post('http://185.166.105.6:32002/partyCart/'+ food.name +'/'+ this.props.cartData.restaurantId +'/1',{
                "Access-Control-Allow-Origin" : "*",
                'Access-Control-Request-Headers': '*'
            },config)
		.then(response => {
            console.log(response)
            this.props.fetchCartData()
            this.props.fetchCartSize();
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
            console.log(err)
        }
             )

        }else{
            axios.post('http://185.166.105.6:32002/cart/'+ food.name +'/'+ this.props.cartData.restaurantId +'/1',{
                "Access-Control-Allow-Origin" : "*",
                'Access-Control-Request-Headers': '*'
            },config)
		.then(response => {
            console.log(response)
            this.props.fetchCartData()
             this.props.fetchCartSize();
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
            console.log(err)
        } )

        }
        
    }
    deleteFoodFromCart(e, foodName){
        e.preventDefault();
        const config = {
            headers: {
                authorization: `Bearer ${localStorage.getItem("loghmeJwt")}`
            }
        };
        axios.delete('http://185.166.105.6:32002/cart/'+ foodName,config)
		.then(response => {
            console.log(response)
            this.props.fetchCartData()
            this.props.fetchCartSize();
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
            console.log(err)
        } )
    }
    render() {
        const cartData = this.props.cartData
        return(
            <>
            {this.props.page === "restaurant"  ? (
            <div class="col-sm-4 shopping-cart">
            <form onSubmit={(e)=> { e.preventDefault(); this.finalizeOrder(e)}}>
            <div class="box">
                <div class="name">
                    سبد خرید
                </div>
                <div class="foods">
                    {
                        Object.keys(cartData.foods).map((keyName, i) => (
                                <div class="order">
                                    <span class="cart-food">
                                        {cartData.foods[keyName].name}
                                    </span>
                                    <Link onClick={(e) => {
                                        if(cartData.foods[keyName].num>0) {
                                            this.deleteFoodFromCart(e, cartData.foods[keyName].name)
                                        }
                                    }}>
                                    <span  dir="ltr" class="flaticon-minus float-left">
                                    </span>
                                    </Link>
                                    <span dir="ltr" class="food-number float-left">
                                        {convertToPersian(cartData.foods[keyName].num)}
                                    </span>
                                    <Link onClick={(e) => this.addFoodToCart(e, cartData.foods[keyName])}>
                                    <span  dir="ltr" class="flaticon-plus float-left">
                                    </span>
                                    </Link>
                                    <div class="price">
                                        {convertToPersian(cartData.foods[keyName].totalCost)}
                                        تومان
                                    </div>
                                </div>
                            )
                        )
                    }
                </div>
                <div class="total">
                    <span>
                        جمع کل:
                    </span>
                    <span class="price">
                        {convertToPersian(cartData.totalCost)}
                        تومان
                    </span>
                </div>
                <button class="final-check center-block" type="submit">
                    تایید نهایی
                </button>
            </div>
            </form>

        </div> ):null}
        {this.props.page === "header" || this.props.page === "headerProfile" || this.props.page === "headerHome" ? (
            <form onSubmit={this.finalizeOrder}>  
            <div>
                <div class="name">
                    سبد خرید
                </div>
                <div class="foods">
                    {Object.keys(cartData.foods).map((keyName, i) => (
					<div class="order">
                        <span class="cart-food">
                            {cartData.foods[keyName].name}
                        </span>

                        <Link onClick={(e) => {
                            if(cartData.foods[keyName].num > 0) {
                                this.deleteFoodFromCart(e, cartData.foods[keyName].name)
                            }
                        }}>
                            <span  dir="ltr" class="flaticon-minus float-left"/>
                        </Link>
                        <span dir="ltr" class="food-number float-left">
                            {convertToPersian(cartData.foods[keyName].num)}
                        </span>
                        <Link onClick={(e) => this.addFoodToCart(e, cartData.foods[keyName])}>
                        <span  dir="ltr" class="flaticon-plus float-left">
                        </span>
                        </Link>
                        <div class="price">
                            {convertToPersian(cartData.foods[keyName].totalCost)}
                            تومان
                        </div>
                    </div>
					))}

                </div>
                <div class="total">
                    <span>
                        جمع کل:
                    </span>
                    <span class="price">
                        {convertToPersian(cartData.totalCost)}
                        تومان
                    </span>
                </div>
                <button class="final-check center-block" type="submit">
                    تایید نهایی
                </button>
            </div>
            </form>
        ):null }
        </>
                  
    );
    }
}




export default Cart;