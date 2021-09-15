import React from "react";
import Header from '../tools/Header'
import notify from '../tools/Notify'
import Footer from '../tools/Footer'
import './home.css'
import LoghmeLogo from '../Assets/LOGO.png'
import axios from 'axios';
import ReactDOM from 'react-dom'
import Flickity from 'flickity';
import 'flickity/dist/flickity.min.css';
import { Link } from 'react-router-dom';
import Modal from 'react-bootstrap/Modal'
import Timer from "./Timer"
import convertToPersian from '../tools/Converter'
import "react-toastify/dist/ReactToastify.css";


class Home extends React.Component{
    constructor(probs) {
        super(probs);
        this.state = {
        foodPartyData :{
            foods : {},
            remainTime : 0
        },
            foodPartyLoaded : false,
            foodCount : 0,
            restaurants: [], restaurantsLoaded : false,
            searching : false,
            searchRestaurantName :'',
            searchFoodName : ''
            
        };
        this.restaurantPage = 1;
        this.searchPage = 1;
        this.fetchCartSize = this.fetchCartSize.bind(this);
        this.fetchFoodPartyData = this.fetchFoodPartyData.bind(this);
        this.search = this.search.bind(this);
        this.loadMoreDetail = this.loadMoreDetail.bind(this);
        this.prepareSearch = this.prepareSearch.bind(this);
    }

