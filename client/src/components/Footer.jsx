import React from 'react';
import { MdLocalPhone, MdMail, MdLocationPin } from "react-icons/md";
// import { MdLocationPin } from "react-icons/md";


const Footer = () => {
    return (
        <footer className="footer text-white relative">

            <div
                className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                style={{ backgroundImage: 'url(https://www.paneltechllc.com/wp-content/themes/paneltec/images/footer-bg-dots.png)' }}
            ></div>

            {/* Footer Contact Area */}
            <div className="footer-contact-area py-10">
                <div className="container mx-auto px-4">
                    <div className="footer-contact flex justify-center">
                        <div className="footer-contact flex justify-center">
                            <div className="flex px-3 py-10 flex-wrap md:w-[80vw] rounded-lg bg-[#F0313D] absolute -top-19">
                                {/* Contact Information Block */}
                                <div className="w-full md:w-1/3 px-4 mb-8">
                                    <div className="footer-contact-block flex items-center">
                                        <span className="footer-contact-icon mr-4 w-[80px] h-[80px] rounded-full bg-white flex justify-center items-center">
                                            <MdLocalPhone className="text-blue-950 w-10 h-10" />
                                        </span>
                                        <div>
                                            <a href="tel:+96897649430" className="block">+968 97649430</a>
                                            <a href="tel:+96826881135" className="block">+968 26881135</a>
                                            <a href="tel:+96826881136" className="block">+968 26881136</a>
                                        </div>
                                    </div>
                                </div>

                                {/* Address Information Block */}
                                <div className="w-full md:w-1/3 px-4 mb-8">
                                    <div className="footer-contact-block flex items-center">
                                        <span className="footer-contact-icon mr-4 w-[80px] h-[80px] rounded-full bg-white flex justify-center items-center">
                                            <MdLocationPin className="text-blue-950 w-10 h-10" />
                                        </span>
                                        <p>
                                            Panel Tech International LLC <br />
                                            P.O. Box 391, PC 320, Barka <br />
                                            Sultanate of Oman
                                        </p>
                                    </div>
                                </div>

                                {/* Email Information Block */}
                                <div className="w-full md:w-1/3 px-4 mb-8">
                                    <div className="footer-contact-block flex items-center">
                                        <span className="footer-contact-icon mr-4 w-[80px] h-[80px] rounded-full bg-white flex justify-center items-center">
                                            <MdMail className="text-blue-950 w-10 h-10" />
                                        </span>
                                        <p>
                                            <a href="mailto:atiqansari@paneltechllc.com" className="block">atiqansari@paneltechllc.com</a>
                                            <a href="mailto:sales@paneltechllc.com" className="block">sales@paneltechllc.com</a>
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>

            {/* Footer Inner */}
            <div className="footer-inner bg-gray-900 py-20">
                {/* Footer Widgets Area */}
                <div className="footer-widgets-area container mx-auto px-4">
                    <div className="flex flex-nowrap -mx-4">
                        <div className="w-full lg:w-1/4 px-4 mb-8">
                            <div className="single-widget widget-info">
                                <div className="logo mb-4">
                                    <a href="#">
                                        <img src="https://www.paneltechllc.com/wp-content/themes/paneltec/images/logo2.png" alt="footer logo" className="w-48" />
                                    </a>
                                </div>
                                <p className="mb-4">
                                    Panel Tech International LLC established in 2009, is considered as one of the leading manufacturers of PIR, PU & Rockwool Sandwich Panels, Profile Sheet & Z Purlins throughout the Sultanate of Oman.
                                    <a href="https://www.paneltechllc.com/introduction/" className="text-red-600">Read More</a>
                                </p>
                                <ul className="flex space-x-4">
                                    <li><a href="https://www.facebook.com/Panel-Tech-International-LLC-798813166913297/" target="_blank" rel="noopener noreferrer"><i className="fa fa-facebook text-xl"></i></a></li>
                                    <li><a href="#" target="_blank" rel="noopener noreferrer"><i className="fa fa-twitter text-xl"></i></a></li>
                                </ul>
                            </div>
                        </div>
                        <div className="w-full lg:w-1/4 px-4 mb-8">
                            <div className="single-widget widget-links">
                                {/* <h4 className="widget-title text-lg font-bold mb-4">Quick Links</h4> */}
                                <ul className="space-y-2">
                                    <li><a href="https://www.paneltechllc.com/introduction/">Introduction</a></li>
                                    <li><a href="https://www.paneltechllc.com/about/our-factory/">Our Factory</a></li>
                                    <li><a href="https://www.paneltechllc.com/construction/">Construction</a></li>
                                    <li><a href="https://www.paneltechllc.com/about/quality-standards/">Quality Standards</a></li>
                                    <li><a href="https://www.paneltechllc.com/products/sandwich-panel/">Products</a></li>
                                </ul>
                            </div>
                        </div>
                        <div className="w-full lg:w-1/4 px-4 mb-8">
                            <div className="single-widget widget-links">
                                {/* <h4 className="widget-title text-lg font-bold mb-4">Products</h4> */}
                                <ul className="space-y-2">
                                    <li><a href="https://www.paneltechllc.com/sandwich-panel/">Sandwich Panel</a></li>
                                    <li><a href="https://www.paneltechllc.com/corrugated-profile-sheets/">Corrugated Profile Sheets</a></li>
                                    <li><a href="https://www.paneltechllc.com/metal-decking-sheet/">Metal Decking Sheet</a></li>
                                    <li><a href="https://www.paneltechllc.com/products/z-c-purlins/">Z & C Purlins</a></li>
                                    <li><a href="https://www.paneltechllc.com/translucent-sheet/">Translucent Sheet</a></li>
                                </ul>
                            </div>
                        </div>
                        <div className="w-full lg:w-1/4 px-4 mb-8">
                            <div className="single-widget widget-links">
                                <ul className="space-y-2">
                                    <li><a href="https://www.paneltechllc.com/sandwich-panel/">Handling & Installation</a></li>
                                    <li><a href="https://www.paneltechllc.com/corrugated-profile-sheets/">Project</a></li>
                                    <li><a href="https://www.paneltechllc.com/metal-decking-sheet/">Certification</a></li>
                                    <li><a href="https://www.paneltechllc.com/products/z-c-purlins/">Contact Us</a></li>
                                </ul>
                            </div>
                        </div>
                        <div className="w-full lg:w-1/4 px-4 mb-8">
                            <div className="single-widget widget-newsletter">
                                <div>
                                    <p>
                                        Panel Tech International LLC <br />
                                        P.O.box 391, PC 320, Barka <br />
                                        Sultanate of Oman
                                    </p>

                                    <div className="phone flex space-x-2 items-center">
                                        <span>
                                            <MdLocalPhone className='text-white' />
                                        </span>
                                        <span>+968 97649430</span>
                                    </div>

                                    <div className="phone flex space-x-2 items-center">
                                        <span>
                                            <MdLocalPhone className='text-white' />
                                        </span>
                                        <span>+968 26881135</span>
                                    </div>

                                    <div className="mail flex space-x-2 items-center">
                                        <span>
                                            <MdMail className='text-white' />
                                        </span>
                                        <span>atiqansari@paneltechllc.com</span>
                                    </div>

                                    <div className="mail flex space-x-2 items-center">
                                        <span>
                                            <MdMail className='text-white' />
                                        </span>
                                        <span>sales@paneltechllc.com</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer Copyright Area */}
                <div className="footer-copyright-area border-t border-gray-700 py-6">
                    <div className="container mx-auto px-4">
                        <div className="flex flex-wrap items-center justify-between">
                            <div className="w-full lg:w-auto mb-4 lg:mb-0">
                                <p className="copyright-text">
                                    Copyright 2018 © <a href="#" className="text-red-600">
                                        Paneltech</a>, All Rights Reserved
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;