import {useRef, useState} from "react"; 
import {SvgCancel} from "../../assets/svg/Cancel"; 
import {debounce} from "next/dist/server/utils"; 
import {QueryList} from "../http/queryApi"; 
import {ChooseBar} from "./ChooseBar"; 
import {$httpFormData} from "../http/FormDataApi";
import {useNotification} from "../NotificationProvider"; 
export function CreateAuthor(props){
    const coverRef=useRef(null);
    const [state,setstate] = useState({
        isCreate: true,
        avatarFileName:"",
        avatar_file:"",
        displaySearchBar:false,
        author_list:[],
        current_author:null,
        name:"",
    });
    var {showNotification}= useNotification()
    const handleState=(name,value)=>{
        setstate(prevState => ({ ...prevState, [name]: value }));
    }
    const ToEdit=(index)=>{
        handleState("isCreate",false);
        handleState("current_author",state.author_list[index]);
        handleState("name",state.author_list[index].name)
    }
    const ToCreate=()=>{
        handleState("isCreate",true);
        handleState("current_author",null)
        handleState("name","")
        
        
    }
    const handleSubmit=async ()=>{
        var formData=new FormData()
        formData.append("name",state.name)
        if(state.avatar_file&&state.avatarFileName)formData.append("avatar",state.avatar_file,state.avatarFileName)
        if(state.isCreate){
            var res = await $httpFormData(formData,"/file/author");
            if(res.msg==="Ac"){
                showNotification("success","创建作者成功")
            }else{
                showNotification("error",res.msg)
            }
        }else {
            formData.append("id",state.current_author.id)
            var res = await $httpFormData(formData,"/file/update/author");
            if(res.msg==="Ac"){
                showNotification("success","作者信息已更新")
            }else{
                showNotification("error",res.msg)
            }
        }
        
    }
    const handleAvatarChange = (e) => {
        if (e.target.files.length > 0) {
            handleState("avatarFileName", e.target.files[0].name);
            handleState("avatar_file", e.target.files[0]);
        }
    };
    const HandleSearch=useRef(
        debounce(async (keyword, target)=>{
            const res = await QueryList({
                target: target,
                begin: 0,
                size: 4, 
                keyword: keyword,
            });
            handleState("author_list",res.data)
        },1000)
    ).current    
    
    
    const AuthorInputChange = async (event) => {
        handleState("displaySearchBar",true);
        await HandleSearch(event.target.value,"author")
    }
    
    return(
        <div className={`w-1/2 p-8 h-auto bg-gray-800 rounded-xl flex flex-col space-y-5`} onClick={e=>e.stopPropagation()}>
            <div className={`w-full flex flex-row justify-between items-center`}>
                <div className={`text-xl`}>{state.isCreate?`Create Author`:`Edit Author:${state.current_author.id}`}</div>
                <div className={`relative w-1/2 flex justify-end`}>
                    <mdui-text-field 
                        onInput={AuthorInputChange}
                        onMouseOver={() => { handleState("displaySearchBar", true); }}
                        className={`w-1/3 items-center h-full justify-center mdui-theme-dark bg-transparent`}
                        variant="outlined"
                        label="编辑作者"
                    ></mdui-text-field>
                    {state.displaySearchBar&&(<ChooseBar
                    mouseleave={() => { handleState("displaySearchBar", false); }}
                    list={state.author_list}
                    clickItem={ToEdit}
                    className={`absolute top-full mt-1 w-48 h-44 p-2  bg-gray-900 rounded-xl shadow-2xl`}
                    >
                    </ChooseBar>)}
                </div>
            </div>
            <mdui-divider></mdui-divider>
            {!state.isCreate&&<mdui-button onClick={ToCreate} className={`w-1/4`}>取消编辑</mdui-button>}
            <div className={`w-full flex flex-row justify-between`}>
            <label className={` w-40 h-40 justify-center  border-2 border-dashed border-sky-400 bg-gray-700 rounded-full flex flex-col items-center cursor-pointer`}>
                <span className={`text-sky-400 `}>Click To Upload</span>
                <input
                    ref={coverRef}
                    type={`file`}
                    className={`hidden`}
                    onChange={handleAvatarChange}
                />
            </label>
            {!state.isCreate&&<img 
            src={`http://${state.current_author.avatar}`}
            alt={`img`}
            className={`w-40 h-40 object-cover rounded-full shadow-xl shadow-black`}
            ></img>}
            </div>
            {state.avatarFileName && (
                <div className="  flex justify-between hover:bg-gray-700 w-40  hover:rounded-xl hover:border-dashed mt-2 text-gray-300">
                    {state.avatarFileName}
                    <SvgCancel w={"16"} h={"16"}></SvgCancel>
                </div>
            )}
            <label className="flex flex-col space-y-2 text-white">
                艺名:
                <input 
                    onChange={(e) => handleState("name", e.target.value)}
                value={state.name}
                name="title"
                type="text"
                className="bg-gray-600 text-white rounded p-2 focus:outline-none focus:ring-2 focus:ring-sky-400"
            />
            {!state.isCreate&&<div className={`text-sm italic ml-3`}>*相关歌曲和专辑将会同时应用变更</div>}
            </label>              
            <div className={`w-full flex items-center justify-center`}>
                 <div className={`w-1/2 flex justify-between `}>
                    <mdui-button onClick={handleSubmit}>Submit</mdui-button>
                    <mdui-button variant={"tonal"} onClick={props.exit}>Exit</mdui-button>                 
                 </div>
            </div>
        </div>
    )
    
    
}
