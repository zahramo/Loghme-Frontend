import React from "react";
import './footer.css';

class Footer extends React.Component{
    render() {
        return(
            <footer dir="rtl" className="row col-sm-13">
                <div className="footer-copyright center-block py-3">
                    © تمامی حقوق متعلق به لقمه است.
                </div>
            </footer>
        );
    }
}

export default Footer;