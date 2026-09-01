import React from 'react';
import {
  ClockCircleOutlined,
  GiftOutlined,
  SafetyOutlined,
  CustomerServiceOutlined
} from '@ant-design/icons';

const FeaturesSection = () => {
  const features = [
    {
      id: 1,
      icon: ClockCircleOutlined,
      title: 'Free Shipping',
      description: 'For all orders above Rs.500'
    },
    {
      id: 2,
      icon: GiftOutlined,
      title: 'Delivery on time',
      description: 'Assured with Safety'
    },
    {
      id: 3,
      icon: SafetyOutlined,
      title: 'Secure Payment',
      description: '100% Secure Payment'
    },
    {
      id: 4,
      icon: CustomerServiceOutlined,
      title: '24/7 Support',
      description: 'Dedicated Support'
    }
  ];

  return (
    <div className="features-section">
      <div className="features-container">
        {features.map((feature) => {
          const IconComponent = feature.icon;
          return (
            <div key={feature.id} className="feature-card">
              <div className="feature-icon">
                <IconComponent />
              </div>
              <div className="feature-content">
                <h3 className="feature-title">{feature.title}</h3>
                <p className="feature-description">{feature.description}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default FeaturesSection;
