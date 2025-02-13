import { useRef, useState } from "react"; 
import { SvgCancel } from "../../assets/svg/Cancel"; 
import {$httpFormData, UploadNewSingle} from "../http/FormDataApi"; 
import {ChooseBar} from "../layouts/ChooseBar"; 
import {QueryList} from "../http/queryApi"; 
import {debounce} from "next/dist/server/utils"; 
import Modal from "../layouts/Modal"; 
import {CreateAuthor} from "../layouts/CreateAuthor"; 
import {AddTagToSang, CreateTag,DropTagFromSang,EraseTag, GetAllTags, GetSangTags} from "../http/recommendApi"; 
import {TagBottom} from "../layouts/TagButtom";
import * as PropTypes from "prop-types"; 
import {SangTag} from "../layouts/SangTag";
import {useNotification} from "../NotificationProvider";
import {globalLoadControl} from "../../lib/loadControl"; 

 export function EditSinglePage(props) {
    const SingleRef = useRef(null);
    const CoverRef = useRef(null);
    var {showNotification}= useNotification()
    const [state, setState] = useState({
        coverFileName: "",
        singleFileName: "",
        author: "",
        title: "",
        cover_file: null,
        single_file: null,
        displaySearchBar: false,
        displayNameBar:false,
        sang_list:[],
        author_list:[],
        current_single: null,
        isEdit: !props.create,
        displayModal:false,
        current_tags:[],
        all_tags:[],
        create_tag:false,
        tag_form:"",
        eraseTag_Modal:false,
        eraseTag_index:0
    });

    const handleState = (name, value) => {
        setState(prevState => ({ ...prevState, [name]: value }));
        
    };

    const handleCoverChange = (e) => {
        if (e.target.files.length > 0) {
            handleState("coverFileName", e.target.files[0].name);
            handleState("cover_file", e.target.files[0]);
        }
    };

    const handleSingleChange = (e) => {
        if (e.target.files.length > 0) {
            handleState("singleFileName", e.target.files[0].name);
            handleState("single_file", e.target.files[0]);
        }
    };

    const CancelUploadCover = () => {
        if (CoverRef.current) {
            CoverRef.current.value = null;
            handleState("coverFileName", "");
            handleState("cover_file", null);
        }
    };
    const HandleSearch=useRef(
        debounce(async (keyword, target)=>{
            const res = await QueryList({
                target: target,
                begin: 0,
                size: target==="author"?3:4, 
                keyword: keyword,
            });
            if(target==="single")handleState("sang_list",res.data)
            else handleState("author_list",res.data)
        },1000)
    ).current
    
    const SangInputChange= async (event)=>{
        handleState("displaySearchBar",true)
        await HandleSearch(event.target.value,"single");
    }
    const AuthorInputChange=async (event)=>{
        handleState("displayNameBar",true)
        await HandleSearch(event.target.value,"author")
    }
    
    const ToEdit=async (index)=>{
        var res = await GetSangTags({sid:state.sang_list[index].id}); 
        handleState("current_tags",res.data)
        res= await GetAllTags({})
        handleState("all_tags",res.data)
        handleState("current_single",state.sang_list[index]);
        handleState("title",state.sang_list[index].title)
        handleState("cover_file",null)
        handleState("single_file",null);
        handleState("author",state.sang_list[index].author)
        handleState("isEdit",true);
    }
    const ToCreate=()=>{
        handleState("current_single",null);
        handleState("title","")
        handleState("author","")
        handleState("isEdit",false);
    }
    
    const HandleCreateAuthor=()=>{
        handleState("create_tag",false)
        handleState("displayModal",true)
    }
    
    const CancelUploadSingle = () => {
        if (SingleRef.current) {
            SingleRef.current.value = null;
            handleState("singleFileName", "");
            handleState("single", null);
        }
    };

    const handleSubmit = async () => {
        globalLoadControl.show()
        const formData = new FormData();
        if (state.cover_file) {
            formData.append("cover", state.cover_file, state.coverFileName);
        }
        if (state.single_file) {
            formData.append("sang", state.single_file, state.singleFileName);
        }
        formData.append("author", state.author);
        formData.append("title", state.title);
        if(!state.isEdit){
            await $httpFormData(formData, "/file/single").then(res=>{
                if(res.msg==="Ac"){
                    handleState("current_single",null);
                    handleState("title","")
                    handleState("author","")
                    showNotification("success","歌曲上传成功")
                }else{
                    showNotification("error",res.msg)
                }
            })
        }
        else{
            formData.append("sid",state.current_single.id)
            const res = await $httpFormData(formData,"/file/update/single");
            if(res.msg==="Ac"){
                showNotification("success","歌曲信息已更新")
            }else{
                showNotification("error",res.msg)
            }
        } 
        globalLoadControl.hide()
    };
    const FetchCurrentTag=async ()=>{
        let res = await GetSangTags({sid:state.current_single.id}); 
        handleState("current_tags",res.data)
        res= await GetAllTags({})
        handleState("all_tags",res.data)
    }
    const handleNewTagSubmit=async ()=>{
        await CreateTag({name:state.tag_form})
        await FetchCurrentTag()
        handleState("displayModal",false)
    }
    const DeleteChooseTag=async (index)=>{
        await DropTagFromSang({sid:state.current_single.id,tag:state.current_tags[index]})
        await FetchCurrentTag()       
    }
    const ChooseTag=async (index)=>{
        await AddTagToSang({sid:state.current_single.id,tag:state.all_tags[index].name})
        await FetchCurrentTag() 
    }
    const eraseTag=async ()=>{
        await EraseTag({tag:state.all_tags[state.eraseTag_index].name})
        handleState("eraseTag_Modal",false)
        await FetchCurrentTag() 
    }
    const ConfirmEraseTag=async (index)=>{
        handleState("eraseTag_Modal",true)
        handleState("eraseTag_index",index)   
    }

    return (
        <div className={`w-full flex justify-center items-center bg-black text-white p-8`}>
        <Modal show={state.displayModal} onClick={()=>{handleState("displayModal",false)}}>
            {!state.create_tag?<CreateAuthor
            exit={()=>{handleState("displayModal",false)}}
            ></CreateAuthor>:
            <div onClick={e=>{e.stopPropagation()}} className={`justify-between w-1/3 h-1/4 p-5 bg-deep-gary rounded-xl flex flex-col items-center `}>
                <div className={`text-2xl`}>新建标签</div>
                <mdui-text-field
                 className={`w-full h-12 mdui-theme-dark bg-transparent`}
                 variant="outlined"
                 onChange={e=>{handleState("tag_form",e.target.value)}}       
                 value={state.tag_form}
                ></mdui-text-field>
                <mdui-button className={`w-1/5`} onClick={handleNewTagSubmit}>提交</mdui-button>
            </div>
            }
        </Modal>
        <Modal show={state.eraseTag_Modal} onClick={()=>{handleState("eraseTag_Modal",false)}}>
           { state.all_tags[state.eraseTag_index]&&<div className={`absolute justify-between  w-1/4 h-1/4 space-y-6 top-1/4 p-5 bg-deep-gary rounded-xl flex flex-col items-center `} onClick={e=>e.stopPropagation()}>
                <div className={`shadow-xl w-full text-center items-center justify-center text-xl flex`}>确定删除标签"<div className={`text-sky-400`}>{state.all_tags[state.eraseTag_index].name}"</div>吗?</div>
                <div className={`w-full text-start`}>此操作会同时删除其他歌曲中的此标签</div>
                <div className={`w-2/3 flex flex-row-reverse justify-between`}>
                    <mdui-button onClick={eraseTag}>确定</mdui-button>
                    <mdui-button variant={"tonal"} onClick={()=>handleState("eraseTag_Modal",false)}>取消</mdui-button>
                </div>               
            </div>}
        </Modal>
            <div className={`w-4/5 flex flex-col h-full space-y-8 bg-gray-800 p-8 rounded-md`}>
                <div className={`w-full h-8 flex flex-row items-center justify-between`}>
                    <div className={`text-2xl font-bold`}>{!state.isEdit ? `Upload New Single` : `Edit Single:${state.current_single.id}`}</div>
                    <div className={`relative w-1/2 flex justify-end`}>
                        <mdui-text-field
                            onInput={SangInputChange}
                            onMouseOver={() => { handleState("displaySearchBar", true); }}
                            className={`w-1/3 h-3/4 mdui-theme-dark bg-transparent`}
                            variant="outlined"
                            label="搜索以编辑歌曲">
                        </mdui-text-field>
                        {state.displaySearchBar && (
                            <ChooseBar 
                                mouseleave={() => { handleState("displaySearchBar", false); }}
                                list={state.sang_list}
                                clickItem={(index)=>{ToEdit(index)}} 
                                className={`absolute top-full mt-1 w-48 h-44 p-2  bg-gray-900 rounded-xl shadow-2xl`} ></ChooseBar>
                        )}
                    </div>
                </div>
                <mdui-divider></mdui-divider>
                {!state.isEdit?<label className={`flex flex-col space-y-2`}>
                    音频文件:
                    <input
                        ref={SingleRef}
                        type={`file`}
                        className={`bg-gray-700 text-white rounded p-2`}
                        onChange={handleSingleChange}
                    />
                    {state.singleFileName && (
                        <div className="items-center flex justify-between hover:bg-gray-700 w-full hover:rounded-xl hover:border-dashed mt-2 text-gray-300">
                            {state.singleFileName}
                            <SvgCancel w={"16"} h={"16"} onClick={CancelUploadSingle}></SvgCancel>
                        </div>
                    )}
                </label>:<mdui-button className={`w-1/6`} onClick={ToCreate}>回到新建</mdui-button>}
                <div className={`w-full h-52 flex-row flex justify-between items-center`}>
                    {state.isEdit ? (
                        <img src={`http://${state.current_single.cover}`} alt={`img`} className={`w-48 h-48 object-cover rounded-md`} />
                    ) : null}
                    <div className={`flex flex-col items-center`}>
                        <label className={`w-48 h-52 border-2 border-dashed border-sky-400 bg-gray-700 rounded-2xl flex flex-col items-center justify-center cursor-pointer`}>
                            <span className={`text-sky-400`}>Click To Upload</span>
                            <span className={`text-sm text-gray-400`}>Limited One File, The New Will Replace Old One</span>
                            <input
                                ref={CoverRef}
                                type={`file`}
                                className={`hidden`}
                                onChange={handleCoverChange}
                            />
                        </label>
                        {state.coverFileName && (
                            <div className="items-center flex justify-between hover:bg-gray-700 w-full hover:rounded-xl hover:border-dashed mt-2 text-gray-300">
                                {state.coverFileName}
                                <SvgCancel w={"16"} h={"16"} onClick={CancelUploadCover}></SvgCancel>
                            </div>
                        )}
                    </div>
                </div>
                <label className={`flex flex-col space-y-2`}>
                    标题:
                    <input
                        onChange={(e) => handleState(e.target.name, e.target.value)}
                        value={state.title}
                        name={`title`}
                        type={`text`}
                        className={`bg-gray-700 text-white rounded p-2`}
                    />
                </label>
                <label className={` relative flex flex-col space-y-2`}>
                <a  onClick={HandleCreateAuthor} className={`absolute right-3 top-full mt-3 hover:text-sky-400 hover:underline hover:cursor-pointer`}>没有找到现有的该作者?</a>
                    {state.displayNameBar&&<ChooseBar
                        className={`absolute p-3 rounded-xl overflow-hidden top-full z-50 w-72 h-32 bg-gray-900`}
                        list={state.author_list}
                        mouseleave={()=>{handleState("displayNameBar",false)}}
                        clickItem={(index)=>{
                            handleState("author",state.author_list[index].name);
                            handleState("displayNameBar",false)
                        }}
                        ></ChooseBar>}
                    作者:
                    <input
                        onChange={(e) => handleState(e.target.name, e.target.value)}
                        onInput={AuthorInputChange}
                        onFocus={() => { handleState("displayNameBar", true); }}
                        value={state.author}
                        name={`author`}
                        type={`text`}
                        className={`bg-gray-700 text-white rounded p-2`}
                    />
                    
                </label>
                {state.isEdit&&<label>
                    标签:
                    <div className={`w-full  rounded-xl flex flex-col space-y-3 p-3 relative`}>
                        <div className={`w-full  flex flex-col`}>
                            <div className={`h-full w-1/6`}>已包含:</div>
                            <div className={`w-full flex flex-row flex-wrap `}>
                            {state.current_tags&&state.current_tags.map((item,index)=>(
                                <SangTag
                                onClick={()=>DeleteChooseTag(index)}
                                choose={true}
                                key={index}
                                context={item}
                                ></SangTag>
                            ))}
                            </div>
                        </div>
                        <div className={`w-full  flex flex-col`}>
                            <div className={`h-full w-1/6`}>未添加:</div>
                            <div className={`w-full flex flex-row flex-wrap `}>
                            {state.all_tags&&state.all_tags.map((item,index)=>(
                                (!state.current_tags||(!state.current_tags.includes(item.name)))&&
                                <SangTag
                                onClick={()=>ChooseTag(index)}
                                choose={false}
                                key={index}
                                context={item.name}
                                extraClick={()=>ConfirmEraseTag(index)}
                                ></SangTag>
                            ))}         
                            </div>               
                        </div>
                        <div 
                        className={`w-full text-end cursor-pointer hover:underline hover:text-sky-400`}
                        onClick={()=>{
                            handleState("create_tag",true)
                            handleState("displayModal",true)
                        }}
                        >想要新标签?</div>
                        
                    </div>
                </label>}
                <label className={`flex w-full justify-center items-center`}>
                    <mdui-button onClick={handleSubmit} className={`w-32 `}>
                        上传
                    </mdui-button>
                </label>
                
            </div>
        </div>
    );
}
