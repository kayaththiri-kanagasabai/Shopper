import React, { createContext, useEffect, useState } from 'react'


export const ShopContext= createContext(null);

//set in the cart to every product as 0 index as default
const getDefaultCart=()=>{
  let cart ={};
  for(let index=0; index < 300+1; index++)
  {
    cart[index]=0;
  }
  return cart;
 }

const ShopContextProvider = (props) =>{

  const [all_product,setAll_Product] = useState([]);
  const [cartItems,setCartItems]=useState(getDefaultCart());

  useEffect(()=>{
      fetch('http://localhost:3001/allproducts')
      .then((response)=>response.json())
      .then ((data)=>setAll_Product(data))

      if(localStorage.getItem('auth-token')){
        fetch('http://localhost:3001/getcart',
          {
            method:'POST',
            headers:
            {
              Accept:'application/form-data',
              'auth-token':`${localStorage.getItem('auth-token')}`,
              'Content-Type':'application/json',
            },
            body:"",
          }
        ).then((response)=>response.json())
         .then((data)=>setCartItems(data));
      }
  },[])

// when click the ADD TO CART button this function will be add one product in the cart
  const addToCart=(itemId)=>{
    setCartItems((prev)=>({...prev,[itemId]:prev[itemId]+1}));
    if(localStorage.getItem('auth-token')){
      fetch('http:/localhost:3001/addtocart',{
        method:'POST',
        headers:{
          Accept:'application/form-data',
          'auth-token':`${localStorage.getItem('auth-token')}`,
          'Content-Type':'application/json',

        },
        body:JSON.stringify({"ItemId":itemId}),
      })
      .then((response)=>response.json())
      .then((data)=>console.log(data));
    }
  }
  
      
// when click the REMOVE FROM CART button this function will be remove that product from the cart
  const removeFromCart=(itemId)=>{
    setCartItems((prev)=>({...prev,[itemId]:prev[itemId]-1}));

    if(localStorage.getItem('auth-token'))
    {
      fetch('http:/localhost:3001/removefromcart',{
        method:'POST',
        headers:{
          Accept:'application/form-data',
          'auth-token':`${localStorage.getItem('auth-token')}`,
          'Content-Type':'application/json',

        },
        body:JSON.stringify({"ItemId":itemId}),
      })
      .then((response)=>response.json())
      .then((data)=>console.log(data));
    }
  }

const getTotalCartAmount = () => {
  let totalAmount = 0;
  for (const item in cartItems)
  {
    if(cartItems[item]>0)
    {
      let itemInfo = all_product.find((product)=>product.id===Number(item))
      totalAmount += itemInfo.new_price * cartItems[item]; 

      
    }
    
    
    
  }
  return totalAmount;
}

const getTotalCartItems = () =>{
  let totalItem = 0;
  for (const item in cartItems)
  {
    if(cartItems[item]>0)
    {
      totalItem +=cartItems[item];
    }
  }
  return totalItem;
}



 // call addToCart,removeFromCart functions
  const contextValue={getTotalCartItems,getTotalCartAmount,all_product,cartItems,addToCart,removeFromCart};
  return(
    <ShopContext.Provider value={contextValue}>
        {props.children}
    </ShopContext.Provider>
  )
}
export default ShopContextProvider;