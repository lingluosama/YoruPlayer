'use client';

import {createContext, useContext, useState} from "react";

const NotificationContext=createContext(undefined)

export const NotificationProvider=({children})=>{
    var [notification,setNotification] = useState(null);
    
    var [type,setType] = useState("info");
    const showNotification=(type,message)=>{
        setNotification(message)
        setType(type)
        setTimeout(()=>{setNotification(null),setType(null)},3000)
    }

    const typeStyles = {
        success: 'border-green-400',
        error: 'border-red-400',
        warning: 'border-yellow-400',
        info: ' border-blue-400'
    };
    
    
    return(
        <NotificationContext.Provider value={{notification, showNotification}}>
            {children}
            {<div
                className={`absolute ${notification!==null?``:`-translate-y-24`} top-0 w-1/5 flex right-0 m-3 h-16 bg-white shadow-2xl rounded-xl  
                duration-300 transition-all opacity-100 animate-slide-in  z-50 border-4 items-center  ${typeStyles[type]}`}>
                <span className="mr-2 text-xl">
                    {type === 'success' && '✅'}
                    {type === 'error' && '❌'}
                    {type === 'warning' && '⚠️'}
                    {type === 'info' && 'ℹ️'}
                </span>
                <span className={`text-black`}>{notification}</span>
            </div>}
        </NotificationContext.Provider>
    )
}
export const useNotification = () => {
    return useContext(NotificationContext)
}