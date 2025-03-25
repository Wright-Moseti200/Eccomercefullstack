import React from 'react';
import { createRoot } from 'react-dom/client';
import "./index.css";
import { BrowserRouter, Routes, Route ,Link} from "react-router-dom";
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

  const PaymentSuccess = () => {
    return (
        <div className="payment-success">
            <h1>Payment Successful!</h1>
            <p>Thank you for your purchase.</p>
            <Link to="/" className="continue-shopping">
                Continue Shopping
            </Link>
        </div>
    );
};

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
            <Route path="/payment-success" element={<PaymentSuccess />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ShopContentProvider>
  );
}

let body = document.querySelector("body");
let root = createRoot(body);
root.render(<App />);
