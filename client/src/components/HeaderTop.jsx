import { FaPhone, FaFacebook, FaTwitter } from "react-icons/fa";
import { MdLocalPhone } from "react-icons/md";

const HeaderTop = () => {
  return (
    <div className="bg-gray-900 text-white py-3 fixed left-0 z-999 top-0 w-screen overflow-x-hidden">
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap justify-between items-center">
          
          {/* Contact Information */}
          <div className="flex space-x-4">
            <div className="flex items-center space-x-2">
              <MdLocalPhone />
              <a href="tel:+96897649430" className="hover:text-gray-300">+968 97649430</a>
            </div>
            <div className="flex items-center space-x-2">
              <MdLocalPhone />
              <a href="tel:+96826881135" className="hover:text-gray-300">+968 26881135</a>
            </div>
          </div>

          {/* Social Media Links */}
          <div className="flex space-x-4">
            <a href="https://www.facebook.com/Panel-Tech-International-LLC-798813166913297/" target="_blank" rel="noopener noreferrer" className="hover:text-gray-300">
              <FaFacebook />
            </a>
            <a href="#" className="hover:text-gray-300">
              <FaTwitter />
            </a>
          </div>

          {/* Language Selection */}
          <div className="flex space-x-2">
            <a href="https://www.paneltechllc.com/en/" className="bg-red-600 px-3 py-1 text-sm font-semibold rounded">English</a>
            <a href="https://www.paneltechllc.com/ar/" className="bg-red-600 px-3 py-1 text-sm font-semibold rounded">العربية</a>
          </div>

        </div>
      </div>
    </div>
  );
};

export default HeaderTop;
