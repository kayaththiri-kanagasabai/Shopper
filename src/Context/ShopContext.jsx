import React, { createContext, useState } from 'react'
import all_product from "../Components/Assets/all_product"

export const ShopContext= createContext(null);

//set in the cart to every product as 0 index as default
const getDefaultCart=()=>{
  let cart ={};
  for(let index=0; index < all_product.length+1; index++)
  {
    cart[index]=0;
  }
  return cart;
 }

const ShopContextProvider = (props) =>{

  const [cartItems,setCartItems]=useState(getDefaultCart());

// when click the ADD TO CART button this function will be add one product in the cart
  const addToCart=(itemId)=>{
    setCartItems((prev)=>({...prev,[itemId]:prev[itemId]+1}));
    
  }
  
      
// when click the REMOVE FROM CART button this function will be remove that product from the cart
  const removeFromCart=(itemId)=>{
    setCartItems((prev)=>({...prev,[itemId]:prev[itemId]-1}));
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