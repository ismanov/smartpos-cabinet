import React from 'react';
import './auth.scss';
import SmartposLogo from '../../../../assets/img/logo_all.svg';

const Header = () => {
    return (
        <div className="header">
            <div className="container">
                <div className="row align-items-center">
                    <div className="col-12 col-lg-3">
                        <div className="d-flex justify-content-between align-items-center">
                            <a href="https://smartpos.uz/" className={'logo-wrap'}>
                                <img src={SmartposLogo} alt="smartpos-logo"/>
                            </a>
                            <div className="d-block d-lg-none navbar-light">
                                <button className="navbar-toggler" type="button" data-toggle="collapse"
                                        data-target="#main-menu-nav"
                                        aria-controls="main-menu-nav" aria-expanded="false"
                                        aria-label="Toggle navigation">
                                    <span className="navbar-toggler-icon" />
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className="col-12 col-lg-9">
                        <nav className="navbar navbar-expand-lg navbar-light cm-navbar">
                            <div className="collapse navbar-collapse" id="main-menu-nav">
                                <ul className="navbar-nav main-menu">
                                    <li className="nav-item"><a href="https://smartpos.uz/about-company.html">О компании</a></li>
                                    <li className="nav-item"><a href="https://smartpos.uz/">Договор оферты</a></li>
                                    <li className="nav-item"><a href="https://smartpos.uz/contacts.html">Контакты</a></li>
                                    {/*<li className="nav-item">*/}
                                    {/*    <div className="cm-menu-blocks">*/}
                                    {/*        <a href="https://cabinet.smartpos.uz/"*/}
                                    {/*           className="def-btn">Авторизация</a>*/}
                                    {/*    </div>*/}
                                    {/*</li>*/}
                                </ul>
                            </div>
                        </nav>

                    </div>
                </div>
            </div>
        </div>
    );
};
export default Header;
