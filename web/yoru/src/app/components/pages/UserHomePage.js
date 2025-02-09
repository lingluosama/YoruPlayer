import { useEffect, useRef, useState } from "react";
import { GetUserInfo, GetUserSangList } from "../http/userApi";
import { getColorFromImage } from "mdui";
import { SvgMore } from "../../assets/svg/More"; 
import {RowCardItem} from "../layouts/RowCardItem"; 
import Modal from "../layouts/Modal"; 
import {SvgCancel} from "../../assets/svg/Cancel"; 
import {$httpFormData} from "../http/FormDataApi"; 

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
        create_sanglist:false,
        new_sanglist_name:"",
        new_sanglist_description:"",
        new_sanglist_cover:null,
        new_sanglist_fileName:"",
        tag_search:"",
        current_tags:[],
        result_tags:[],
        show_all_sanglist: false,
        avatar_key:123,
    });
    const CoverRef = useRef(null);
    const handleState = (name, value) => {
        setState((prevState) => ({ ...prevState, [name]: value }));
    };
    const FetchUserData=async ()=>{
        const uid = localStorage.getItem("uid");
        var res = await GetUserInfo({ uid: uid });
        handleState("current_user", res.data);
        handleState("name",res.data.name)
        res = await GetUserSangList({ uid: uid });
        handleState("sanglist_list", res.data);
        reloadAvatar()
    }
    useEffect(() => {
        const fetchData = async () => {
            await FetchUserData()
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
    const handleCoverChange=(e)=>{
        if(e.target.files.length > 0){
            handleState("new_sanglist_fileName",e.target.files[0].name);
            handleState("new_sanglist_cover",e.target.files[0]);
        }
    }
    const GoToListDetail=(index)=>{
        props.golist(state.sanglist_list[index],"sanglist")
    }
    
    const SubmitNewSangList= async ()=>{
        const formData=new FormData();
        if(state.new_sanglist_cover)formData.append("cover",state.new_sanglist_cover,state.new_sanglist_fileName);
        formData.append("uid",localStorage.getItem("uid"));
        formData.append("title",state.new_sanglist_name);
        formData.append("description",state.new_sanglist_description);
        var res = await $httpFormData(formData,"/user/create/sanglist");
            if(res.msg==="Ac"){
               handleState("create_sanglist",false);
            }else{
            }
    }
    const reloadAvatar=()=>{
        handleState("avatar_key",state.avatar_key+1)
        return state.avatar_key+1
    }
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
        await FetchUserData()
    }
    useEffect(() => {
        if(state.message_content){
            messageApi.open({
                content:state.message_content,
                type:state.message_type
            })
        }	
    }, [state.message_content]);

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
                        <div>
                            <img
                                src={`http://${state.current_user ? state.current_user.avatar : ``}`}
                                alt={`img`}
                                className={`w-48 h-48 rounded-full drop-shadow-2xl object-cover hover:cursor-pointer`}
                                onClick={() => fileRef.current.click()}
                            />
                            <div>{
                                state.avatar_file_name && <div
                                    className={`truncate w-48 text-center hover:bg-white hover:bg-opacity-10 hover:cursor-pointer rounded-sm`}>{state.avatar_file_name}</div>
                            }</div>
                        </div>


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

                </div>
            </Modal>
            <Modal show={state.create_sanglist} onClick={()=>{handleState("create_sanglist",false)}}>
                <div onClick={e=>e.stopPropagation()} className={`w-1/2 space-y-6  p-7 h-1/2 rounded-xl bg-deep-gary flex flex-col`}>
                    <div className={`text-2xl`}>新建歌单</div>
                    <div className={`w-full flex-col justify-start space-y-3`}>
                        <div className="flex w-full flex-row justify-between">
                            <div className={`w-1/4`}>
                                <label className="w-full h-52 border-2 border-dashed border-white bg-deep-gary  rounded-2xl flex flex-col items-center justify-center cursor-pointer shadow-2xl">
                                    <span className="text-sky-400 font-semibold">Click To Upload</span>
                                    <span className="text-sm text-gray-400">Limited One File, The New Will Replace Old One</span>
                                    <input 
                                        ref={CoverRef} 
                                        type="file" 
                                        className="hidden"
                                        onChange={(e)=>handleCoverChange(e)} 
                                    />
                                </label>
                                {state.new_sanglist_fileName&&<div>{state.new_sanglist_fileName}</div>}
                            </div>
                            <div className={`w-2/3 flex flex-col justify-between`}>
                                <mdui-text-field
                                    className={`w-full h-1/4 mdui-theme-dark bg-transparent`}
                                    onInput={(e)=>handleState("new_sanglist_name",e.target.value)}
                                    variant="outlined"
                                    label="名称"
                                    ></mdui-text-field>
                                    <textarea
                                        placeholder={`歌单描述(null?)`}
                                        onInput={(e)=>handleState("new_sanglist_description",e.target.value)}
                                        className="resize-x overflow-auto whitespace-pre-wrap break-words bg-gray-600 h-1/2 text-white rounded p-2 focus:outline-none focus:ring-2 focus:ring-sky-400"
                                    />
                            </div>
                        </div>
                        <div className={`w-full items-center flex  justify-center h-1/4`}>
                            <mdui-button className={`w-32 h-12 text-xl`} onClick={SubmitNewSangList}>保存</mdui-button>
                        </div>
                        
                    </div>    
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
                        key={reloadAvatar}
                        ref={imgRef}
                    />
                    <div className={`flex flex-col-reverse`}>
                        <div className={`text-sm text-gray-400`}>{state.sanglist_list&&state.sanglist_list.length||0}个公开歌单</div>
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
                    <div ref={dropdownRef} className={`absolute z-10 bg-gray-700 p-3 rounded-xl space-y-3 flex flex-col ${state.displayMore ? `` : `hidden`}`}>
                        <div className={`hover:cursor-pointer hover:bg-white hover:bg-opacity-10`} onClick={()=>{handleState("displayModal",true)}}>编辑个人资料</div>
                        <div className={`hover:cursor-pointer hover:bg-white hover:bg-opacity-10`}>退出登陆</div>
                    </div>
                </div>
                <div className={`flex w-full space-y-3  flex-col relative`}>
                    <div className={`absolute right-0 top-3 hover:underline hover:cursor-pointer`} onClick={()=>handleState("show_all_sanglist",!state.show_all_sanglist)}>{state.show_all_sanglist?"收起":"显示全部"}</div>
                    <div className={`text-3xl ml-4`}>公开歌单</div>
                    <div className={`w-full flex flex-row flex-wrap `}>
                    {
                        state.sanglist_list&&state.sanglist_list.slice(0,state.show_all_sanglist?state.show_all_sanglist.length:5).map((item, index) =>{return <RowCardItem onClick={()=>GoToListDetail(index)} key={index} name={item.title} src={item.cover}></RowCardItem>} )
                        
                    }
                    <RowCardItem  create={true} key={1} name={`新建歌单`} src={""} onClick={()=>{handleState("create_sanglist",true)}}></RowCardItem>
                    </div>
                </div>
            </div>
        </div>
    );
}
