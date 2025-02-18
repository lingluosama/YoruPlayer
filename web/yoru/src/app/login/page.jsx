"use client";

import React, { useState } from "react";
import { UserLogin } from "../components/http/userApi";
import { LoginForm } from "./LoginForm";
import { RegisterForm } from "./RegisterForm";
import 'mdui/mdui.css';
import '@mdui/icons/search.js';
import 'mdui';
import {useNotification} from "../components/providers/NotificationProvider";
import ThreeBackground from "../components/Three/ThreeBackground";
import {VideoBackground} from "./VideoBackground";
import {SvgMute} from "../assets/svg/Mute";
import {SvgVoice} from "../assets/svg/Voice";

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
  const [mute, setMute] = useState(true)
  return (
    <div 
      className="min-h-screen flex items-center justify-center "
      
       style={{ backgroundImage: `url("https://th.bing.com/th/id/R.54260e46f1a0b45e2965d41bf84e870b?rik=OHsRZKf5JZuJfQ&pid=ImgRaw&r=0")` }}
    >
      <div className={`absolute w-screen h-screen bg-transparent `}>
        <VideoBackground mute={mute}></VideoBackground>
      </div>
      <div
          className={`min-h-screen min-w-full flex items-center relative  bg-transparent justify-center transition-opacity duration-500 ${state.fade ? "rotate-y-0 opacity-100" : "rotate-y-180 opacity-45 visibility-hidden"} transition-transform`}>

        
        {state.isLoggedIn ? (
            <LoginForm className={``} isLogin={state.isLoggedIn} change={toggleLoginState}/>
        ) : (
            <RegisterForm isLogin={state.isLoggedIn} change={toggleLoginState}/>
        )}
      </div>
      {
        mute?<SvgMute 
                onClick={()=>setMute(false)}
                className={`absolute bottom-3 right-3 transition-all duration-300 cursor-pointer hover:scale-110`} w={`32`} h={`32`}></SvgMute>
        :<SvgVoice
                onClick={()=>setMute(true)}
                className={`absolute bottom-3 right-3 transition-all duration-300 cursor-pointer hover:scale-110`} w={`32`} h={`32`}></SvgVoice>
      }

    </div>
  );
};



export default Container;
