import React,{useState,useEffect} from 'react'
import "./ListProduct.css";
import cross_icon from '../../Assets/cross_icon.png';
const ListProduct = () => {
      
  const [allproduct,setAllProduct]=useState([]);

  const fetchInfo = async ()=>
    {
      await fetch('https://eccomercebackend-u1ce.onrender.com/allproducts')
      .then(response=>response.json())
      .then((data)=>{setAllProduct(data)});
    }
    
    useEffect(() => 
      {
        fetchInfo();
      },[]);

      const remove_product = async(id)=>
        {
          await fetch(`https://eccomercebackend-u1ce.onrender.com/removeproduct/`,{
            method:'DELETE',
            headers:{
              Accept:'application/json',
              'Content-Type':'application/json'
            },
            body:JSON.stringify({id:id})
          })
          await fetchInfo();
        }
  return (
    <div className='list-product'>
    <h1>All Products List</h1>
    <div className="listproduct-format-main">
      <p>Products</p>
      <p>Title</p>
      <p>Old Price</p>
      <p>New Price</p>
      <p>Category</p>
      <p>Remove</p>
    </div>
    <div className="listproduct-allproducts">
    {allproduct.map((product,index)=>
    {
      return <div key={index} className='listproduct-format-main listproduct-format'>
      <img src={product.image} alt='' className='listproduct-product-icon'/>
      <p>{product.name}</p>
      <p>${product.old_price}</p>
      <p>${product.new_price}</p>
      <p>{product.category}</p>
      <img onClick={()=>{remove_product(product.id)}} className='listproduct-remove-icon' src={cross_icon} alt=""/>
      </div>
    })
    }
    </div>
    </div>
  )
}

export default ListProduct
