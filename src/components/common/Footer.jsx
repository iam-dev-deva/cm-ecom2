import React from 'react';
import { useLocation } from 'react-router-dom';
import {
  FacebookOutlined,
  YoutubeOutlined,
  InstagramOutlined,
  TwitterOutlined,
  EnvironmentOutlined,
  PhoneOutlined,
  MailOutlined
} from '@ant-design/icons';
import * as Route from '@/constants/routes';

const Footer = () => {
  const { pathname } = useLocation();

  const visibleOnlyPath = [
    Route.HOME,
    Route.SHOP
  ];

  if (!visibleOnlyPath.includes(pathname)) return null;

  const currentYear = new Date().getFullYear();

  const footerLinks = {
    popular: [
      { label: 'About Us', href: '#' },
      { label: 'Blog', href: '#' },
      { label: 'Privacy Policy', href: '#' },
      { label: 'Help & Center', href: '#' },
      { label: 'Our Value', href: '#' }
    ],
    consumers: [
      { label: 'Payments', href: '#' },
      { label: 'Shipping', href: '#' },
      { label: 'Product & Returns', href: '#' },
      { label: 'Privacy Policy', href: '#' },
      { label: 'Terms & Condition', href: '#' },
      { label: 'Refund & Policy', href: '#' }
    ],
    categories: [
      { label: 'TOOLS', href: '#' },
      { label: 'SWITCHES', href: '#' },
      { label: 'ELECTRICAL ESSENTIALS', href: '#' },
      { label: 'FOR PROFESSIONALS', href: '#' },
      { label: 'WORK GEARS', href: '#' }
    ]
  };

  const socialLinks = [
    { icon: FacebookOutlined, href: '#', label: 'Facebook' },
    { icon: YoutubeOutlined, href: '#', label: 'YouTube' },
    { icon: InstagramOutlined, href: '#', label: 'Instagram' },
    { icon: TwitterOutlined, href: '#', label: 'Twitter' }
  ];

  const bottomLinks = [
    { label: 'Blogs', href: '#' },
    { label: 'About Us', href: '#' },
    { label: 'Privacy policy', href: '#' },
    { label: 'Terms and conditions', href: '#' },
    { label: 'Refund policy', href: '#' }
  ];

  return (
    <footer className="footer">
      <div className="footer-main">
        <div className="footer-section">
          <h3 className="footer-section-title">Get In Touch</h3>
          <div className="footer-contact">
            <p>
              <EnvironmentOutlined className="footer-icon" />
              7, Chromepet, Chennai, Tamil Nadu 600096
            </p>
            <p>
              <PhoneOutlined className="footer-icon" />
              +91 1234567890
            </p>
            <p>
              <MailOutlined className="footer-icon" />
              <a href="mailto:info@circlrmark.com">info@circlrmark.com</a>
            </p>
          </div>
          <div className="footer-social">
            {socialLinks.map((social) => {
              const IconComponent = social.icon;
              return (
                <a
                  key={social.label}
                  href={social.href}
                  className="footer-social-link"
                  aria-label={social.label}
                >
                  <IconComponent />
                </a>
              );
            })}
          </div>
        </div>

        {/* <div className="footer-section">
          <h3 className="footer-section-title">Popular Link</h3>
          <ul className="footer-links">
            {footerLinks.popular.map((link) => (
              <li key={link.label}>
                <a href={link.href}>{link.label}</a>
              </li>
            ))}
          </ul>
        </div> */}


        <div className="footer-section">
          <h3 className="footer-section-title">Categories</h3>
          <ul className="footer-links">
            {footerLinks.categories.map((link) => (
              <li key={link.label}>
                <a href={link.href}>{link.label}</a>
              </li>
            ))}
          </ul>
          <p className="footer-more">and many more..</p>
        </div>
        
        <div className="footer-section">
          <h3 className="footer-section-title">For Consumers</h3>
          <ul className="footer-links">
            {footerLinks.consumers.map((link) => (
              <li key={link.label}>
                <a href={link.href}>{link.label}</a>
              </li>
            ))}
          </ul>
        </div>
      </div>
{/* 
      <div className="footer-payment">
        <p className="footer-payment-label">Payment Partners</p>
        <div className="footer-payment-methods">
          <div className="payment-method">
            <img src="https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg" alt="Amazon Pay" />
          </div>
          <div className="payment-method">
            <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/American_Express_logo.svg" alt="American Express" />
          </div>
          <div className="payment-method">
            <img src="https://upload.wikimedia.org/wikipedia/commons/a/a4/Mastercard_2019_logo.svg" alt="Mastercard" />
          </div>
          <div className="payment-method">
            <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" alt="PayPal" />
          </div>
        </div>
      </div> */}

      <div className="footer-bottom">
        <p className="footer-copyright">© {currentYear}  CircleMark. Inc. ALL RIGHT RESERVED</p>
        <div className="footer-bottom-links">
          {bottomLinks.map((link) => (
            <a key={link.label} href={link.href}>{link.label}</a>
          ))}
        </div>
      </div>
    </footer>
  );
};

export default Footer;

