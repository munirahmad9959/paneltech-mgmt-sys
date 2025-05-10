import { MdLocalPhone, MdMail, MdLocationPin } from "react-icons/md";

const Footer = () => {
    return (
        <footer className="footer text-white relative">
            {/* Background pattern */}
            <div
                className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                style={{ backgroundImage: 'url(https://www.paneltechllc.com/wp-content/themes/paneltec/images/footer-bg-dots.png)' }}
            ></div>

            {/* Footer Contact Area */}
            <div className="footer-contact-area py-10">
                <div className="container mx-auto px-4">
                    <div className="flex justify-center">
                        <div className="flex flex-col md:flex-row p-4 md:p-6 w-full max-w-6xl mx-auto rounded-lg bg-[#F0313D] relative md:-bottom-20 -bottom-[5rem]">
                            {/* Contact Information Block */}
                            <div className="w-full md:w-1/3 px-2 md:px-4 mb-6 md:mb-0">
                                <div className="footer-contact-block flex flex-col sm:flex-row items-center sm:items-start gap-4">
                                    <span className="footer-contact-icon flex-shrink-0 bg-white rounded-full p-3 sm:p-4 flex justify-center items-center">
                                        <MdLocalPhone className="text-blue-950 text-2xl sm:text-3xl" />
                                    </span>
                                    <div className="text-center sm:text-left">
                                        <a href="tel:+96897649430" className="block text-sm sm:text-base">+968 97649430</a>
                                        <a href="tel:+96826881135" className="block text-sm sm:text-base">+968 26881135</a>
                                        <a href="tel:+96826881136" className="block text-sm sm:text-base">+968 26881136</a>
                                    </div>
                                </div>
                            </div>

                            {/* Address Information Block */}
                            <div className="w-full md:w-1/3 px-2 md:px-4 mb-6 md:mb-0">
                                <div className="footer-contact-block flex flex-col sm:flex-row items-center sm:items-start gap-4">
                                    <span className="footer-contact-icon flex-shrink-0 bg-white rounded-full p-3 sm:p-4 flex justify-center items-center">
                                        <MdLocationPin className="text-blue-950 text-2xl sm:text-3xl" />
                                    </span>
                                    <p className="text-center sm:text-left text-sm sm:text-base">
                                        Panel Tech International LLC <br />
                                        P.O. Box 391, PC 320, Barka <br />
                                        Sultanate of Oman
                                    </p>
                                </div>
                            </div>

                            {/* Email Information Block */}
                            <div className="w-full md:w-1/3 px-2 md:px-4">
                                <div className="footer-contact-block flex flex-col sm:flex-row items-center sm:items-start gap-4">
                                    <span className="footer-contact-icon flex-shrink-0 bg-white rounded-full p-3 sm:p-4 flex justify-center items-center">
                                        <MdMail className="text-blue-950 text-2xl sm:text-3xl" />
                                    </span>
                                    <div className="text-center sm:text-left">
                                        <a href="mailto:atiqansari@paneltechllc.com" className="block text-sm sm:text-base">atiqansari@paneltechllc.com</a>
                                        <a href="mailto:sales@paneltechllc.com" className="block text-sm sm:text-base">sales@paneltechllc.com</a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer Inner */}
            <div className="footer-inner bg-gray-900 pt-20 pb-10 md:py-20">
                {/* Footer Widgets Area */}
                <div className="footer-widgets-area container mx-auto px-4">
                    <div className="flex flex-wrap -mx-4">
                        {/* Company Info */}
                        <div className="w-full lg:w-1/4 px-4 mb-8">
                            <div className="single-widget widget-info">
                                <div className="logo mb-4">
                                    <a href="#">
                                        <img src="https://www.paneltechllc.com/wp-content/themes/paneltec/images/logo2.png" alt="footer logo" className="w-36 md:w-48" />
                                    </a>
                                </div>
                                <p className="mb-4 text-sm md:text-base">
                                    Panel Tech International LLC established in 2009, is considered as one of the leading manufacturers of PIR, PU & Rockwool Sandwich Panels, Profile Sheet & Z Purlins throughout the Sultanate of Oman.
                                    <a href="https://www.paneltechllc.com/introduction/" className="text-red-600 block mt-2">Read More</a>
                                </p>
                                <ul className="flex space-x-4">
                                    <li><a href="https://www.facebook.com/Panel-Tech-International-LLC-798813166913297/" target="_blank" rel="noopener noreferrer"><i className="fa fa-facebook text-xl"></i></a></li>
                                    <li><a href="#" target="_blank" rel="noopener noreferrer"><i className="fa fa-twitter text-xl"></i></a></li>
                                </ul>
                            </div>
                        </div>

                        {/* Quick Links */}
                        <div className="w-1/2 md:w-1/4 lg:w-1/4 px-4 mb-8">
                            <div className="single-widget widget-links">
                                <h4 className="widget-title text-lg font-bold mb-4">Quick Links</h4>
                                <ul className="space-y-2">
                                    <li><a className="text-sm md:text-base" href="https://www.paneltechllc.com/introduction/">Introduction</a></li>
                                    <li><a className="text-sm md:text-base" href="https://www.paneltechllc.com/about/our-factory/">Our Factory</a></li>
                                    <li><a className="text-sm md:text-base" href="https://www.paneltechllc.com/construction/">Construction</a></li>
                                    <li><a className="text-sm md:text-base" href="https://www.paneltechllc.com/about/quality-standards/">Quality Standards</a></li>
                                    <li><a className="text-sm md:text-base" href="https://www.paneltechllc.com/products/sandwich-panel/">Products</a></li>
                                </ul>
                            </div>
                        </div>

                        {/* Products */}
                        <div className="w-1/2 md:w-1/4 lg:w-1/4 px-4 mb-8">
                            <div className="single-widget widget-links">
                                <h4 className="widget-title text-lg font-bold mb-4">Products</h4>
                                <ul className="space-y-2">
                                    <li><a className="text-sm md:text-base" href="https://www.paneltechllc.com/sandwich-panel/">Sandwich Panel</a></li>
                                    <li><a className="text-sm md:text-base" href="https://www.paneltechllc.com/corrugated-profile-sheets/">Corrugated Profile Sheets</a></li>
                                    <li><a className="text-sm md:text-base" href="https://www.paneltechllc.com/metal-decking-sheet/">Metal Decking Sheet</a></li>
                                    <li><a className="text-sm md:text-base" href="https://www.paneltechllc.com/products/z-c-purlins/">Z & C Purlins</a></li>
                                    <li><a className="text-sm md:text-base" href="https://www.paneltechllc.com/translucent-sheet/">Translucent Sheet</a></li>
                                </ul>
                            </div>
                        </div>

                        {/* Contact Info */}
                        <div className="w-full md:w-full lg:w-1/4 px-4 mb-8">
                            <div className="single-widget widget-newsletter">
                                <h4 className="widget-title text-lg font-bold mb-4">Contact Info</h4>
                                <div className="space-y-3">
                                    <p className="text-sm md:text-base">
                                        Panel Tech International LLC <br />
                                        P.O.box 391, PC 320, Barka <br />
                                        Sultanate of Oman
                                    </p>

                                    <div className="phone flex space-x-2 items-center text-sm md:text-base">
                                        <span>
                                            <MdLocalPhone className='text-white' />
                                        </span>
                                        <span>+968 97649430</span>
                                    </div>

                                    <div className="phone flex space-x-2 items-center text-sm md:text-base">
                                        <span>
                                            <MdLocalPhone className='text-white' />
                                        </span>
                                        <span>+968 26881135</span>
                                    </div>

                                    <div className="mail flex space-x-2 items-center text-sm md:text-base">
                                        <span>
                                            <MdMail className='text-white' />
                                        </span>
                                        <span>atiqansari@paneltechllc.com</span>
                                    </div>

                                    <div className="mail flex space-x-2 items-center text-sm md:text-base">
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
                        <div className="flex flex-col md:flex-row items-center justify-between">
                            <div className="w-full md:w-auto mb-4 md:mb-0 text-center md:text-left">
                                <p className="copyright-text text-sm md:text-base">
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