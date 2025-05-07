import React, { useContext, useRef, useState } from 'react'
import './Navbar.css'
import logo from '../Assets/logo_big.png'
import cart_icon from '../Assets/cart_icon.png'
import { Link } from 'react-router-dom'
import { ShopContext } from '../../Context/ShopContext'
import drop_down from '../Assets/nav_dropdown.png'

const Navbar = () => {
   
    // To nav bar hr line movement(move to the next page)
    const[menu,setMenu]=useState("shop");
    const{getTotalCartItems}=useContext(ShopContext);
    const menuRef = useRef();

    const dropdown_toggle =(e)=>{
            menuRef.current.classList.toggle('nav-menu-visible');
            e.target.classList.toggle('open')
    }


  return (
    <div className='navbar'>
        <div className="nav-logo">
            <img src={logo} alt="" />
            <p>SHOPPER</p>
        </div>
        <img onClick={dropdown_toggle} src={drop_down} alt="" className='nav-dropdown' />
        <ul ref={menuRef} className="nav-menu">
            <li onClick={()=>{setMenu("shop")}}><Link style={{textDecoration:"none"}} to='/'>Shop</Link>  {menu==="shop"? <hr/> :<></>}</li>
            <li onClick={()=>{setMenu("men")}}> <Link style={{textDecoration:"none"}} to='/men'> Men </Link>   {menu==="men"? <hr/> :<></>}</li>
            <li onClick={()=>{setMenu("women")}}> <Link style={{textDecoration:"none"}} to='/women'> Women </Link>   {menu==="women"? <hr/> :<></>}</li>
            <li onClick={()=>{setMenu("kids")}}> <Link style={{textDecoration:"none"}} to='/kids'> Kids </Link>   {menu=== "kid"? <hr/> :<></>} </li>
        </ul>
 <div className="nav-login-cart">
   <Link to="/login"> <button>Login</button></Link>
    <Link to="/cart"><img src={cart_icon} alt="" /></Link>
    <div className="nav-cart-count">{getTotalCartItems()}</div>
 </div>
    </div>
  )
}

export default Navbar