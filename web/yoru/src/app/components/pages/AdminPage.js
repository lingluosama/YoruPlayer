import {useNotification} from "../providers/NotificationProvider";
import {useEffect, useState} from "react";
import {DeleteHandler, GrantAdmin} from "../http/adminApi";
import {TagBottom} from "../layouts/TagButtom";
import {QueryList} from "../http/queryApi";


export function AdminPage(props){
    const {showNotification} =useNotification()
    
    const [isAdmin,setIsAdmin] = useState(false);
    
    const [target,setTarget]=useState("single")
    const TargetButtons = ["single", "album", "sanglist","author","user"];
    const TargetButtonsText=["单曲","专辑","歌单","作者","用户"]

    let [currentList, setCurrentList] = useState([])
    const [keyword,setKeyword]=useState("")
    const [listIndex,setListIndex]=useState(-1)
    
    const HandleTargetButtonClick=(index)=>{
        setTarget(TargetButtons[index])
    }
    
    useEffect(()=>{
        async function Auth(){
            var res = await DeleteHandler({
                target:"check",
                uid:localStorage.getItem("uid"),
                id:"114514"
            });
            if(res.msg==="Ac"){
                setIsAdmin(true)
            }
            
        }
        Auth()
        
    },[])
    const QueryCurrentList=async (target,keyword)=>{
        var res = await QueryList({
            target:target,
            begin:0,
            size:1000,
            keyword:keyword
        });
        if(res.msg==="Ac")setCurrentList(res.data)
        else{showNotification(
            "error",
            res.msg
        )}
    }
    const DeleteFromList = async (index) => {
        var res = await DeleteHandler({
            target: target,
            uid: localStorage.getItem("uid"),
            id: currentList[index].id
        });
        if (res.msg === "Ac") {
            showNotification("success", `${target}已删除`);
        } else {
            showNotification("error", res.msg);
        }
        setCurrentList([
            ...currentList.slice(0, index),
            ...currentList.slice(index + 1)
        ]);
    }
    const GrantUserAdmin=async (index)=> {
        var res = await GrantAdmin({
            uid: localStorage.getItem("uid"),
            id: currentList[index].id,
            remove: currentList[index].authority ? `true` : `false`
        });
        if (res.msg === "Ac") {
            showNotification(
                "success",
                "权限等级已变更"
            )
        } else {
            {
                showNotification(
                    "error",
                    res.msg
                )
            }
        }
        await QueryCurrentList(target,keyword)
        
    }
    useEffect(() => {
        async function fetchData(){
             await QueryCurrentList(target,keyword)            
        }
        fetchData()
        
    }, [target]);
    
    
    
    return <div className={`w-full h-full flex flex-col p-8`}>{
        isAdmin===false?
            <div className={`w-full h-full items-center justify-center space-y-5 flex flex-col`}>
                <div className={`text-5xl text-white`}>你不是管理员</div>
                <div className={`text-4xl text-white`}>You're not admin,contact other admin to process auth</div>
            </div>
            : <div className={` bg-deep-gary rounded-2xl w-full h-full flex flex-col p-4 space-y-5`}>
                <div className={`w-full flex flex-row justify-between items-center`}>
                    <div className="flex flex-row space-x-7 w-full justify-start">
                        {
                            TargetButtons.map((item, index) => (
                                <div key={index}>
                                    <TagBottom text={TargetButtonsText[index]} choose={item === target}
                                               onclick={() => HandleTargetButtonClick(index)}/>
                                </div>
                            ))
                        }
                    </div>
                    <mdui-text-field
                        className={`ml-3 w-1/6 mdui-theme-dark h-12`}
                        variant="outlined"
                        label={`按下回车搜索`}
                        value={keyword} onInput={(e)=>{setKeyword(e.target.value)}}
                        onKeyDown={async (event) => {
                            if(event.key==="Enter") {
                                await QueryCurrentList(target,keyword)
                            }
                        }}>
                    </mdui-text-field>
                </div>
                <div className={`text-3xl`}>管理项目</div>            
                <mdui-divider className={``}></mdui-divider>
                <div className={`h-full overflow-auto flex flex-col w-full`}>{
                    currentList.length>0&&currentList.map((item,index)=>{
                        return <div 
                            key={index} className={`w-full flex flex-col relative transition-all duration-300`}
                            onMouseOver={() => {
                                setListIndex(index)
                            }}
                            onMouseLeave={() => {
                                setListIndex(-1)
                            }}
                        >
                            <div
                                className={`relative w-full duration-300  transition-all hover:bg-white h-20 items-center flex flex-row hover:bg-opacity-10 rounded-2xl`}>
                                <img alt={`img`} src={` http://${target!=="author"&&target!=="user"?item.cover:item.avatar}`}
                                     className={`absolute w-16 ml-4  aspect-1 rounded-2xl object-cover`}/>
                                <div className={`w-1/3 text-end`}>{target!=="author"&&target!=="user"?item.title:item.name}</div>
                                <div className={`w-1/3 text-end`}>{
                                    target==="sanglist"?item.creater:target==="single"?item.author:target==="album"?item.author:target==="user"?item.authority?`管理员`:`用户`:item.description
                                }
                                </div>
                            </div>
                            {<div  className={`w-full flex flex-row transition-all space-x-6 items-center duration-300 ${listIndex===index?`h-10 `:`h-0 bottom-0 opacity-0`} `}>
                                {target!=="author"&&<mdui-button className={`h-2/3 ml-5`}
                                    onClick={async ()=>{await DeleteFromList(index)}}>
                                        删除
                                    </mdui-button>}
                                {target==="user"&&<mdui-button className={`h-2/3 ml-5`} onClick={async ()=>{ await GrantUserAdmin(index)}}>
                                    {item.authority?`移除管理员`:`授权管理员`}
                                </mdui-button>
                                }
                            </div>}
                        </div>
                        
                    })

                }</div>
            </div>}
        </div>
        
        
}
    
    
        