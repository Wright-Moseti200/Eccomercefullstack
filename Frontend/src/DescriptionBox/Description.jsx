import React from 'react'
import "./Description.css";

const DescriptionBox = () => {
  return (
    <div className='descriptionbox'>
      <div className='descriptionbox-navigator'>
        <div className='descriptionbox-nav-box'>Description</div>
        <div className='descriptionbox-nav-Reviews'>Reviews(122)</div>
      </div>
      <div className='desciptionbox-description'>
        <p>
        An e-commerce site (electronic commerce website) is an
        online platform that facilitates buying and selling of products
        or services over the internet.
        It serves as a virtual marketplace where 
        businesses and individuals can showcase their offerings
        to potential customers worldwide.
        </p>
        <p>
        E-commerce sites range from small specialized
        boutiques to massive marketplaces like Amazon or Alibaba,
        and they can operate on various business models
        including B2C (business-to-consumer), B2B
        (business-to-business), C2C (consumer-to-consumer), 
        or subscription-based services.
        </p>
      </div>
    </div>
  )
}

export default DescriptionBox;
