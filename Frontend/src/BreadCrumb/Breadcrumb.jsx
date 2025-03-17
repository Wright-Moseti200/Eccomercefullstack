import React from 'react';
import "./breadcrum.css";
import arrow_icon from "../Assets/arrow.png";

export default function Breadcrumb(props) {
    const {product} = props;
    
    return (
        <div className='breadcrumb'>
            <div className='breadcrumb-item'>HOME</div>
            <img src={arrow_icon} alt="arrow" className='breadcrumb-arrow'/>
            <div className='breadcrumb-item'>SHOP</div>
            <img src={arrow_icon} alt="arrow" className='breadcrumb-arrow'/>
            <div className='breadcrumb-item'>{product.category.toUpperCase()}</div>
            <img src={arrow_icon} alt="arrow" className='breadcrumb-arrow'/>
            <div className='breadcrumb-item active'>{product.name}</div>
        </div>
    );
}
