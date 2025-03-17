import React,{useContext} from "react";
import "./index.css";
import { ShopContext } from "./shopcontext";
import kidsbanner from "./Assets/banner_kids.png";
import logobig from "./Assets/logo_big.png";
import whatsapp from "./Assets/whatsapp_icon.png";
import instargram from "./Assets/instagram_icon.png";
import pinterest from "./Assets/pintester_icon.png";
import downimg from "./Assets/dropdown_icon.png";
import { Link } from "react-router-dom";

const Kids = (props) =>
{
        const { all_product } = useContext(ShopContext);
    return(
        <>
            <div className="flex flex-col justify-center items-center h-60">
                <img src={kidsbanner} alt="mensbanner" className="w-270 h-55" />
            </div>
            <br/>
            <br/>
            <div className="w-full flex flex-row justify-center items-center">
                <div className="flex flex-row justify-around items-center gap-150  w-full ">
                <div><p><span className="font-bold">Showing 1-12 </span> out of 54 Products</p></div>
                <div><button class="border-1 h-10 w-22 flex justify-around items-center rounded-full">Sort By <img src={downimg} className="h-2" alt="downpng"/></button></div>
                </div>
            </div>
            <br/>
            <br/>
            <div className="flex flex-col justify-center items-center">
            <div className="grid grid-cols-4 gap-6 justify-center items-center">
               {
                all_product.map((element,index)=>
                {
                    if(element.category===props.category)
                    {
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
                    }
                    else
                    {
                        return null;
                    }
                })
               }
            </div>
            </div>
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
        </>
)
}
 
export default Kids;