import React from 'react';
import FooterLogo from '../../../../assets/img/footer-logo.svg';
import './auth.scss';

const Footer = () => {
    return (
        <div className="footer">
            <div className="container">
                <div className="row align-items-center">
                    <div className="col-12 col-lg-6">
                        <img src={FooterLogo} alt="footer-logo"/>
                        <p>
                            Все права защищены, 2019 - 2020
                        </p>
                    </div>
                    <div className="col-12 col-lg-6">
                        <ul className="footer-menu">
                            <li><a href="https://smartpos.uz/">Главная</a></li>
                            <li><a href="https://smartpos.uz/trade.html">Trade</a></li>
                            <li><a href="https://smartpos.uz/cafe.html">Cafe</a></li>
                            <li><a href="https://smartpos.uz/outsourcing.html">Outsourcing</a></li>
                            <li><a href="https://smartpos.uz/sell.html">Sell</a></li>
                            <li><a href="https://smartpos.uz/">F.A.Q</a></li>
                            <li><a href="https://smartpos.uz/contacts.html">Контакты</a></li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    )
};
export default Footer;
