import React from 'react';
import './Footer.css'

function Footer() {
  return (
    <footer>
      <div className="footer-container">
        <p>&copy; {new Date().getFullYear()} Paint Shop. All rights reserved.</p>
        <ul>
          <li><a href="/about">About Us</a></li>
          <li><a href="/contact">Contact</a></li>
          <li><a href="/privacy-policy">Privacy Policy</a></li>
        </ul>
      </div>
    </footer>
  );
}

export default Footer;
