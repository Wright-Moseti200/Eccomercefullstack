import React,{useContext} from 'react'
import "./index.css";
import { ShopContext } from './shopcontext';
import { useParams } from 'react-router-dom';
import Breadcrumb from './BreadCrumb/Breadcrumb';
import ProductDisplay from './ProductDisplay/ProductDisplay';
import logobig from "./Assets/logo_big.png";
import whatsapp from "./Assets/whatsapp_icon.png";
import instargram from "./Assets/instagram_icon.png";
import pinterest from "./Assets/pintester_icon.png";
import DescriptionBox from './DescriptionBox/Description';
import Relatedproducts from './RelatedProducts/Relatedproducts';
const Product = () => {
const {all_product} = useContext(ShopContext);
const {productId}=useParams();
const product = all_product.find((e)=>e.id === Number(productId));
  return (
    <div>
      <Breadcrumb product={product}/> 
      <ProductDisplay product={product}/>
      <DescriptionBox/>
      <Relatedproducts product={product}/>
      <br/>
      <br/>
      <div className="w-full flex flex-col justify-center items-center" style={{height:"300px"}}>
                    <div className="flex flex-col justify-evenly items-center h-full">
                        <div className="flex flex-row justify-center items-center gap-10">
                            <img src={logobig} alt="logobig" />
                            <h1 className="text-4xl font-bold">SHOPPER</h1>
              </div>
              <br />
              <div className="flex flex-row justify-around items-center w-120">
                <p>Company</p>
                <p>Products</p>
                <p>Offices</p>
                <p>About</p>
                <p>Contact</p>
              </div>
              <br />
              <div className="flex justify-around items-center w-50">
                <img src={instargram} alt="instargram"/>
                <img src={pinterest} alt="pinterest" />
                <img src={whatsapp}  alt="whatsapp"/>
              </div>
                    </div>
                </div>
    </div>
  );  
}

export default Product;