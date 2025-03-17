import React,{useContext} from 'react'
import "./Realatedproducts.css";
import { ShopContext } from '../shopcontext';
import { Link } from "react-router-dom";
const Relatedproducts = (props) => {
const {all_product} = useContext(ShopContext);
const {product} = props;
    return (
    <div>
    <h1 className="text-4xl font-bold underline text-center">
            RELATED PRODUCTS
          </h1>
          <br/>
          <br/>
      <div className="w-full flex flex-row items-center justify-center">
      <div className="grid grid-cols-4 gap-6 justify-center items-center">
      {
       all_product.map((element,index)=>
       {
        if(element.category===product.category)
        {
            return  <div className="card" key={index}>
                           <Link to={`/product/${element.id}`}><img onClick={window.scrollTo(0,0)} src={element.image} alt="product1" className="w-74" /></Link>
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
    </div>
  );
}

export default Relatedproducts
