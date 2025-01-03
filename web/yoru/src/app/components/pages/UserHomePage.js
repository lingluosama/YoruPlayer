import { useEffect, useRef, useState } from "react";
import { GetUserInfo, GetUserSangList } from "../http/userApi";
import { getColorFromImage } from "mdui";
import { SvgMore } from "../../assets/svg/More"; 
import {RowCardItem} from "../layouts/RowCardItem"; 
import Modal from "../layouts/Modal"; 
import {SvgCancel} from "../../assets/svg/Cancel"; 
import {$httpFormData} from "../http/FormDataApi"; 
import {ElMessage} from "element-plus";

export function UserHomePage(props) {
    const imgRef = useRef(null);
    const fileRef =useRef(null)
    const dropdownRef = useRef(null); 
    const [state, setState] = useState({
        current_user: null,
        color: '#fff',
        sanglist_list: [],
        displayMore: false,
        displayModal:false,
        avatar_file:null,
        avatar_file_name:null,
        name:"",
    });
    
    const handleState = (name, value) => {
        setState((prevState) => ({ ...prevState, [name]: value }));
    };

    useEffect(() => {
        const fetchData = async () => {
            const uid = localStorage.getItem("uid");
            var res = await GetUserInfo({ uid: uid });
            handleState("current_user", res.data);
            handleState("name",res.data.name)
            res = await GetUserSangList({ uid: uid });
            handleState("sanglist_list", res.data);
        };
        fetchData();
    }, [props]);

    useEffect(() => {
        if (imgRef.current) {
            imgRef.current.addEventListener('load', async () => {
                const color = await getColorFromImage(imgRef.current);
                handleState("color", color);
            });
        }
    }, [imgRef]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                handleState("displayMore", false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);
    const handleAvatarChange = (e) => {
        if (e.target.files.length > 0) {
            handleState("avatar_file_name", e.target.files[0].name);
            handleState("avatar_file", e.target.files[0]);
        }
    };
    
    const UpdateInfo= async ()=>{
        const formData = new FormData();
        if(state.avatar_file)formData.append("avatar",state.avatar_file,state.avatar_file_name)
        formData.append("name",state.name)
        formData.append("signature",state.current_user.signature)
        formData.append("email",state.current_user.email)
        formData.append("uid",state.current_user.id)
        await $httpFormData(formData, "/user/update").then(async ()=>{
            const uid = localStorage.getItem("uid");
            var res = await GetUserInfo({ uid: uid });
            handleState("current_user", res.data);
            handleState("name",res.data.name)
            res = await GetUserSangList({ uid: uid });
            handleState("sanglist_list", res.data);
        })
    }

    return (
        <div className={`w-full pl-8 pr-8 pb-8 pt-3 rounded-2xl`}>
            <Modal show={state.displayModal} onClick={()=>{handleState("displayModal",false)}}>
                <input 
                type={"file"} 
                className={`hidden`} 
                ref={fileRef} 
                onClick={e=>e.stopPropagation()}
                onChange={handleAvatarChange} 
                 />
            
                <div onClick={e=>e.stopPropagation()} className={`w-1/3 space-y-6  p-7 h-2/5 rounded-xl bg-deep-gary flex flex-col`}>
                    <div className={`w-full justify-between flex items-center`}>
                        <div className={`text-2xl`}>个人资料详情</div>
                        <SvgCancel onclick={()=>{handleState("displayModal",false)}} w={`24`} h={`24`} className={`hover:scale-110 hover:cursor-pointer`}></SvgCancel>
                    </div>
                    <div className={`w-full flex flex-row items-center space-x-6 ` }>
                       <img 
                        src={`http://${state.current_user?state.current_user.avatar:``}`} 
                        alt={`img`}  
                        className={`w-48 h-48 rounded-full drop-shadow-2xl object-cover hover:cursor-pointer`}
                        onClick={()=>fileRef.current.click()} 
                         />
                       <div className={`w-full  space-y-6 flex flex-col`}>
                          <input 
                            type={"text"} 
                            className={`h-8 w-full p-3 bg-opacity-10 bg-white rounded-sm`}
                            value={state.name}
                            onChange={(e) => handleState("name",e.target.value)} 
                             />
                          <mdui-button className={`w-1/2`} onClick={UpdateInfo}>保存</mdui-button>
                       </div>
                    </div> 
                    {   
                        state.avatar_file_name&&<div className={`truncate w-48 text-center hover:bg-white hover:bg-opacity-10 hover:cursor-pointer rounded-sm`}>{state.avatar_file_name}</div>
                    }
                </div>
            </Modal>
            <div 
                className={`p-8 pt-12 w-full min-h-screen rounded-2xl space-y-6 flex flex-col`}
                style={{ backgroundImage: `linear-gradient(${state.color}, transparent)` }}>
                <div className={`w-full flex flex-row space-x-12`}>
                    <img
                        src={`http://${state.current_user? state.current_user.avatar : ``}`}
                        alt={`img`}
                        crossOrigin="anonymous"
                        className={`w-64 h-64 rounded-full drop-shadow-2xl object-cover hover:cursor-pointer`}
                        
                        ref={imgRef}
                    />
                    <div className={`flex flex-col-reverse`}>
                        <div className={`text-sm text-gray-400`}>{state.sanglist_list.length}个公开歌单</div>
                        <div className={`text-8xl font-bold`}>{state.current_user ? state.current_user.name : ``}</div>
                        <div className={``}>个人资料</div>
                    </div>
                </div>
                <mdui-divider></mdui-divider>
                <div className={`w-full relative`}>
                    <SvgMore 
                        className={`hover:cursor-pointer`} 
                        w={`48`} 
                        h={`48`} 
                        onclick={() => handleState("displayMore", true)} 
                    />
                    <div ref={dropdownRef} className={`absolute bg-gray-700 p-3 rounded-xl space-y-3 flex flex-col ${state.displayMore ? `` : `hidden`}`}>
                        <div className={`hover:cursor-pointer hover:bg-white hover:bg-opacity-10`} onClick={()=>{handleState("displayModal",true)}}>编辑个人资料</div>
                        <div className={`hover:cursor-pointer hover:bg-white hover:bg-opacity-10`}>退出登陆</div>
                    </div>
                </div>
                <div className={`flex w-full space-y-3  flex-col`}>
                    <div className={`text-3xl ml-4`}>公开歌单</div>
                    <div className={`w-full flex flex-row`}>
                    {
                        state.sanglist_list.slice(0,7).map((item, index) =>{return <RowCardItem  key={index} name={item.title} src={item.cover}></RowCardItem>} )
                    }
                    </div>
                </div>
            </div>
        </div>
    );
}
