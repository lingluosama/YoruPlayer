"use client";

import React, { useState } from "react";
import { UserLogin } from "../components/http/userApi";
import { LoginForm } from "./LoginForm";
import { RegisterForm } from "./RegisterForm";
import 'mdui/mdui.css';
import '@mdui/icons/search.js';
import 'mdui';
import {useNotification} from "../components/NotificationProvider";

const Container = () => {
  const [state, setState] = useState({
    isLoggedIn: true,
    fade: true,
  });
  const toggleLoginState = () => {
    setState((prevState) => ({ ...prevState, fade: false }));
    setTimeout(() => {
      setState((prevState) => ({
        isLoggedIn: !prevState.isLoggedIn,
        fade: true,
      }));
    }, 500);
  };
  return (
    <div 
      className="min-h-screen flex items-center justify-center bg-cover"
      style={{ backgroundImage: `url("https://th.bing.com/th/id/R.54260e46f1a0b45e2965d41bf84e870b?rik=OHsRZKf5JZuJfQ&pid=ImgRaw&r=0")` }}
    >
      <div
          className={`min-h-screen min-w-full flex items-center relative  justify-center transition-opacity duration-500 ${state.fade ? "rotate-y-0 opacity-100" : "rotate-y-180 opacity-45 visibility-hidden"} transition-transform`}>

        
        {state.isLoggedIn ? (
            <LoginForm className={``} isLogin={state.isLoggedIn} change={toggleLoginState}/>
        ) : (
            <RegisterForm isLogin={state.isLoggedIn} change={toggleLoginState}/>
        )}
      </div>


    </div>
  );
};



export default Container;
