import * as Route from '@/constants/routes';
import { IMAGES } from '@/constants/imageUrls';
import React from 'react';
import { useLocation } from 'react-router-dom';

const Footer = () => {
  const { pathname } = useLocation();

  const visibleOnlyPath = [
    Route.HOME,
    Route.SHOP
  ];

  return !visibleOnlyPath.includes(pathname) ? null : (
    <footer className="footer">
      <div className="footer-col-1">
        <strong>
          <span>
            Developed by
            {' '}
            <a href="#">CircleMark</a>
          </span>
        </strong>
      </div>
      <div className="footer-col-2">
        <h5>
          &copy;&nbsp;
          {new Date().getFullYear()}
        </h5>
      </div>
      <div className="footer-col-3">
        <strong>
          <span>
            Powered by ARUDRA
          </span>
        </strong>
      </div>
    </footer>
  );
};

export default Footer;
