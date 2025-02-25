'use client';

import React, {createContext, useContext, useEffect, useState} from "react";
import Modal from "../layouts/Modal";
import {AddToSangList, DeleteFormSangList, GetUserSangList, SangListProviderData} from "@/app/components/http/userApi";
import {useNotification} from "@/app/components/providers/NotificationProvider";
import 'mdui/components/checkbox.js';

const AddPlaylistContext=createContext(null)
export const AddPlayListProvider=({children})=>{
    const [hidden,setHidden] = useState(true);
    const [list,setList]=useState([])
    const [currentSid,setCurrentSid]=useState(null)
    const {showNotification}=useNotification()
    const showList= async (sid)=>{
        setHidden(false)
        const res = await SangListProviderData({sid:sid,uid:localStorage.getItem("uid")});
        setList(res.data.list)
        setCurrentSid(sid)
    }
    const hiddenList=()=>{
        setHidden(true)
    }
    useEffect(() => {
        const FetchSangList=async ()=>{
            const res = await SangListProviderData({sid:sid,uid:localStorage.getItem("uid")});
            setList(res.data.list)
        }
    }, []);
    const CheckBoxChange=async (value,index)=>{
        if(value){
            const res = await DeleteFormSangList({sid:currentSid,lid:list[index].sangList.id});
            if(res.msg==="Ac"){
                showNotification("success","歌曲已从歌单移除")
            }else{
                showNotification("error",res.msg)
            }
        }else{
            var res = await AddToSangList({sid:currentSid,lid:list[index].sangList.id});
            if(res.msg==="Ac"){
                showNotification("success","歌曲已添加")
            }else{
                showNotification("error",res.msg)
            }
        }
        
    }
    
    
    return(
        <AddPlaylistContext.Provider
            value={{hidden,showList,hiddenList}}>
            <Modal
                show={!hidden}
                onClick={hiddenList}
            >
                <div className={`w-1/3 p-6  h-2/3 bg-deep-gary rounded-xl flex flex-col`} onClick={e=>e.stopPropagation()}>
                    <div className={`text-3xl`}>添加到歌单</div>
                    <div className={`w-full justify-end mt-6 flex flex-row `}>
                        <div className={`w-2/3 justify-between flex flex-row`}>
                            <div>标题</div>
                            <div className={`mr-3`}>状态</div>
                        </div>
                    </div>
                    <mdui-divider></mdui-divider>
                    <div className={`h-full overflow-auto w-full flex flex-col ${hidden?`hidden`:``}`} key={0}>{
                        list.length>0&&list.map((item,index)=> {
                         return <div key={index+1} className={`h-1/5 rounded-2xl mt-3 items-center w-full duration-300 transition-all hover:bg-white  hover:bg-opacity-10 flex flex-row`}>
                             <div className={`h-full w-1/3 justify-items-start items-center flex flex-row`}>
                                 <img alt={`img`} src={`http://${item.sangList.cover}`}
                                      className={`h-5/6 ml-3 aspect-1 object-cover rounded-2xl`}/>
                             </div>
                             <div className={`w-2/3 h-full  items-center flex-row flex justify-between `}>
                                 <div className={``}>{item.sangList.title}</div>
                                 <mdui-checkbox
                                     checked={item.isIn}
                                     onInput={
                                         async (e) => {
                                             await CheckBoxChange(e.target.checked, index);
                                             item.isIn=!item.isIn
                                         }
                                     }
                                 ></mdui-checkbox>
                             </div>
                         </div>
                        })

                    }</div>
                    
                </div>
            </Modal>
            {children}
        </AddPlaylistContext.Provider>
        
    )
}

export const useAddPlaylist=()=>{
    return useContext(AddPlaylistContext)
}