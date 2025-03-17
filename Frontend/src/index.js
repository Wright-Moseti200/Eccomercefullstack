import React from 'react';
import { createRoot } from 'react-dom/client';
import "./index.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from './navbar';
import Home from './home';
import Men from './men';
import Women from './women';
import Kids from './kids';
import Login from './login';
import Cart from './cart';
import ShopContentProvider from './shopcontext';
import Product from './product';

const App = () => {
  return (
    <ShopContentProvider>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Navbar />}>
            <Route index element={<Home />} />
            <Route path='/men' element={<Men category="men" />} />
            <Route path='/women' element={<Women category="women" />} />
            <Route path='/kids' element={<Kids category="kid" />} />
            <Route path="/product" element={<Product />}>
              <Route path=":productId" element={<Product/>}/>
            </Route>
            <Route path="login" element={<Login />} />
            <Route path="cart" element={<Cart />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ShopContentProvider>
  );
}

let body = document.querySelector("body");
let root = createRoot(body);
root.render(<App />);
