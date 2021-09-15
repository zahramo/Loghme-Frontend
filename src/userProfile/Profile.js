import React from "react";
import './profile.css';
import Header from '../tools/Header'
import Footer from '../tools/Footer'
import '../Assets/my-icons-collection/font/flaticon.css';
import '../Assets/Fonts/vazir-fonts/fonts.css';
import axios from "axios";
import Modal from 'react-bootstrap/Modal'
import "bootstrap/dist/css/bootstrap.min.css";
import {ModalBody} from "react-bootstrap";
import notify from "../tools/Notify";
import "react-toastify/dist/ReactToastify.css";
import convertToPersian from '../tools/Converter'

class Profile extends React.Component{
    defaultTab;
    constructor(props) {
        super(props);
        this.defaultTab = "order";
        this.state = {chosenTab : this.defaultTab,
                        userInfo : {firstName:'', lastName:'', phoneNumber:'', email:'', credit:''},
                        userInfoLoaded : false}
        this.fetchUserInfo = this.fetchUserInfo.bind(this);
        this.showCreditTab = this.showCreditTab.bind(this);
        this.showOrderTab = this.showOrderTab.bind(this);
        this.activeRequest = null;
    }


    showCreditTab(){
        this.setState({chosenTab : "credit"});
    }

    showOrderTab(){
        this.setState({chosenTab : "order"});
    }

