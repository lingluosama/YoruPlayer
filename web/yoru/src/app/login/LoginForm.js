import React,  {useState} from "react"; 
import {UserLogin} from "../components/http/userApi"; 
import {useRouter} from "next/router";
import {useNotification} from "../components/providers/NotificationProvider";
import {useLoadPage} from "../components/providers/LoadPageProvider";
import {useAddPlaylist} from "../components/providers/AddPlaylistProvider";
export const LoginForm = (props) => {
  const [state, setState] = useState({
    username: '',
    password: '',
  });
  var {showNotification} = useNotification();
  const { hidden, showList, hiddenList } = useAddPlaylist();
    
  const handleChange = (e) => {
    const { name, value } = e.target;
    setState(prevState => ({ ...prevState, [name]: value }));
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    UserLogin({username: state.username, password: state.password}).then(res => {
        if(res.msg==="Ac"){
            showNotification("success","登录成功")
            localStorage.setItem("token", res.data.token);
            localStorage.setItem("uid", res.data.uid);
            window.location.href = "/home";
        }else{
            showNotification("error",res.msg)
        }
    })
  };

 return (
       <div className={`w-3/12 inset-0 flex flex-col bg-white bg-opacity-45 p-8 rounded shadow-xl transform transition-transform duration-500 ${props.isLogin? '' : 'rotate-y-180'}`}>
        <h2 className="text-2xl font-semibold text-center text-sky-600 ">YoruPlayer-Login</h2>
           <form onSubmit={handleSubmit} className="mt-4">
               <div className="mb-4">
                   <label htmlFor="username" className="block text-sm font-medium text-black">Username</label>
                   <input
                       type="text"
                       id="username"
                       name="username"
                       value={state.username}
                       onChange={handleChange}
                       className="mt-1 p-2 w-full border rounded-md text-black"
                       required
                   />
               </div>
               <div className="mb-4">
                   <label htmlFor="password" className="block text-sm font-medium text-black">Password</label>
                   <input
                       type="password"
                       id="password"
                       name="password"
                       value={state.password}
                       onChange={handleChange}
                       className="mt-1 p-2 w-full border rounded-md"
                       required
                   />
               </div>
               <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600">
                   Login
               </button>
               <div className="w-full flex items-center justify-center mt-3">
                   <a href="#" className="underline text-blue-500" >Forgot
                       password?</a>
               </div>
               <div className="w-full flex flex-row-reverse  mt-3">
                   <a href="#" className="underline text-blue-500" onClick={props.change}>Don't have account?</a>
               </div>
            
           </form>
       </div>
 );
};
