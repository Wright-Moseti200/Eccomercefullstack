/* eslint-disable no-unused-vars */
import React,{useState,useContext, useEffect} from "react";
import "./index.css";
import heropng from "./Assets/hero_image.png";
import handpng from "./Assets/hand_icon.png";
import arrowpng from "./Assets/arrow.png";
import exclusiveimage from "./Assets/exclusive_image.png";
import logobig from "./Assets/logo_big.png";
import whatsapp from "./Assets/whatsapp_icon.png";
import instargram from "./Assets/instagram_icon.png";
import pinterest from "./Assets/pintester_icon.png";
import data_product from "./Assets/data";
import { Link } from "react-router-dom";
const Home = () =>
{

  const [new_collection,setNew_collection]=useState([]);

   useEffect(()=>{
    fetch('https://eccomercebackend-u1ce.onrender.com/newcollections')
    .then((response)=>response.json())
    .then((data)=>setNew_collection(data));
   },[]);

   const [popularProducts,setPopularProducts]=useState([]);

   useEffect(()=>{
    fetch('https://eccomercebackend-u1ce.onrender.com/popularinwomen')
    .then((response)=>response.json())
    .then((data)=>setPopularProducts(data));
   },[]);

    let [value1, setValue] = useState("");
    return (
      <div>
        <div
          className="flex flex-row w-full hero justify-around align-items"
          style={{ height: "650px" }}
        >
          <div className="flex flex-col justify-center h-full">
            <p className="font-bold text-lg">NEW ARRIVALS ONLY</p>
            <br />
            <h1 className="font-bold text-7xl" style={{ width: "450px" }}>
              new{" "}
              <img src={handpng} alt="handpng" className="h-20 w-20 inline" />{" "}
              collections for everyone
            </h1>
            <br />
            <br />
            <button className="text-white bg-orange-500 w-76 h-12 rounded-full">
              Latest Collection{" "}
              <img src={arrowpng} alt="arrowpng" className="inline" />
            </button>
          </div>
          <div className="flex justify-center items-center h-full">
            <img src={heropng} alt="heropng" className="h-full" />
          </div>
        </div>
        <br />
        <br />
        <div>
          <h1 className="text-4xl font-bold underline text-center">
            POPULAR IN WOMEN
          </h1>
          <br />
          <br />
          <div className="w-full flex flex-row items-center justify-center">
            <div className="w-full flex flex-row items-center justify-center gap-6">
             {
              popularProducts.map((element,index)=>{
                return <div className="card" key={index}>
               <Link to={`/product/${element.id}`}><img src={element.image} alt="product1" className="w-74" /></Link>
                <p className="w-75">
                  {element.name} 
                </p>
                <div className="flex gap-4">
                  <h1 className="font-bold">${element.new_price}</h1>
                  <h1 className="text-gray-400 line-through">${element.old_price}</h1>
                </div>
              </div>
              })
             }
            </div>
          </div>
          <br />
          <br />
          <div
            className="w-full flex flex-col justify-center items-center"
            style={{ height: "550px" }}
          >
            <div
              className="flex justify-center items-center gap-32 hero2"
              style={{ width: "1000px" }}
            >
              <div className="flex flex-col justify-center items-center">
                <h1 className="text-6xl font-bold w-110 text-center">
                  Exclusive Offers For You
                </h1>
                <br />
                <p className="text-md font-bold">
                  ONLY ON BEST SELLRS PRODUCTS
                </p>
                <br />
                <button className="bg-orange-500 text-white rounded-full w-50 h-12">
                  Check now
                </button>
              </div>
              <div>
                <img
                  src={exclusiveimage}
                  alt="exclusiveimage"
                  className="h-88"
                />
              </div>
            </div>
          </div>
          <br />
          <br />
          <div className="flex flex-col justify-center items-center w-full">
            <div>
              <h1 className="text-4xl font-bold underline text-center">
                BEST COLLECTION
              </h1>
              <br />
              <br />
              <div className="grid grid-cols-4 gap-6">
                {
                  new_collection.map((element,index)=>
                    {
                      return <div className="card" key={index}>
                      <Link to={`/product/${element.id}`}><img src={element.image} alt="product1" className="w-74" /></Link>                      <p className="w-75">
                        {element.name}
                      </p>
                      <div className="flex gap-4">
                        <h1 className="font-bold">${element.new_price}</h1>
                        <h1 className="text-gray-400 line-through">${element.old_price}</h1>
                      </div>
                    </div>
                    })
                }
              </div>
            </div>
          </div>
          <br />
          <br />
                <br />
          <div className="flex flex-col justify-center items-center">
            <div className="flex flex-col justify-center items-center hero2 w-250 h-70">
              <h1 className="text-5xl font-bold">
                Get Exclusive Offers On Your Email
              </h1>
              <br />
              <p>Subscribe to our newsletter and stay updated</p>
              <br />
              <br />
              <div className="flex">
                <input
                  value={value1}
                  onInput={(e) => {
                    setValue(e.target.value);
                  }}
                                className="border-2 h-14 w-130 rounded-full text-md border-gray-400"
                                style={{ paddingLeft: "15px" }}
                  placeholder="Your email id"
                  type="email"
                />
                <button className="bg-black text-white rounded-full h-14 w-35 relative right-15">
                  Subscribe
                </button>
              </div>
            </div>
                </div>
                <br />
                <br />
                <br />
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
      </div>
    );
}
 
export default Home;

