import { useRef, useState } from "react"; 
import { SvgCancel } from "../../assets/svg/Cancel"; 
import {$httpFormData} from "../http/FormDataApi"; 
import {ChooseBar} from "../layouts/ChooseBar"; 
import {debounce} from "next/dist/server/utils"; 
import {GetAlbumDetail, QueryList} from "../http/queryApi"; 
import Modal from "../layouts/Modal"; 
import {CreateAuthor} from "../layouts/CreateAuthor"; 
import {AddSingleToAlbum,DeleteSingleFromAlbum} from "../http/updateApi"; 
import {SvgAdd} from "../../assets/svg/Add";
import {useNotification} from "../providers/NotificationProvider";
import {globalLoadControl} from "../../lib/loadControl"; 

export function EditAlbumPage(props) {
    const CoverRef = useRef(null);
    const [state, setState] = useState({
        isUpdate:!props.create,
        title: "",
        coverFileName: null,
        cover: null,
        description: "",
        displayAlbumSearch:"",
        displayAuthorSearch:"",
        album_list:[],
        author_list:[],
        sang_list:[],
        add_sang_list:[],
        current_album:null,
        author: "",
        displayModal:false,
        displayAddSangModal:false,
    });
    var {showNotification} = useNotification();
    const handleState = (name, value) => {
        setState((prevState) => ({ ...prevState, [name]: value }));
    };

    const handleCoverChange = (e) => {
        if (e.target.files.length > 0) {
            handleState("coverFileName", e.target.files[0].name);
            handleState("cover", e.target.files[0]);
        }
    };
    
    const HandleSearch=useRef(
        debounce(async (keyword, target,size)=>{
            const res = await QueryList({
                target: target,
                begin: 0,
                size: size,
                keyword: keyword,
            });
            if(target==="author")handleState("author_list",res.data)
            else if(target==="album") handleState("album_list",res.data)
            else handleState("add_sang_list",res.data)
        },1000)
    ).current
    
    const AlbumInputChange= async (event)=>{
        handleState("displayAlbumSearch",true)
        await HandleSearch(event.target.value,"album",4)
    }
    
    const AuthorInputChange= async (event)=>{
        handleState("displayAuthorSearch",true)
        await HandleSearch(event.target.value,"author",3)
    }
    
    const SangInputChange=async (event)=>{
        await HandleSearch(event.target.value,"single",12)
    }
    const ToEdit=async (index)=>{
        handleState("isUpdate",true)
        handleState("current_album",state.album_list[index]);
        handleState("title",state.album_list[index].title)
        handleState("description",state.album_list[index].description)
        handleState("author",state.album_list[index].author)
        var res = await GetAlbumDetail({aid:state.album_list[index].id});
        handleState("sang_list",res.data.singles)
    }
    const ToCreate=()=>{
        handleState("isUpdate",false)
        handleState("title","")
        handleState("description","")
        handleState("author","")        
    }
    const [reloadKey, setReloadKey] = useState(0);
    const reloadList =async () => {
        var res = await GetAlbumDetail({aid:state.current_album.id});
        handleState("sang_list",res.data.singles)
        setReloadKey(prev => prev + 1); // 修改 key 值
    };
    
    const CancelUploadCover = () => {
        if (CoverRef.current) {
            CoverRef.current.value = null;
            handleState("coverFileName", null);
            handleState("cover", null);
        }
    };
    
    const handleSubmit=async ()=>{
        globalLoadControl.show()
        const formData = new FormData();
        formData.append("title", state.title);
        if(state.cover&&state.coverFileName)formData.append("cover", state.cover,state.coverFileName);
        formData.append("description", state.description);
        formData.append("author", state.author);
        var res
       if(!state.isUpdate){ 
           res= await $httpFormData(formData,"/file/album")
       }
       else {
           formData.append("aid",state.current_album.id)
           res= await $httpFormData(formData,"/file/update/album")
       }
       if(res.msg==="Ac"){
           showNotification("success","专辑信息已更新")
       }else{
           showNotification("error",res.msg)
       }
       globalLoadControl.hide() 
    }
    const handleAlbumSangInput=async (sid,value)=>{
       if(value===false){
           await AddSingleToAlbum({
            sid:sid,
            aid:state.current_album.id
           })
       }else{
           await DeleteSingleFromAlbum({sid:sid})
       }
       await reloadList()
    }

    return (
        <div className="w-full flex flex-col items-center p-8 ">
            <Modal show={state.displayModal} onClick={()=>{handleState("displayModal",false)}}>
                <CreateAuthor
                exit={()=>{handleState("displayModal",false)}}
                
                ></CreateAuthor>
            </Modal>
            <Modal show={state.displayAddSangModal} onClick={()=>{handleState("displayAddSangModal",false)}}>
                <div className={`w-2/5 h-2/3 relative rounded-2xl bg-gray-700 flex p-8 flex-col space-y-8 `} onClick={e=>e.stopPropagation()}>
                    <SvgCancel onclick={()=>{handleState("displayAddSangModal",false)}} className={`absolute right-8 hover:cursor-pointer hover:rounded-full`} w={`18`} h={`18`}></SvgCancel>
                    <div className={`w-full flex items-center justify-center relative`}>
                        <mdui-text-field
                        label="搜索歌曲以添加" 
                        variant={"outlined"}
                        onInput={SangInputChange}
                        className={`w-2/3  h-full mdui-theme-dark bg-transparent`}
                        ></mdui-text-field>
                    <div className={`absolute top-full right-0 italic  text-sm`}>*仅显示没有归属专辑的歌曲</div>
                    </div>
                <mdui-divider className={``}></mdui-divider>
                <div className={`h-full w-auto overflow-auto flex flex-col space-y-5`}>
                
                    {state.add_sang_list&&state.add_sang_list.map((item,index)=>(
                       item.album_id!==state.current_album.id&&<div className={` items-center h-32 hover:bg-white hover:rounded-2xl hover:bg-opacity-15 flex flex-row justify-between`}>
                            <div className={`items-center w-1/3 space-x-5 h-20 flex flex-row`}>
                                <img src={`http://${item.cover}`} className={`h-16 w-16 ml-4 object-cover rounded-2xl`} />
                                <div className={`flex flex-col space-y-2`}>
                                    <div>{item.title}</div>
                                    <div className={`text-sm`}>{item.author}</div>
                                </div>
                            </div>
                            <div className={`w-1/6 items-center`}>
                                <mdui-checkbox 
                                onInput={(event)=>{handleAlbumSangInput(state.add_sang_list[index].id,event.target.checked)}}
                                ></mdui-checkbox>
                            </div>
                        </div>
                    ))}
                </div>
                </div>
            </Modal>
            <div className="flex flex-col space-y-8 w-4/5 bg-gray-800 p-8 rounded-md shadow-lg">
                <div className=" w-full relative flex flex-row items-center justify-between">
                    <div className={`text-2xl font-bold text-white`}>
                    
                      {!state.isUpdate ? `Create a Album` : `Edit: ${state.title}`}
                    </div>
                    <div className={`relative w-1/2 flex  justify-end`}>
                <mdui-text-field
                    className={`w-1/3 h-3/4 mdui-theme-dark bg-transparent`}
                    onInput={AlbumInputChange}
                    variant="outlined"
                    label="搜索以编辑专辑"
                    onFocus={()=>{handleState("displayAlbumSearch",true)}}
                    >
                </mdui-text-field>
                    {state.displayAlbumSearch && <ChooseBar 
                    className={`absolute top-full mt-1 w-48 h-44 p-2  bg-gray-900 rounded-xl shadow-2xl`}
                    list={state.album_list}
                    mouseleave={()=>{handleState("displayAlbumSearch",false)}}
                    clickItem={ToEdit}
                    >
                    
                    </ChooseBar>}
                </div>
                </div>
                <mdui-divider></mdui-divider>
                {state.isUpdate&&<mdui-button className={`w-1/6`} onClick={ToCreate}>退出编辑</mdui-button>}
                <div className="w-full h-52 flex-row flex justify-between items-center">
                    {state.isUpdate && (
                        <img
                            src={`http://${state.current_album.cover}`}
                            alt="img"
                            className="w-48 h-48 object-cover rounded-md shadow-md"
                        />
                    )}
                    <div className="flex flex-col items-center">
                        <label className="w-48 h-52 border-2 border-dashed border-sky-400 bg-gray-600 rounded-2xl flex flex-col items-center justify-center cursor-pointer shadow-md">
                            <span className="text-sky-400 font-semibold">Click To Upload</span>
                            <span className="text-sm text-gray-400">Limited One File, The New Will Replace Old One</span>
                            <input 
                                ref={CoverRef} 
                                type="file" 
                                className="hidden" 
                                onChange={handleCoverChange} 
                            />
                        </label>
                        {state.coverFileName && (
                            <div className="flex items-center justify-between mt-2 text-gray-300 w-full hover:bg-gray-600 hover:rounded-xl hover:border-dashed p-2">
                                <span>{state.coverFileName}</span>
                                <SvgCancel w="16" h="16" onClick={CancelUploadCover} />
                            </div>
                        )}
                    </div>
                </div>
                <label className="relative flex flex-col space-y-2 text-white">
                <a  onClick={()=>{handleState("displayModal",true)}} className={`absolute right-3 top-full mt-3 hover:text-sky-400 hover:underline hover:cursor-pointer`}>没有找到现有的该作者?</a>
                    {state.displayAuthorSearch&&<ChooseBar
                    
                    className={`absolute p-3 rounded-xl overflow-hidden top-full w-72 h-32 bg-gray-900`}
                    mouseleave={()=>{handleState("displayAuthorSearch",false)}}
                    list={state.author_list}
                    clickItem={(index)=>{
                        handleState("author",state.author_list[index].name);
                        handleState("displayAuthorSearch",false)
                    }}>
                    
                    </ChooseBar>}
                    作者:
                    <input 
                        onKeyDown={(event)=>{if(event.key===`Enter`)handleState("displayAuthorSearch",false)}}
                        onInput={AuthorInputChange}
                        onFocus={()=>{handleState("displayAuthorSearch",true)}}
                        onChange={(e) => handleState(e.target.name, e.target.value)}
                        value={state.author}
                        name="author"
                        type="text"
                        className="bg-gray-600 text-white rounded p-2 focus:outline-none focus:ring-2 focus:ring-sky-400"
                    />
                    
                </label>
                    <label className="flex flex-col space-y-2 text-white">
                        标题:
                        <input 
                            onChange={(e) => handleState(e.target.name, e.target.value)}
                        value={state.title}
                        name="title"
                        type="text"
                        className="bg-gray-600 text-white rounded p-2 focus:outline-none focus:ring-2 focus:ring-sky-400"
                    />
                </label>  
                <label className="flex flex-col space-y-2 text-white">
                    描述:
                    <textarea 
                        onChange={(e) => handleState(e.target.name, e.target.value)}
                        value={state.description}
                        name="description"
                        className="bg-gray-600 text-white rounded p-2 focus:outline-none focus:ring-2 focus:ring-sky-400 resize-y"
                        rows="4"
                    />
                </label>
                {state.isUpdate&&
                <div className={`w-full flex flex-col justify-start items-center rounded-xl`}>
                    <div className={`w-full flex `}>歌曲列表:</div>
                    <div className={`justify-self-end text-end w-full italic text-sm`}>*此项更改会即时生效</div>
                    <mdui-list className={`w-full  rounded-xl`} key={reloadKey} >
                    {
                        state.sang_list&&state.sang_list.map((item,index)=>(<mdui-list-item 
                        rounded={true}
                        key={index}
                        className={` hover:bg-white hover:bg-opacity-15`}
                        >
                            <img src={`http://${item.cover}`} alt={`img`} slot={`icon`} className={` h-12 w-12 object-cover rounded-xl`}/>
                            <div className={`text-white `}>{item.title}</div>
                            <mdui-checkbox 
                             slot="end-icon"
                             checked
                             onInput={(event)=>{handleAlbumSangInput(state.sang_list[index].id,event.target.checked)}}
                             ></mdui-checkbox>
                        </mdui-list-item>))
                    }
                    <mdui-list-item
                    rounded={true}
                    className={` hover:bg-white hover:bg-opacity-15`}
                    onClick={()=>{handleState("displayAddSangModal",true)}}
                                        
                    ><SvgAdd w={`24`} h={`24`}></SvgAdd></mdui-list-item>
                    
                    </mdui-list>
                    
                </div>}
                <div className={`w-full flex items-center justify-center`}>
                    <mdui-button className={`w-32 h-12`} onClick={handleSubmit}>Submit</mdui-button>
                </div>
            </div>
        </div>
    );
}
