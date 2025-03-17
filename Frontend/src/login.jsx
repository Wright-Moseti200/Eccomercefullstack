/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import "./index.css";

const Login = () => {
  let [values, setValue] = useState(true);
  let [formData, setFormData] = useState({
    name: "",
    email: "",
    password: ""
  });


   
  const changeHandler = (e) => {
    setFormData((formedData)=>
      {
       let data = {...formedData};
       data[e.target.name]=e.target.value;
       return data;
      });
  };

  const login = async () => {
    console.log("Login Function Executed", formData);
    try {
      const response = await fetch('https://eccomercebackend-u1ce.onrender.com/login', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      const responseData = await response.json();
      
      if (responseData.success) {
        localStorage.setItem('auth-token', responseData.token);
        window.location.replace("/");
      } else {
        alert(responseData.message || "Login failed");
      }
    } catch (error) {
      console.error("Login error:", error);
      alert("An error occurred during login. Please try again.");
    }
  };

  const signup = async () => {
    console.log("Signup Function Executed", formData);
    try {
      const response = await fetch('http://localhost:4000/signup', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      const responseData = await response.json();
      
      if (responseData.success) {
        localStorage.setItem('auth-token', responseData.token);
        window.location.replace("/");
      } else {
        alert(responseData.message || "Signup failed");
      }
    } catch (error) {
      console.error("Signup error:", error);
      alert("An error occurred during signup. Please try again.");
    }
  };
  

  if (values === true) {
    return (
      <>
        <div className="flex flex-col justify-center items-center login">
          <div className="bg-white h-135 w-130 flex flex-col items-center justify-center">
            <div>
              <h1 className="text-3xl font-bold">Login</h1>
              <br />
              <input
                type="email"
                className="h-10 w-107 border-2 border-gray-300 outline-none login-input"
                placeholder="Email address"
                value={formData.email}
                onChange={changeHandler}
                name="email"
              />
              <br />
              <br />
              <input
                type="password"
                className="h-10 w-107 outline-none border-2 border-gray-300 login-input"
                placeholder="Password"
                name="password"
                value={formData.password}
                onChange={changeHandler}
              />
              <br />
              <br />
              <button onClick={login} className="w-107 bg-orange-500 text-white h-13 cursor-pointer">
                Continue
              </button>
              <br />
              <br />
              <p>
                Create an account?
                <span
                  className="text-orange-500 cursor-pointer"
                  onClick={() => {
                    setValue(false);
                  }}
                >
                  Click here
                </span>
              </p>
              <br />
              <p>
                <input type="checkbox" /> By continuing, I agree to the
                terms of use & privacy policy
              </p>
            </div>
          </div>
        </div>
      </>
    );
  } else {
    return (
      <>
        <div className="flex flex-col justify-center items-center login">
          <div className="bg-white h-135 w-130 flex flex-col items-center justify-center">
            <div>
              <h1 className="text-3xl font-bold">Signup</h1>
              <br/>
              <input
                type="text"
                className="h-10 w-107 outline-none border-2 border-gray-300 login-input"
                placeholder="Your name"
                name="name"
                onChange={changeHandler}
                value={formData.name}
              />
              <br />           
              <br />
              <input
                type="email"
                className="h-10 w-107 border-2 border-gray-300 outline-none login-input"
                placeholder="Email address"
                value={formData.email}
                onChange={changeHandler}
                name="email"
              />
              <br />
              <br />
              <input
                type="password"
                className="h-10 w-107 outline-none border-2 border-gray-300 login-input"
                placeholder="Password"
                name="password"
                onChange={changeHandler}
                value={formData.password}
              />
              <br />
              <br />
              <button onClick={signup} className="w-107 bg-orange-500 text-white h-13 cursor-pointer">
                Continue
              </button>
              <br />
              <br />
              <p>
                Already have an account?
                <span
                  className="text-orange-500 cursor-pointer"
                  onClick={() => {
                    setValue(true);
                  }}
                >
                  Login here
                </span>
              </p>
              <br />
              <p>
                <input type="checkbox" /> By continuing, I agree to the terms of
                use & privacy policy
              </p>
            </div>
          </div>
        </div>
      </>
    );
  }
};
 
export default Login;