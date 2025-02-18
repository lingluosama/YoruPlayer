import React,  {useState} from "react"; 
import {UserLogin,UserRegister} from "../components/http/userApi";

export const RegisterForm=(props)=>{
      const [state, setState] = useState({
        username: '',
        password: '',
        email:''
      });
    
      const handleChange = (e) => {
        const { name, value } = e.target;
        setState(prevState => ({ ...prevState, [name]: value }));
      };
    
      const handleSubmit = (e) => {
        e.preventDefault();
        UserRegister({
            username: state.username,
            password: state.password,
            email:state.email,
            }).then(res => {
            console.log(res);
        })
      };
    
      return (
             <div className={`w-3/12 inset-0 flex flex-col bg-opacity-45 bg-white p-8 rounded shadow transform transition-transform duration-500 ${props.isLogin? 'rotate-y-180' : ''}`}>
              <h2 className="text-2xl font-semibold text-center text-green-500 ">Register</h2>
              <form onSubmit={handleSubmit} className="mt-4">
                <div className="mb-4">
                  <label htmlFor="username" className="block text-sm font-medium text-black">Username</label>
                  <input
                    type="text"
                    id="username"
                    name="username"
                    value={state.username}
                    onChange={handleChange}
                    className="mt-1 p-2 w-full border text-black rounded-md"
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
                <div className="mb-4">
                  <label htmlFor="email" className="block text-sm font-medium text-black">Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={state.email}
                    onChange={handleChange}
                    className="mt-1 p-2 w-full border text-black rounded-md"
                    required
                  />
                </div>
                <button type="submit" className="w-full bg-green-400 text-white py-2 rounded-md hover:bg-green-600">
                  Register
                </button>
                <div className="w-full flex flex-row-reverse  mt-3">
                 <a href="#" className="underline text-blue-500" onClick={props.change}>Already have account?</a>
                </div>
              </form>
            </div>
      );
}
