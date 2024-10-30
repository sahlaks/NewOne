import React from 'react';
import { Link } from 'react-router-dom';

function Footer() {
  return (
    <footer className="bg-[#323232] text-[#FAF5E9] py-8 mt-auto">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h6 className="text-xl font-semibold mb-2">CalmNest</h6>
            <p className="text-sm">
              Nurturing a Calmer, Happier Family Life through expert counseling and educational resources.
            </p>
          </div>

          <div>
            <h6 className="text-xl font-semibold mb-2">Quick Links</h6>
            <ul className="list-none space-y-2">
              <li>
              <Link to="/" className="hover:underline hover:text-gray-400">Home</Link>
              </li>
              <li>
              <Link to="/about" className="hover:underline hover:text-gray-400">About Us</Link>
              </li>
              <li>
              <Link to="/services" className="hover:underline hover:text-gray-400">Services</Link>
              </li>
              <li>
              <Link to="/contact" className="hover:underline hover:text-gray-400">Contact Us</Link>
              </li>
            </ul>
          </div>

          <div>
            <h6 className="text-xl font-semibold mb-2">Contact Information</h6>
            <p className="text-sm">
              Email: <a href="mailto:info@calmnest.com" className="hover:underline hover:text-gray-400">info@calmnest.com</a>
            </p>
            <p className="text-sm">
              Phone: <a href="tel:+1234567890" className="hover:underline hover:text-gray-400">+1 234 567 890</a>
            </p>
            <p className="text-sm">
              Address: 123 Calm Street, Trithala, Palakkad, Kerala 679534
            </p>
          </div>
        </div>
        <p className="text-center text-sm mt-8">
          &copy; {new Date().getFullYear()} CalmNest. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

export default Footer;