    fetchUserInfo(){
        const config = {
            headers: {
                authorization: `Bearer ${localStorage.getItem("loghmeJwt")}`
            }
        };
        console.log("----profile jwt-----");
        console.log(localStorage.getItem("loghmeJwt"));
        axios.get(`http://185.166.105.6:32002/user`, config)

            .then(response => {
                this.setState({
                    userInfo : response.data
                });
                this.setState({
                    userInfoLoaded: true
                })
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
        console.log(this.state.userInfo);
    }

    render() {
        return(
            <>
                <Header page = "profile" fetchUserInfo={this.fetchUserInfo} />
                <div className="body-default">
                    <UserInfo userInfo={this.state.userInfo} fetchUserInfo={this.fetchUserInfo}
                              loaded = {this.state.userInfoLoaded}/>
                    <Table chosenTab = {this.state.chosenTab}
                           userInfo={this.state.userInfo} fetchUserInfo={this.fetchUserInfo}
                            showCreditTab={this.showCreditTab} showOrderTab={this.showOrderTab}/>
                </div>
                <Footer />
            </>
            
        );
    }

    componentDidMount() {
        if(localStorage.getItem("loghmeJwt") === null){
            window.location.hash = "#/login";
        }
        else{
            this.fetchUserInfo();
        }
        console.log("---------PROFILE PAGE DID MOUNT---------");
    }

}

class UserInfo extends React.Component{
    constructor(props) {
        super(props);
        this.fetchUserInfo = this.props.fetchUserInfo.bind(this);
    }

    render() {
        return(
            <>
                <div className="row pink-bar" lang="fa-IR">
                    <div className="col-sm-6 order-sm-12">
                        <div className="user-name">
                            <span id="text">{this.props.userInfo.firstName+' '+this.props.userInfo.lastName}</span>
                            <span className="flaticon-account"/>
                        </div>
                    </div>
                    <div className="col-sm-6 order-sm-1">
                        <div className="user-info">
                            <div>{convertToPersian(this.props.userInfo.phoneNumber)}<i className="flaticon-phone"/></div>
                            <div>{this.props.userInfo.email}<i className="flaticon-mail"/></div>
                            <div><span dir="rtl">{convertToPersian(this.props.userInfo.credit)} تومان</span><i className="flaticon-card"/></div>
                        </div>
                    </div>
                </div>
                {this.props.loaded ? '' :
                    <div className="d-flex justify-content-center">
                        <div className="spinner-border userinfo-spinner text-light" role="status">
                            <span className="sr-only">Loading...</span>
                        </div>
                    </div>
                }
            </>
        );
    }

    componentDidMount() {
        this.fetchUserInfo();
        console.log("---------USER INFO COMPONENT DID MOUNT---------");
    }

}

class Table extends React.Component{
    render() {
        return(
            <div className="container">
                <div className="center-block table-background">
                    <OptionBar chosenTab = {this.props.chosenTab}
                               showCreditTab={this.props.showCreditTab} showOrderTab={this.props.showOrderTab}/>
                    <TableContent content = {this.props.chosenTab} fetchUserInfo={this.props.fetchUserInfo}/>
                </div>
            </div>
        );
    }

    componentDidMount() {
        console.log("---------TABLE COMPONENT DID MOUNT---------");
    }

}

class OptionBar extends React.Component{
    constructor(props) {
        super(props);
        this.showCreditTab = this.props.showCreditTab.bind(this);
        this.showOrderTab = this.props.showOrderTab.bind(this);
    }

    render() {
        return(
            <div className="row options-bar dash-between">
                <button onClick={this.showCreditTab} className={"col-sm-6 credit-tab" +
                                        (this.props.chosenTab === "credit" ?" chosen-tab":"")}>افزایش اعتبار</button>
                <button onClick={this.showOrderTab} className={"col-sm-6 orders-tab" +
                                        (this.props.chosenTab === "order" ?" chosen-tab":"")}>سفارش ها</button>
            </div>
        );
    }
}

class TableContent extends React.Component{
    render() {
        return(
            (this.props.content === "order") ? <OrdersStatus /> : <CreditCharge fetchUserInfo={this.props.fetchUserInfo}/>
        );
    }
}

class OrdersStatus extends React.Component{
    constructor(props) {
        super(props);
        this.state = { userOrders : [], userOrdersLoaded : false }
    }
    render() {
        return(
            <>
                <div>
                    {this.state.userOrders.map( function(order,i) {
                        return(<OrderStatus order={order} index={i} />);
                    })}
                </div>
                {this.state.userOrdersLoaded ? '' :
                    <div className="d-flex justify-content-center">
                        <div className="spinner-border spinner" role="status">
                            <span className="sr-only">Loading...</span>
                        </div>
                    </div>
                }
            </>

        );
    }

    fetchUserOrders(){
        const config = {
            headers: {
                authorization: `Bearer ${localStorage.getItem("loghmeJwt")}`
            }
        };
        axios.get(`http://185.166.105.6:32002/order`, config)
            .then(response => {
                this.setState({
                    userOrders : response.data,
                    userOrdersLoaded : true
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

    componentDidMount() {
        this.fetchUserOrders();
        // this.timerId = setInterval(
        //     () => {this.fetchUserOrders()}
        //     , 10000
        // );
    }
}

const OrderStatus = (data) => {
    const [isOpen, setIsOpen] = React.useState(false);
    const showModal = () => {
        setIsOpen(true);
    };
    const hideModal = () => {
        setIsOpen(false);
    };

    return(
        <>
            <button className="row center-block border-between order" onClick={showModal}>
                    <div className="col-sm-5">
                        {(data.order.state === "SearchingForCourier") ?
                            <div className="order-status searching-courier">در جستجوی پیک</div> :
                            (data.order.state === "CourierOnTheWay") ?
                                <div className="order-status courier-on-way">پیک در مسیر</div> :
                                <div className="order-status view-invoice">مشاهده فاکتور</div>
                        }
                    </div>
                    <div className="col-sm-6">{data.order.restaurantName}</div>
                    <div className="col-sm-1">{convertToPersian((data.index+1).toString())}</div>
            </button>
            <Modal className="center-modal" {...data} show={isOpen} onHide={hideModal}>
                <ModalBody>
                    <div className="order-title">
                        {data.order.restaurantName}
                    </div>
                    <OrderList foods = {data.order.foods}/>
                    <div className="total-cost">جمع کل : {convertToPersian(data.order.totalCost)} تومان </div>
                </ModalBody>
            </Modal>
        </>
    );
}

class OrderList extends React.Component{
    render() {
        return (
            <div className="order-list">
                <div className="row table-info border-between">
                    <div className="col-sm-2">قیمت</div>
                    <div className="col-sm-2">تعداد</div>
                    <div className="col-sm-7">نام غذا</div>
                    <div className="col-sm-1 table-info-row-number">ردیف</div>
                </div>
                <div>
                    {this.props.foods === null ? "" : this.props.foods.map( (food,i) => {
                        return(
                            <div className="row order-food border-between">
                                <div className="col-sm-2">{convertToPersian(food.totalCost)}</div>
                                <div className="col-sm-2">{convertToPersian(food.num)}</div>
                                <div className="col-sm-7">{food.name}</div>
                                <div className="col-sm-1 table-info-row-number">{convertToPersian(i+1)}</div>
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    }
}

class CreditCharge extends React.Component{
    constructor(props) {
        super(props);
        this.state = {increaseAmount : ''}
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.fetchUserInfo = this.props.fetchUserInfo.bind(this);
    }

    handleChange(event) {
        if (event.target.value >= 0) {
            this.setState({increaseAmount: event.target.value});
        }
    }

    handleSubmit(event) {
        const config = {
            headers: {
                authorization: `Bearer ${localStorage.getItem("loghmeJwt")}`
            }
        };
        event.preventDefault();
        
        if (event.target.value < 0) {
            notify("increase amount must be positive!")
        } else {
            axios.post(`http://185.166.105.6:32002/credit/`+this.state.increaseAmount,{
                "Access-Control-Allow-Origin" : "*",
                'Access-Control-Request-Headers': '*'
            }, config)
                .then(res => {
                    this.fetchUserInfo();
                })
                .catch(err => {
                    console.log(err);
                    if(err.response != null){
                        if(err.response.status === 401 && localStorage.getItem("loghmeJwt") != null){
                            console.log("jwt expired")
                            localStorage.removeItem("loghmeJwt")
                            
                            // window.location.hash = "#/login";
                        }
                        notify(err.response.data);
                    }
                    
                    
                })
        }
    }

    render() {
        return(
            <>
                <form className="row increase-form center-block" onSubmit={this.handleSubmit}>
                    <div className="col-sm-4">
                        <input type="submit" value="افزایش" className="increase-button"/>
                    </div>
                    <div className="col-sm-8">
                        <input type="number" name="increaseAmount" placeholder="میزان افزایش اعتبار"
                               className="increase-field" value={this.state.increaseAmount} onChange={this.handleChange} />
                    </div>
                </form>
            </>
        );
    }
}

export default Profile;