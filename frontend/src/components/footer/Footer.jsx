import React from 'react';
import "./footer.css";

import { FaFacebook, FaInstagram, FaYoutube } from "react-icons/fa";
import { CiTwitter } from "react-icons/ci";

const Footer = () => {
  return (
    <footer className="site-footer">
      <div className="footer-component">
        <p>
          &copy; {new Date().getFullYear()} Your own learning Platform. All rights reserved. <br />
          Made with ❤️ <a href="#" onClick={(e) => e.preventDefault()}>Shivang Yadav</a>
        </p>
        <div className="social-links">
          <a href="#" onClick={(e) => e.preventDefault()}><FaFacebook /></a>
          <a href="#" onClick={(e) => e.preventDefault()}><FaInstagram /></a>
          <a href="#" onClick={(e) => e.preventDefault()}><CiTwitter /></a>
          <a href="#" onClick={(e) => e.preventDefault()}><FaYoutube /></a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;