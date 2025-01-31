import { SvgHome } from "../assets/svg/Home"; 
import { SvgSearch } from "../assets/svg/Search"; 
import {useEffect, useState } from "react"; 
import {GetUserInfo} from "../components/http/userApi"; 

export const TopBar = (props) => {
    const [state, setState] = useState({
        keyword: "",
        current_user:null,
        hoverAvatar:false
    });

    const handleState = (name, value) => {
        setState(preState => ({ ...preState, [name]: value }));
    };

    const handleInputChange = (event) => {
        handleState("keyword", event.target.value);
    };

    const handleKeyDown = (event) => {
        if (event.key === "Enter") {
                props.onSearch(state.keyword);
        }
    };
    
    useEffect(() => {
        const FetchUserInfo=async ()=>{
            var uid = localStorage.getItem("uid");
            if(uid) {
                var res = await GetUserInfo({uid:uid});
                handleState("current_user",res.data);
            }
        }
        FetchUserInfo() 
    }, []);

    return (
        <div className=" relative min-h-16 w-full items-center justify-center space-x-3 flex flex-row">
            <div className="cursor-pointer w-10 h-10 flex items-center justify-center bg-gray-700 bg-opacity-75 rounded-full">
                <SvgHome onclick={props.gohome} w="28" h="28" />
            </div>
            <div className="relative w-1/4">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <SvgSearch w="24" h="24" />
                </div>
                <input 
                    type="text" 
                    className="pl-10 h-10 rounded-full text-white bg-gray-700 bg-opacity-75 w-full" 
                    value={state.keyword} 
                    onChange={handleInputChange} 
                    onKeyDown={handleKeyDown}
                />
            </div>
            <div className={`absolute right-5 flex flex-col items-center w-16`}>
                <img alt={`img`} 
                src={`http://${state.current_user?state.current_user.avatar:`` }`} 
                onClick={props.onclickAvatar}
                onMouseOver={()=>{handleState("hoverAvatar",true)}}
                onMouseLeave={()=>{handleState("hoverAvatar",false)}}
                className={`h-12 w-12 rounded-full object-cover hover:scale-110 hover:cursor-pointer`} />
                <div className={`absolute top-full mt-3 bg-gray-700 border-4 max-w-20 truncate border-gray-700 left-0 ${!state.hoverAvatar?`hidden`:``} `}>{state.current_user?state.current_user.name:`` }</div>
            </div>
        </div>
    );
};
