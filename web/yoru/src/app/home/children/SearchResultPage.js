import { useState, useEffect } from "react"; 
import { QueryList } from "../../components/http/queryApi"; 
import { TagBottom } from "../../components/layouts/TagButtom"; 
import { ListItem } from "../../components/layouts/ListItem"; 
import {PageIndexer} from "../../components/layouts/PageIndexer"; 
import {RowCircleItem} from "../../components/layouts/RowCircleItem"; 
import {RowCardItem} from "../../components/layouts/RowCardItem"; 
import {$httpFormData} from "../../components/http/FormDataApi";
import {GreenAdvance} from "../../assets/svg/GreenAdvance";
import {GreenPlay} from "../../assets/svg/GreenPlay";
import {emitter} from "next/client";
import {CompareStrings} from "../../lib/CompareStrings"; 

export function SearchResultPage(props) {
    const [state, setState] = useState({
        single_peace:4,
        single_list: [],
        author_list: [],
        album_list: [],
        single_album_name:[],
        sanglist_list:[],
        single_length:0,
        author_length:0,
        album_length:0,
        sanglist_length:0,
        single_offset:0,
        author_offset:0,
        album_offset:0,
        sanglist_offset:0,
        target: "single",
        display: "单曲",
        hot_obj:"",
        hot_target:null,
    });
    const [hoverHot,SetHoverHot] = useState(false);
    
    const handleState = (name, value) => {
        setState(prevState => ({ ...prevState, [name]: value }));
    };
    
    
    const HandlePartition = (target, peace, next) => {
        switch(target){
            case "single":
                if (next && state.single_offset + peace < state.single_length) {
                    handleState("single_offset", state.single_offset + peace);
                } else if (!next && state.single_offset - peace >= 0) {
                    handleState("single_offset", state.single_offset - peace);
                }
                return;
            case "album":
                if (next && state.album_offset + peace < state.album_length) {
                    handleState("album_offset", state.album_offset + peace);
                } else if (!next && state.album_offset - peace >= 0) {
                    handleState("album_offset", state.album_offset - peace);
                }
                return;
            case "author":
                if (next && state.author_offset + peace < state.author_length) {
                    handleState("author_offset", state.author_offset + peace);
                } else if (!next && state.author_offset - peace >= 0) {
                    handleState("author_offset", state.author_offset - peace);
                }
                return;
            case "sanglist":
               if (next && state.author_offset + peace < state.author_length) {
                   handleState("author_offset", state.author_offset + peace);
               } else if (!next && state.author_offset - peace >= 0) {
                   handleState("author_offset", state.author_offset - peace);
               }
               return;
        }
    }
        const GoToListDetail=(index)=>{
            props.golist(state.sanglist_list[index],"sanglist")
        }
        const GoToAlbumDetail=(index)=>{
            emitter.emit("GoAlbumDetail",{title:state.album_list[index].title})
        
        }
        
    const GetSingleAlbum = async (sanglist) => {
        const ids = sanglist.map(item => item.album_id);
        const formData = new FormData();
        formData.append("ids", ids);
        const res = await $httpFormData(formData, "/query/album/names");
        handleState("single_album_name", res.data);
    }
        useEffect(() => {
            const fetchName=async ()=>{
                 if (state.single_list&&state.single_list.length > 0) {
                     await GetSingleAlbum(state.single_list);
                 }   
            }
            fetchName().then(r =>{} )
        }, [state.sanglist_list]);
    
    
    const search = async (target, size,struct,setStruct) => {
        await QueryList({
            target: target,
            begin: 0,
            size: size,
            keyword: props.keyword
        }).then(res => {
            handleState(`${target}_list`, res.data);
            handleState(`${target}_length`, res.length);
            if(props.keyword===""&&target==="single"){setStruct(1,"single",res.data[0])}
            if(res.length>0){
                const new_score = CompareStrings(props.keyword,target!=="author"?res.data[0].title:res.data[0].name);
                if(struct.score<new_score){
                    setStruct(new_score,target,res.data[0])
                }
            }
        });
    };
    
   
    useEffect(() => {
        const fetchData = async () => {
            var struct={
                score:0,
                target:"404",
                obj:{
                    id:"",
                    avatar:"",
                    cover:"",
                    title:"未找到相关结果",
                    name:"未找到相关结果"
                }
            }
            function SetStruct(new_score,target,obj){
                struct.score=new_score
                struct.target=target
                struct.obj=obj
            }
            await search("album", 10,struct,SetStruct);
            await search("single", 10,struct,SetStruct);
            await search("author", 10,struct,SetStruct);
            await search("sanglist",10,struct,SetStruct);
            handleState("hot_target",struct.target)
            handleState("hot_obj",struct.obj)
        };
        fetchData();
    }, [props.keyword]);
    
    
    const canGoNext = (target) => {
        switch(target) {
            case "single":
                return state.single_offset + 4 < state.single_length;
            case "album":
                return state.album_offset + 4 < state.album_length;
            case "author":
                return state.author_offset + 5 < state.author_length;
            default:
                return false;
        }
    };
    
    const canGoPrev = (target) => {
        switch(target) {
            case "single":
                return state.single_offset - 4 >= 0;
            case "album":
                return state.album_offset - 4 >= 0;
            case "author":
                return state.author_offset - 5 >= 0;
            default:
                return false;
        }
    };
    const HotChangePlay= async ()=>{
        await  emitter.emit("AddPlayQueue",{sid:state.hot_obj.id,target:"replace"});
    }
    const HotGoAuthorDetail=async ()=>{
        await  emitter.emit("GoAuthorDetail",{name:state.hot_obj.name})
    }
    const HotGoAlbumDetail=async ()=>{
        await  emitter.emit("GoAlbumDetail",{title:state.hot_obj.title})
    }
    const HotGoToListDetail=()=>{
        props.golist(state.hot_obj,"sanglist")
    }
    return (
        <div className={`w-full p-5 items-center flex flex-col `}>
            <div className={` w-full flex flex-col bg-white bg-opacity-10 min-h-screen rounded-2xl`}>
                <div className={`m-8 rounded-2xl flex flex-row justify-between`}>
                    <div className={`flex w-2/5 space-y-5 flex-col`}>
                        <div className={`text-4xl`}>热门结果</div>
                        <div
                            className={`flex flex-col max-h-full relative overflow-hidden bg-white bg-opacity-5 rounded-2xl w-full transition-all duration-500 hover:bg-opacity-15`}
                            onMouseLeave={() => SetHoverHot(false)}
                            onMouseOver={() => SetHoverHot(true)}
                        >
                            {
                                <div className={`m-8 h-full flex flex-col space-y-5`}>
                                    <img src={ state.hot_obj.title!=="未找到相关结果"?
                                        `http://${state.hot_target==="author"?state.hot_obj.avatar:state.hot_obj.cover}`:
                                        `https://th.bing.com/th/id/OIP.qudkIAOf2O65DX8t-CLe2gHaFS?rs=1&pid=ImgDetMain`
                                    } alt="img"
                                         className={`h-36 w-36 object-cover rounded-2xl`}/>
                                    <div className={`text-5xl `}>{state.hot_target==="author"?state.hot_obj.name:state.hot_obj.title}</div>
                                    <div className={`text-xl `}>{state.hot_target==="author"?"艺术家":state.hot_target==="sanglist"?"歌单":state.hot_target==="album"?"专辑":"单曲"}</div>
                                </div>
                            }
                            <div
                                className={`absolute bg-white right-6 ${hoverHot ? `-translate-y-12 opacity-100` : `translate-y-16 opacity-0`} duration-300  bottom-0 rounded-full`}>
                                {
                                    state.hot_target==="single"?<GreenPlay  onClick={HotChangePlay} className={`hover:cursor-pointer`} w={`64`} h={`64`}></GreenPlay>:
                                        <GreenAdvance className={`hover:cursor-pointer`} onClick={()=>{
                                            state.hot_target==="author"?HotGoAuthorDetail():
                                                state.hot_target==="album"?HotGoAlbumDetail():
                                                    HotGoToListDetail()
                                        }} w={`64`} h={`64`}></GreenAdvance>
                                }
                            </div>
                        </div>
                    </div>
                    <div className={`w-2/5 space-y-5 flex-col`}>
                        <div className={`text-4xl`}>歌曲</div>
                        <div className={`h-80`}>
                            {state.single_list && state.single_list.slice(state.single_offset, state.single_offset + 4).map((item, index) => (
                                <ListItem sid={item.id} id={item.id} displayIndex={false} key={index}
                                          length={item.length} src={item.cover} title={item.title} author={item.author}
                                          album={state.single_album_name[state.single_offset + index]}/>
                            ))}
                        </div>
                        <PageIndexer
                            className={`w-full items-center flex flex-row justify-between`}
                            length={state.single_length}
                            next={canGoNext("single") ? () => HandlePartition("single", 4, true) : null}
                            pre={canGoPrev("single") ? () => HandlePartition("single", 4, false) : null}
                            offset={state.single_offset}
                            peace={state.single_peace}>
                        </PageIndexer>
                    </div>
                </div>
                <div className={` m-5 space-y-5 flex flex-col`}>
                    <div className={`text-4xl`}>艺人</div>
                    <div className={`w-full flex flex-row`}>
                        {
                            state.author_list && state.author_list.slice(state.author_offset, state.author_offset + 5).map((item, index) => (
                                <RowCircleItem rounded={true} key={index} name={item.name} src={item.avatar}
                                               className={`w-60 p-5 hover:bg-white hover:bg-opacity-10 duration-200 transition-all rounded-xl relative`}></RowCircleItem>
                            ))
                        }
                    </div>
                </div>
                <div className={`m-5 space-y-5 flex flex-col`}>
                    <div className={`text-4xl`}>歌单</div>
                    <div className={`w-full flex flex-row space-x-6 items-start`}>
                        {
                            state.sanglist_list && state.sanglist_list.slice(state.sanglist_offset, state.sanglist_offset + 5).map((item, index) => (
                                <RowCardItem className={``} onClick={() => {
                                    GoToListDetail(index)
                                }} key={index} name={item.title} src={item.cover}></RowCardItem>
                            ))
                        }
                    </div>
                </div>
                <div className={`m-5 space-y-5 flex flex-col`}>
                    <div className={`text-4xl`}>专辑</div>
                    <div className={`w-full flex flex-row space-x-6 items-start`}>
                        {
                            state.album_list && state.album_list.slice(state.album_offset, state.album_length + 5).map((item, index) => (
                                <RowCardItem className={``} onClick={() => {
                                    GoToAlbumDetail(index)
                                }} key={index} name={item.title} src={item.cover}></RowCardItem>
                            ))
                        }
                    </div>
                </div>


            </div>

        </div>
    );
}
