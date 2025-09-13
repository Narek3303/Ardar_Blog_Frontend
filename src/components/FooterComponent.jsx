import React from 'react';
import { FaGithub, FaLinkedin, FaTwitter, FaInstagram } from 'react-icons/fa';
import { MdEmail } from 'react-icons/md';
import '../styles/FooterComponent.css';

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="footer">
            <div className="footer__content">
                <div className="footer__brand">
                    <h2 className="footer__logo">YourBrand</h2>
                    <p className="footer__tagline">Building digital experiences that matter</p>
                </div>

                <div className="footer__sections">
                    <div className="footer__section">
                        <h3 className="footer__section-title">Quick Links</h3>
                        <ul className="footer__links">
                            <li><a href="/about">About Us</a></li>
                            <li><a href="/services">Services</a></li>
                            <li><a href="/portfolio">Portfolio</a></li>
                            <li><a href="/blog">Blog</a></li>
                        </ul>
                    </div>

                    <div className="footer__section">
                        <h3 className="footer__section-title">Contact</h3>
                        <ul className="footer__links">
                            <li><a href="mailto:contact@yourbrand.com"><MdEmail /> contact@yourbrand.com</a></li>
                            <li><a href="tel:+1234567890">+1 (234) 567-890</a></li>
                            <li>123 Street, City</li>
                            <li>Country, 10001</li>
                        </ul>
                    </div>

                    <div className="footer__section">
                        <h3 className="footer__section-title">Follow Us</h3>
                        <div className="footer__social">
                            <a href="https://github.com" aria-label="GitHub"><FaGithub /></a>
                            <a href="https://linkedin.com" aria-label="LinkedIn"><FaLinkedin /></a>
                            <a href="https://twitter.com" aria-label="Twitter"><FaTwitter /></a>
                            <a href="https://instagram.com" aria-label="Instagram"><FaInstagram /></a>
                        </div>

                    </div>
                </div>
            </div>

            <div className="footer__bottom">
                <div className="footer__copyright">
                    &copy; {currentYear} YourBrand. All rights reserved.
                </div>
                <div className="footer__legal">
                    <a href="/privacy">Privacy Policy</a>
                    <a href="/terms">Terms of Service</a>
                    <a href="/cookies">Cookie Policy</a>
                </div>
            </div>
        </footer>
    );
};

export default Footer;