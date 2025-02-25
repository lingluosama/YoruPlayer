import { useEffect, useRef, useState } from "react"; 
import { GetAlbumDetail, GetAuthorPage, GetSangListDetail, GeyAuthorByName,QueryList } from "../http/queryApi"; 
import { getColorFromImage } from "mdui"; 
import { ListItem } from "../layouts/ListItem"; 
import { $httpFormData } from "../http/FormDataApi"; 
import {SvgCancel} from "../../assets/svg/Cancel"; 
import Modal from "../layouts/Modal"; 
import {AddTagForSangList, DropTagForSangList, GetRecommendSang, GetSangListTag, SearchTag} from "../http/recommendApi"; 
import {debounce} from "next/dist/server/utils"; 
import {SangTag} from "../layouts/SangTag";
import {useNotification} from "../providers/NotificationProvider";
import {GreenPlay} from "../../assets/svg/GreenPlay";
import {ReplaceQueue} from "../http/PlayApi";
import {emitter} from "next/client";
import {GetUserInfo} from "../http/userApi"; 

export function DetailSingleList(props) {
    const imgRef = useRef(null);
    const edit_uploadRef = useRef(null);
    const {showNotification}= useNotification()
    
    const [state, setState] = useState({
        title: "",
        type: "null",
        cover: "",
        description: "",
        author: "",
        sanglist: [],
        album_name: [],
        albumlist: [],
        color: '#fff',
        author_avatar: "",
        author_name: "",
        creater:"",
        show_modal:"",
        edit_title:"",
        edit_description:"",
        edit_file:"",
        edit_fileName:"",
        tag_search:"",
        current_tags:[],
        result_tags:[],
        sanglist_id:"",
        author_id:"",
        show_tagList:false,
        current_user:"",
    });
    
    const handleState = (name, value) => {
        setState(prevState => ({ ...prevState, [name]: value }));
    }

    const GetSangListData = async () => {
        const res = await GetSangListDetail({ lid: props.sanglist.id });
        handleState("title", res.data.sangList.title);
        handleState("sanglist_id",res.data.sangList.id);
        handleState("cover", res.data.sangList.cover);
        handleState("sanglist", res.data.singles);
        handleState("creater",res.data.sangList.creater);
        handleState("description",res.data.sangList.description);
        handleState("edit_title",res.data.sangList.title)
        handleState("edit_description",res.data.sangList.description)
    }

    const GetAlbumListData = async () => {
        const res = await GetAlbumDetail({ aid: props.album.id });
        handleState("sanglist", res.data.singles);
    }

    const GetAuthorInfo = async () => {
        const res = await GeyAuthorByName({ name: props.album.author });
        handleState("author_avatar", res.data.avatar);
        handleState("author_name", res.data.name);
        handleState("author_id",res.data.id)
    }
    const HandleSearch=useRef(
        debounce(async (keyword,size)=>{
            const res = await SearchTag({
                offset: 0,
                size: size,
                keyword: keyword,
            });
            handleState("result_tags",res.data);
        },1000)
        ).current
    const Edit_TagInputChange = async (event) => {
        HandleSearch(event.target.value,4);
        handleState(`tag_search`,event.target.value);
        handleState("show_tagList",true);
    }
    const GetSingleAlbum = async (sanglist) => {
        const ids = sanglist.map(item => item.album_id);
        const formData = new FormData();
        formData.append("ids", ids);
        const res = await $httpFormData(formData, "/query/album/names");
        handleState("album_name", res.data);
    }
    
    const GetAuthorData = async () => {
        const res = await GetAuthorPage({name: props.name});
        handleState("sanglist", res.data.sang_list);
        handleState("albumlist", res.data.album_list);
        handleState(`cover`,res.data.author.avatar)
    }
    
    const handleEditUploadChange=(e)=>{
        if(e.target.files.length > 0){
            handleState("edit_fileName",e.target.files[0].name);
            handleState("edit_file",e.target.files[0]);
        }
    }
    const SubmitUploadSangList=async ()=>{
        const formData=new FormData()
        if(state.edit_file)formData.append("cover",state.edit_file,state.edit_fileName)
        formData.append("description",state.edit_description)
        formData.append("title",state.edit_title)
        formData.append("lid",state.sanglist_id)
        var res = await $httpFormData(formData,"/user/update/sanglist");
        if(res.msg==="Ac"){
            await GetSangListData()
            showNotification("success","歌单信息已变更")
        }else{
            showNotification("error",res.msg)
        }
    }
    const AddTag=async (tag)=>{
        var res = await AddTagForSangList({lid:state.sanglist_id,tag:tag});
        if(res.msg==="Ac"){
            res = await GetSangListTag({lid:state.sanglist_id});
            handleState("current_tags",res.data)
        }
    }
    const  DropTag=async (tag)=>{
        var res = await DropTagForSangList({lid:state.sanglist_id,tag:tag});
        if(res.msg==="Ac"){
            res = await GetSangListTag({lid:state.sanglist_id});
            handleState("current_tags",res.data)
        }  
    }
    const ReplacePlayQueue=async ()=>{
        let uid = localStorage.getItem("uid");
        let id = "";
        switch (props.type){
            case "album":
                id=props.album.id
                break;
            case "sanglist":
                id=state.sanglist_id
                break;
            case "author":
                id=state.author_id
                break;
        }
        const res = await ReplaceQueue({target:props.type,uid:uid,id:id});
        if(res.msg==="Ac"){
            showNotification("success","播放队列已替换")
        }else{
            showNotification("error",res.msg)
        }
        await emitter.emit("FetchPlayQueue")
    }
    const GetRecommend=async ()=>{
        var uid = localStorage.getItem("uid");
        var res = await GetRecommendSang({uid:uid,target:"single"});
        handleState("sanglist",res.data)
        if(uid) {
            var res = await GetUserInfo({uid:uid});
            handleState("current_user",res.data);
        }
        
        
    }
    useEffect(() => {
        async function fetchData() {
            switch (props.type) {
                case "album":
                    handleState("title", props.album.title);
                    handleState("type", "专辑");
                    handleState("cover", props.album.cover);
                    handleState("description", props.album.description);
                    await GetAlbumListData();
                    await GetAuthorInfo();
                    break;
                case "sanglist":
                    handleState("title", props.sanglist.title);
                    handleState("cover", props.sanglist.cover);
                    handleState("type", "歌单");
                    await GetSangListData();
                    break;
                case "author":
                    handleState("title", props.name);
                    handleState("type", "艺人");
                    await GetAuthorData();
                    break;
                case "recommend":
                    handleState("title",`根据${localStorage.getItem("u_name")}的口味推荐`)
                    handleState("type","歌单")
                    handleState("cover", localStorage.getItem("u_avatar"));
                    await GetRecommend();
                    break;
                default:
                    break;
                    
            }
        }

        fetchData().then(() => {
            if (imgRef.current) {
                imgRef.current.addEventListener('load', async () => {
                    const color = await getColorFromImage(imgRef.current);
                    handleState("color", color);
                });
            }
        });

        return () => {
            if (imgRef.current) {
                imgRef.current.removeEventListener('load', async () => {
                    const color = await getColorFromImage(imgRef.current);
                    handleState("color", color);
                });
            }
        };
    }, [props.type]);

    useEffect(() => {
        if (state.sanglist&&state.sanglist.length > 0) {
            GetSingleAlbum(state.sanglist);
        }
        if (imgRef.current) {
            imgRef.current.addEventListener('load', async () => {
                const color = await getColorFromImage(imgRef.current);
                handleState("color", color);
            });
        }
    }, [state.sanglist]);

    useEffect(() => {
        if (imgRef.current && imgRef.current.complete) {
            (async () => {
                const color = await getColorFromImage(imgRef.current);
                handleState("color", color);
            })();
        }
    }, [state.cover]);
    
    useEffect(() => {
    	async function GetCurrentTags() {
            var res = await GetSangListTag({lid:state.sanglist_id});
            handleState("current_tags",res.data)
            
    	}
        GetCurrentTags();
    }, [state.show_modal]);

      return (
          
          <div className=" m-8 relative z-0  space-y-5 rounded-2xl h-auto flex flex-col "
           
          >
              {props.type==="author"&& <div className={` absolute w-full h-96 z-10`}>
                  <img alt={`img`} src={`http://${state.cover}`}
                       className={` rounded-2xl z-10 absolute w-full h-full object-cover `}/>
                  <div
                      className="absolute inset-0 rounded-2xl z-20
                 bg-gradient-to-t from-black/70 via-black/30 to-transparent"
                  />
              </div>}
              {props.type === "author" &&
                  <div className={`absolute w-full top-8 h-full`} style={{backgroundImage: `linear-gradient(${state.color}, transparent)`}} ></div>}
              <div className={`w-full h-auto rounded-2xl p-8 space-y-5 z-30  `} style={props.type!=="author"?{backgroundImage: `linear-gradient(${state.color}, transparent)`}:{}}>
                  
              <Modal show={state.show_modal} onClick={() => handleState("show_modal", false)}>
                  <div className={`p-6 flex flex-col w-2/5 h-3/5 bg-deep-gary space-y-6 rounded-2xl`}
                       onClick={e => e.stopPropagation()}>
                      <div className={`w-full text-2xl`}>编辑歌单</div>
                      <div className={`flex flex-row w-full h-1/2 justify-between`}>
                          <div className={`w-1/3`}>
                              <label
                                  className="w-full h-full border-2 border-dashed border-white bg-deep-gary  rounded-2xl flex flex-col items-center object-cover bg-cover justify-center cursor-pointer shadow-2xl"
                                  style={{backgroundImage: `url(http://${state.cover})`, backgroundSize: 'cover'}}>
                                  <span className="text-sky-400 font-semibold">Click To Upload</span>
                                  <span
                                      className="text-sm text-white">Limited One File, The New Will Replace Old One</span>
                                  <input
                                      ref={edit_uploadRef}
                                      type="file"
                                      className="hidden"
                                      onChange={(e) => handleEditUploadChange(e)}
                                  />
                              </label>
                              {state.edit_fileName && <div>{state.edit_fileName}</div>}
                          </div>

                          <div className={`w-3/5 flex flex-col h-auto space-y-6`}>
                              <div className={`w-full h-auto items-center flex flex-row space-x-6`}>
                                  <div className={`w-1/5 flex-nowrap`}>标题:</div>
                                  <input
                                      type={"text"}
                                      className={`h-10 w-4/5 p-3 bg-opacity-10 bg-white rounded-sm`}
                                      value={state.edit_title}
                                      onChange={(e) => handleState("edit_title", e.target.value)}
                                  />
                              </div>
                              <div className={`w-full h-auto items-center flex flex-row space-x-6`}>
                                  <div className={`w-1/5`}>描述:</div>
                                  <textarea
                                      className={`h-20 max-h-32 w-4/5  p-3 bg-opacity-10 bg-white rounded-sm`}
                                      value={state.edit_description}
                                      onChange={(e) => handleState("edit_description", e.target.value)}
                                  />
                              </div>
                          </div>
                      </div>
                      <div className={`w-full flex flex-col space-y-6`}>
                          <div className={`h-auto ml-3 w-full flex flex-row items-center space-x-4`}>
                              <div>已添加:</div>
                              {state.current_tags && state.current_tags.map((item, index) => (
                                  <SangListTag key={index} context={item} Onclick={() => DropTag(item)}></SangListTag>
                              ))}
                          </div>
                          <div className={` flex flex-row items-center justify-between relative`}>
                              <mdui-text-field
                                  onClick={() => {
                                      handleState("show_tagList", true)
                                  }}
                                  value={state.tag_search} onInput={Edit_TagInputChange}
                                  className={`ml-3 w-1/2 mdui-theme-dark h-12`}
                                  variant="outlined"
                                  label={`输入并按下回车以添加首个匹配标签`}
                                  onKeyDown={async (event) => {
                                      event.key === "Enter" ? await AddTag(state.result_tags[0]) : {}
                                      handleState("show_tagList", false)
                                  }}
                              ></mdui-text-field>
                              <mdui-button className={`w-24`} onClick={SubmitUploadSangList}>保存</mdui-button>
                              <div
                                  onMouseLeave={() => handleState("show_tagList", false)}
                                  className={`w-1/3 h-32 bg-gray-700 absolute top-full flex ${!state.show_tagList && `hidden`} flex-col items-center p-2 rounded-2xl`}>
                                  {state.result_tags && state.result_tags.map((item, index) => (<div
                                      className={`w-full h-1/4 hover:bg-white hover:bg-opacity-10 rounded-xl`}
                                      onClick={() => AddTag(item)}
                                  >{item}</div>))}
                              </div>
                          </div>
                      </div>
                  </div>
              </Modal>
                
              <div className="w-full h-64 flex flex-row space-x-5  ">
                  {<img
                      ref={imgRef}
                      src={`http://${state.cover}`}
                      alt="img"
                      crossOrigin="anonymous"
                      className={` object-cover h-64 w-64 ${props.type==="author"?"rounded-full ":"rounded-2xl " }  shadow-2xl`}
                  />}
                  <div className="flex w-4/5 flex-col justify-end space-y-3">
                      <div className="text-2xl">{state.type}</div>
                      <div
                          className={`text-white text-7xl flex w-4/5 whitespace-nowrap text-overflow-ellipsis truncate ${state.creater === localStorage.getItem("uid") && `cursor-pointer`} `}
                          onClick={() => {
                              state.creater === localStorage.getItem("uid") && handleState("show_modal", true,)
                          }}>
                          {state.title}
                      </div>
                      {state.description && <div className="">{state.description}</div>}
                      {state.type === "专辑" && (
                          <div className="w-full flex flex-row">
                              <img className="h-8 w-8 rounded-full" src={`http://${state.author_avatar}`} alt="img"/>
                              <div className="text-xl font-bold hover:underline">{state.author_name}</div>
                          </div>
                      )}
                  </div>
              </div>
                  {state.type!=="recommend"&&<div className={`w-full flex ml-3 flex-row h-auto`}>
                      <GreenPlay onClick={ReplacePlayQueue} className={`hover:scale-105 hover:cursor-pointer transition-all duration-200`} w={`64`} h={`64`}></GreenPlay>
              </div>}
              <div className=" flex flex-row w-full justify-between">
                  <div className="w-2/3 ml-3 flex flex-row justify-between">
                      <div className={`flex w-full flex-row`}>
                          <div className="text-xl font-bold">#</div>
                          <div className="text-xl ml-10">标题</div>
                      </div>
                      <div className="text-xl items-start text-start w-1/4">专辑</div>
                  </div>
                  <div className="w-1/6  items-end">
                      <div className={`w-full text-xl  text-center`}>
                          时长
                      </div>
                  </div>
              </div>
              <mdui-divider className=""></mdui-divider>
              <div className="flex flex-col bg-opacity-5">
                  {state.sanglist && state.sanglist.map((item, index) => (
                      <ListItem
                          insanglist={true}
                          sid={item.id}
                          id={item.id}
                          displayIndex={true}
                          index={index}
                          key={index}
                          length={item.length}
                          src={item.cover}
                          title={item.title}
                          lid={state.sanglist_id}
                          author={item.author}
                          reflushSangList={GetSangListData}
                          album={state.album_name && state.album_name[index] ? state.album_name[index] : ""}
                      />
                  ))}
              </div>
              </div>
                  
          </div>

      );
}


export function SangListTag(props) {
    const [state, setState] = useState({
        ishover: false
    })
    const handleState = (name, value) => {
        setState(prevState =>({...prevState, [name]: value }))
    }

    return(
        <div className={`hover:cursor-pointer w-16 h-8 p-3 bg-gray-700 relative  rounded-3xl flex justify-center flex-row items-center`} 
             onMouseOver={()=>handleState("ishover",true)}
             onMouseLeave={()=>handleState("ishover",false)}
             >
            <div className={`w-full flex flex-row items-center justify-center`}>
                <div className={``}>{props.context}</div>
            </div>
            {state.ishover&&
               <div className={`w-full flex h-full justify-center absolute bg-gray-500  items-center rounded-3xl`}
                    onClick={props.Onclick}
               >
                   <SvgCancel w={`16`} h={`16`}></SvgCancel>
               </div>         
            }

        </div>
    )
}