    fetchRestaurantsData(){
        const config = {
            headers: {
              authorization: `Bearer ${localStorage.getItem("loghmeJwt")}`
            }
        };
            
        const page =this.restaurantPage
        console.log("---jwt in home---")
        axios.get('http://185.166.105.6:32002/restaurants/'+ page + '/20',config)
            .then(response => {
                this.setState({
                    restaurants : response.data,
                    restaurantsLoaded : true
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

    search(restaurantName, foodName, firstSearch){
        this.setState({
            searching : true,
            searchFoodName : foodName,
            searchRestaurantName : restaurantName
        })
        var page = 1
        if(firstSearch === 1){
            page = 1
        }else{
            page = this.searchPage
        }
        var requestString;
        if(restaurantName !== '' && foodName !== ''){
            requestString = 'http://185.166.105.6:32002/search/'+ restaurantName +'/'+ foodName + '/' + page + '/20';
        }else if(restaurantName !== '' && foodName === ''){
            requestString = 'http://185.166.105.6:32002/searchRestaurant/'+ restaurantName + '/' + page + '/20';
        }else if(restaurantName === '' && foodName !== ''){
            requestString = 'http://185.166.105.6:32002/searchFood/'+ foodName + '/' + page + '/20';
        }
       
        const config = {
            headers: {
                authorization: `Bearer ${localStorage.getItem("loghmeJwt")}`
            }
        };
        axios.get(requestString,config)
            .then(response => {
                this.setState({
                    restaurants : response.data,
                    restaurantsLoaded : true
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
                    notify(err.response.data);

                }
            } )
    }

    prepareSearch(restaurantName, foodName){
        this.searchPage = 1
        this.search(restaurantName, foodName, this.searchPage);
        
    }

    fetchFoodPartyData(){
        const config = {
            headers: {
                authorization: `Bearer ${localStorage.getItem("loghmeJwt")}`
            }
        };
        axios.get(`http://185.166.105.6:32002/foodParty`, config)
		.then(response => {
            
			this.setState({ 
                foodPartyData : response.data,
                foodPartyLoaded : true
            });
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

    fetchCartSize(){
        const config = {
            headers: {
                authorization: `Bearer ${localStorage.getItem("loghmeJwt")}`
            }
        };
        axios.get(`http://185.166.105.6:32002/cart/foodCount`, config)
		.then(response => {
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

    addFoodPartyToCart(foodName, restaurantId, i){
        const config = {
            headers: {
                authorization: `Bearer ${localStorage.getItem("loghmeJwt")}`
            }
        };
        axios.post('http://185.166.105.6:32002/partyCart/'+ foodName +'/'+ restaurantId +'/' + i,{
            "Access-Control-Allow-Origin" : "*",
            'Access-Control-Request-Headers': '*'
        }, config)
		.then(response => {
            console.log(response);
            this.fetchCartSize();
		})
		.catch(err => {
            if(err.response != null){
                if(err.response.status === 401 && localStorage.getItem("loghmeJwt") != null){
                    console.log("jwt expired");
                    localStorage.removeItem("loghmeJwt");
                    // window.location.hash = "#/login";
                }
                notify(err.response.data);

            }
            console.log(err)
        } )
    }

    loadMoreDetail(event){
        event.preventDefault();
        var newRestaurantPage = this.restaurantPage + 1
        var newSearchPage = this.searchPage + 1
        if(this.state.searching){
            this.searchPage = newSearchPage
            this.search(this.state.searchRestaurantName,this.state.searchFoodName,0);
        }else{
            this.restaurantPage = newRestaurantPage
            this.fetchRestaurantsData();
        }  
    }

    componentDidMount(){
        if(localStorage.getItem("loghmeJwt") === null){
            window.location.hash = "#/login";
        }
        else{
            this.fetchFoodPartyData();
            this.fetchCartSize();
            this.fetchRestaurantsData();
        }
    }

    render() {
        return(
            <>
                <Header page = "home" inRestaurantPage = {false} fetchCartSize = {this.fetchCartSize} fetchFoodPartyData = {this.fetchFoodPartyData} foodCount={this.state.foodCount}/>
                <div className="body-default">
                <div className="row">
                <div className="col-sm-12">
                <Introduction />  
                <Search search = {this.prepareSearch}/>
                <FoodParty addFoodPartyToCart= {this.addFoodPartyToCart} foodPartyData={this.state.foodPartyData}
                           fetchCartSize={this.fetchCartSize} fetchFoodPartyData = {this.fetchFoodPartyData} loaded = {this.state.foodPartyLoaded} />
                <Restaurants restaurants= {this.state.restaurants} restaurantsLoaded={this.state.restaurantsLoaded} />
                
                </div>
                </div>
                <Link onClick={this.loadMoreDetail} className="more-detail center-block">نمایش بیشتر</Link>
                </div>
                <Footer />
            </>
        );
    }


}

class Introduction extends React.Component{
    render() {
        return(
            <div className="row">
            <div className="cover-navbar col-sm-12">
                <img src={LoghmeLogo} className="loghme-logo" alt="loghme-logo"/>
                <div className="loghme-description">اولین و بزرگترین وب سایت سفارش آنلاین غذا در دانشگاه تهران</div>
            </div>
            </div>
        );
    }
}

class Search extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            foodName : '',
            restaurantName : ''
        }
        this.handleFoodNameChange = this.handleFoodNameChange.bind(this);
        this.handleRestaurantNameChange = this.handleRestaurantNameChange.bind(this);
        this.handleSearch = this.handleSearch.bind(this);
    }
    handleFoodNameChange(event){
        this.setState({foodName: event.target.value});
    }
    handleRestaurantNameChange(event){
        this.setState({restaurantName: event.target.value});
    }
    handleSearch(event){
        event.preventDefault();
        if(this.state.foodName === '' && this.state.restaurantName === ''){
            notify('ابتدا نام غذا یا رستوران مورد نظرتان را وارد کنید')
        }else{
            this.props.search(this.state.restaurantName, this.state.foodName);
        }
    }
    

    render() {
        return (
            <form className="search" onSubmit={this.handleSearch}>
                <div className="row no-gutters">
                    <div className="center-block col-sm-4 offset-lg-0">
                        <input type="submit" name="search" value="جسـت و جـو" className="search-button"  />
                    </div>
                    <div className="center-block col-sm-4">
                        <input onChange={this.handleRestaurantNameChange} type="text" name="restaurant" placeholder="نـام رسـتوران" className="search-input"/>
                    </div>
                    <div className="center-block col-sm-4">
                        <input onChange={this.handleFoodNameChange} type="text" name="food" placeholder="نـام غـذا" className="search-input"/>
                    </div>
                </div>
            </form>
        );
    }

}

class FoodParty extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            start : false
        }
        this.startTimer = this.startTimer.bind(this);
    }
    

    render() {
        const foods = this.props.foodPartyData.foods;
        return (
            <div >
                <div className="center-block food-party-name">
                    !جشن غذا
                </div>
                <div className="remain-time center-block">
                      زمان باقی‌مانده 
                    : 
                    <Timer seconds = {this.props.foodPartyData.remainTime} fetchFoodPartyData={this.props.fetchFoodPartyData} />
                </div>
                <div className="food-party">
                <div className="row"/>
                    <Slider options={{autoPlay: 4000,pauseAutoPlayOnHover: true,wrapAround: true,
                        fullscreen: true,adaptiveHeight: true,}}>
                        {Object.keys(foods).map((keyName, i) => (
							<Food fetchCartSize={this.props.fetchCartSize}
                                  addFoodPartyToCart = {this.props.addFoodPartyToCart} data={foods[keyName]}/>
					    ))}
                    </Slider>
                </div>
                {this.props.loaded ? '' :
                    <div className="d-flex justify-content-center">
                        <div className="spinner-border foodparty-spinner" role="status">
                            <span className="sr-only">Loading...</span>
                        </div>
                    </div>
                }
            </div>
        );
    }
    startTimer(){
        this.setState({ 
            start : true
        });
    }
}

class Food extends React.Component{    
    render() {
        const data = this.props.data;
        return (
        
            <div className="food">
                <div className="row">
                <div className="col-sm-6">
                    <div className="name">
                     {data.name} 
                    </div>
                    <div className="star">
                        <img src={require("../Assets/star.png")} alt="star"/>
                        {convertToPersian(data.popularity)}
                    </div>
                </div>
                <div className="col-sm-4 ">
                    <img className="image"  alt="foodParty logo" src= {data.image}/>
                </div>
                </div>
                <div className = "row price">
                <div className="col-sm-6 low">
                    {convertToPersian(data.discountprice)}
                </div>
                <div className="col-sm-6 high">
                    {convertToPersian(data.oldPrice)}
                </div>
                </div>
                {(data.count > 0 )?(
                <div className = "row submit">
                    <FoodDetail fetchCartSize={this.props.fetchCartSize} food={data}
                                addFoodPartyToCart = {this.props.addFoodPartyToCart} restaurant={data.restaurantName}/>
                    <div className="  enough">
                    موجودی:
                    {convertToPersian(data.count)}
                    </div>
                </div> ):(
                <div className = "row submit"> 
                    <div className="not-buy">
                    خرید    
                    </div>
                    <div className=" not-enough">
                    ناموجود
                    </div>
                </div>)}
                <div className="food-restaurant">
                   {data.restaurantName}
                </div>
            </div>
        );
    }

}

class Restaurants extends React.Component{
    constructor(props) {
        super(props);
        this.state = {}
    }


    render() {
        return (
            <div className="restaurants">
                <div className="center-block restaurant-title">رستوران ها</div>
                    {this.props.restaurants.map( function(restaurant,i) {
                        return(<Restaurant restaurant={restaurant} index={i} />);
                    })}
                    
                {this.props.restaurantsLoaded ? '' :
                    <div className="d-flex justify-content-center">
                        <div className="spinner-border restaurants-spinner" role="status">
                            <span className="sr-only">Loading...</span>
                        </div>
                    </div>
                }
            </div>
        );
    }

    componentDidMount() {
        // this.props.fetchRestaurantsData();
    }
}

class Restaurant extends React.Component{
    render() {
        return (
            <form action={"#/restaurant/" + this.props.restaurant.id} className="col-sm-3">
                <div className="center-block restaurant-box">
                    <img className="restaurant-img" src={this.props.restaurant.logo}  alt="restaurant-logo"/>
                    <div className="title">{this.props.restaurant.name}</div>
                    <button type="submit" className="show-menu-button">نمایش منو</button>
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
    const increaseFoodNumber = () => {
        if (foodNumber === data.food.count) {
            notify("نمی‌توانید تعداد این غذارا بیشتر کنید")
            
        } else {
            setFoodNumber(foodNumber + 1)
        }
    };

    const decreaseFoodNumber = () =>{
        if(foodNumber <=0){
            notify("نمی‌توانید تعداد این غذا را کمتر کنید")
        }
        else {
            setFoodNumber(foodNumber - 1)
        }
    };

    const initialFoodNumber = () =>{
        setFoodNumber(0)
    };

    const handleSubmit = (e, foodName, restaurantId) =>{
        e.preventDefault();
        data.addFoodPartyToCart(foodName,restaurantId,foodNumber);
        data.fetchCartSize();
        hideModal()
    };

    return (
      <>
        <button onClick={(e)=>{showModal(e)}} className="buy">
                    خرید
        </button>
        <Modal className="food-detail col-sm-6 col-sm-offset-3" {...data} show={isOpen} onHide={hideModal}>
          <Modal.Body className="box">
              <div className="restaurant center-block">  
                  {data.restaurant}
              </div>
              <form onSubmit={(e) => handleSubmit(e, data.food.name, data.food.restaurantId)}>
              <div className="details row">
                    <div className="col-sm-7">
                        <div className="name">
                        <span className="star">
                            {convertToPersian(data.food.popularity)}
                            <img src={require("../Assets/star.png")} alt="star"></img>
                        </span>
                        {data.food.name}
                        </div>
                        <div className="description">
                        {data.food.description}
                        </div>
                        <div dir="rtl" className="price" >
                            <div className="col-sm-6 low">
                            {convertToPersian(data.food.discountprice)}
                            تومان
                            </div>
                            <div className="col-sm-6 high">
                            {convertToPersian(data.food.oldPrice)}
                            </div>
                        </div>
                    </div>
                    <div className="col-sm-5">
                        <img class="food-pic center-block" alt="food logo" src={data.food.image}/>
                    </div>
              </div>
              <div dir="ltr" className="add-to-cart-final">
                <button>
                    اضافه‌کردن به سبد خرید
                </button>
                <Link onClick={decreaseFoodNumber}>
                <span class="flaticon-minus">
                </span>
                </Link>
                <span dir="ltr" class="food-number">
                   {convertToPersian(foodNumber)}
                </span>
                <Link onClick={(e)=>{e.preventDefault(); increaseFoodNumber()}}>
                <span dir="ltr" class="flaticon-plus">
                </span>
                </Link>
                <span className="count">
                    موجودی :
                    {data.food.count}
                </span>
              </div>
            </form>
          </Modal.Body>
        </Modal>
      </>
    );
  };


class Slider extends React.Component {
    constructor(props) {
      super(props);
  
      this.state = {
        flickityReady: false,
      };
  
      this.refreshFlickity = this.refreshFlickity.bind(this);
    }
  
    componentDidMount() {
      this.flickity = new Flickity(this.flickityNode, this.props.options || {});
  
      this.setState({
        flickityReady: true,
      });
    }
  
    refreshFlickity() {
      this.flickity.reloadCells();
      this.flickity.resize();
      this.flickity.updateDraggable();
    }
  
    // componentWillUnmount() {
    //   this.flickity.destroy();
    // }
  
    componentDidUpdate(prevProps, prevState) {
      const flickityDidBecomeActive = !prevState.flickityReady && this.state.flickityReady;
      const childrenDidChange = prevProps.children.length !== this.props.children.length;
  
      if (flickityDidBecomeActive || childrenDidChange) {
        this.refreshFlickity();
      }
    }
  
    renderPortal() {
      if (!this.flickityNode) {
        return null;
      }
  
      const mountNode = this.flickityNode.querySelector('.flickity-slider');
  
      if (mountNode) {
        return ReactDOM.createPortal(this.props.children, mountNode);
      }
    }
  
    render() {
      return [
        <div className={'test'} key="flickityBase" ref={node => (this.flickityNode = node)} />,
        this.renderPortal(),
      ].filter(Boolean);
    }
  }

  

export default  Home;