import axios from "axios";


export const products = [
    {
        image: "https://www.paneltechllc.com/wp-content/themes/paneltec/images/pr1.png",
        name: "Sandwich Panel"
    },
    {
        image: "https://www.paneltechllc.com/wp-content/themes/paneltec/images/pr2.png",
        name: "Corrugated Profile Sheets"
    },
    {
        image: "https://www.paneltechllc.com/wp-content/themes/paneltec/images/pr3.png",
        name: "Metal Decking Sheet"
    },
    {
        image: "https://www.paneltechllc.com/wp-content/themes/paneltec/images/pr4.png",
        name: "Z & C Purlins"
    },
    {
        image: "https://www.paneltechllc.com/wp-content/themes/paneltec/images/pr5.png",
        name: "Translucent Sheet"
    },
    {
        image: "https://www.paneltechllc.com/wp-content/themes/paneltec/images/pr6.png",
        name: "Flashings"
    },
    {
        image: "https://www.paneltechllc.com/wp-content/themes/paneltec/images/pr7.png",
        name: "Roller Shutter Doors"
    },
    {
        image: "https://www.paneltechllc.com/wp-content/themes/paneltec/images/pr8.png",
        name: "Accessories"
    }
];

export const projectData = [
    {
        image: "https://www.paneltechllc.com/wp-content/themes/paneltec/images/blog-image-1.jpg",
        title: "City Center Sohar",
    },
    {
        image: "https://www.paneltechllc.com/wp-content/themes/paneltec/images/blog-image-2.jpg",
        title: "Head Office National Bank of Oman",
    },
    {
        image: "https://www.paneltechllc.com/wp-content/themes/paneltec/images/blog-image-3.jpg",
        title: "Ras Al Hamra Residential Project",
    },
    {
        image: "https://www.paneltechllc.com/wp-content/themes/paneltec/images/blog-image-4.jpg",
        title: "Staff Accommodation Airport Site",
    },
    {
        image: "https://www.paneltechllc.com/wp-content/themes/paneltec/images/blog-image-5.jpg",
        title: "Royal Oman Police",
    },
    {
        image: "https://www.paneltechllc.com/wp-content/themes/paneltec/images/blog-image-6.jpg",
        title: "Gulf International Contracting",
    },
];

export const urls = [
    { url: "https://www.paneltechllc.com/wp-content/uploads/2019/01/background-image-4.jpg" },
    {
        url: "https://www.paneltechllc.com/wp-content/uploads/2019/02/background-image-1.jpg",
        heading: "Products",
        title: "Sandwich Panel",
        description: "Panel Tech International LLC established in 2009, is considered as one of the leading manufacturers of ...",
        readMoreLink: "/products/sandwich-panel",
        contactUsLink: "/contact-us",
    },
    {
        url: "https://www.paneltechllc.com/wp-content/uploads/2019/01/background-image-2.png",
        heading: "Products",
        title: "Corrugated Profile Sheets",
        description: "Profiled steel or Aluminium sheets are used in various roof constructions. Profile Sheets can be produced from ...",
        readMoreLink: "/products/corrugated-profile-sheets",
        contactUsLink: "/contact-us",
    },
    {
        url: "https://www.paneltechllc.com/wp-content/uploads/2019/01/background-image-3.png",
        heading: "Products",
        title: "Z & C Purlins",
        description: "Panel Tech manufacturers a complete range of structural C and Z purlins and girts for industrial buildings ...",
        readMoreLink: "/products/z-c-purlins",
        contactUsLink: "/contact-us",
    },
    {
        url: "https://www.paneltechllc.com/wp-content/uploads/2019/02/background-image-5.jpg",
        heading: "Products",
        title: "Metal Decking Sheet",
        description: "Multideck Floor System High performance, profiled, galvanized, steel floor decking for use in the ...",
        readMoreLink: "/products/metal-decking-sheet",
        contactUsLink: "/contact-us",
    },
    {
        url: "https://www.paneltechllc.com/wp-content/uploads/2019/02/background-image-6.jpg",
        heading: "Products",
        title: "Translucent Sheet",
        description: "To let natural daylight into a sheeted building you can replace some of the metal sheet ...",
        readMoreLink: "/products/translucent-sheet",
        contactUsLink: "/contact-us",
    },
    {
        url: "https://www.paneltechllc.com/wp-content/uploads/2019/02/background-image-7.jpg",
        heading: "Products",
        title: "Flashings",
        description: "Panel Tech can fold a wide range of standard or custom flashings to suit your ...",
        readMoreLink: "/products/flashings",
        contactUsLink: "/contact-us",
    },
    {
        url: "https://www.paneltechllc.com/wp-content/uploads/2019/02/background-image-8.jpg",
        heading: "Products",
        title: "Roller Shutter Doors",
        description: "The shutter curtain is constructed from cold rolled galvanized concave steel laths ...",
        readMoreLink: "/products/roller-shutter-doors",
        contactUsLink: "/contact-us",
    },
    {
        url: "https://www.paneltechllc.com/wp-content/uploads/2019/02/background-image-9.jpg",
        heading: "Products",
        title: "Accessories",
        description: "Panel Tech International LLC established in 2009, is considered as one of the leading ...",
        readMoreLink: "/products/accessories",
        contactUsLink: "/contact-us",
    },
];

export const ApiClient = axios.create({
    baseURL: 'http://localhost:3000/api', // Base URL for your API
    timeout: 5000, // Optional: request timeout
    headers: {
        'Content-Type': 'application/json',
    },
});


