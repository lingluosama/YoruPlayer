import { useState, useEffect } from "react"; 
import { QueryList } from "../../components/http/queryApi"; 
import { TagBottom } from "../../components/layouts/TagButtom"; 
import { ListItem } from "../../components/layouts/ListItem"; 
import {PageIndexer} from "../../components/layouts/PageIndexer"; 
import {RowCircleItem} from "../../components/layouts/RowCircleItem"; 
import {RowCardItem} from "../../components/layouts/RowCardItem"; 
import {$httpFormData} from "../../components/http/FormDataApi"; 

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
        display: "单曲"
    });

    const handleState = (name, value) => {
        setState(prevState => ({ ...prevState, [name]: value }));
    };
    
    const search = async (target, size) => {
        await QueryList({
            target: target,
            begin: 0,
            size: size,
            keyword: props.keyword
        }).then(res => {handleState(`${target}_list`, res.data);handleState(`${target}_length`, res.length)});
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

    useEffect(() => {
        const fetchData = async () => {
            await search("album", 10);
            await search("single", 10);
            await search("author", 10);
            await search("sanglist",10)
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

    return (
        <div className={`w-full p-5 items-center flex flex-col `}>
            <div className={` w-full flex flex-col bg-white bg-opacity-10 min-h-screen rounded-2xl`}>
                <div className={`m-8 rounded-2xl flex flex-row justify-between`}>
                    <div className={`flex w-2/5 space-y-5 flex-col`}>
                        <div className={`text-4xl`}>热门结果</div>
                        <div className={`flex flex-col max-h-full bg-white bg-opacity-5 rounded-2xl w-full`}>
                            { state.single_list&&(state.single_list.length > 0 ? (
                                <div className={`m-8 h-full flex flex-col space-y-5`}>
                                    <img src={`http://${state.single_list[0].cover}`} alt="img" className={`h-36 w-36 object-cover rounded-2xl`} />
                                    <div className={`text-5xl hover:underline cursor-pointer`}>{state.single_list[0].title}</div>
                                    <div className={`text-xl hover:underline cursor-pointer`}>{state.single_list[0].author}</div>
                                </div>
                            ) : (
                                <div>无搜索结果</div>
                            ))}
                        </div>
                    </div>
                    <div className={`w-2/5 space-y-5 flex-col`}>
                        <div className={`text-4xl`}>歌曲</div>
                        <div className={`h-80`}>
                            {state.single_list&&state.single_list.slice(state.single_offset, state.single_offset + 4).map((item, index) => (
                                <ListItem sid={item.id} id={item.id} displayIndex={false} key={index} length={item.length} src={item.cover} title={item.title} author={item.author} album={state.single_album_name[state.single_offset+index]}  />
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
                    <div className={`w-full flex flex-row justify-between`}>
                    {
                     state.author_list&&state.author_list.slice(state.author_offset, state.author_offset + 5).map((item, index) => (
                            <RowCircleItem key={index} name={item.name} src={item.avatar} className={`w-60`}></RowCircleItem>
                        ))
                    }
                    </div>
                </div>  
                <div className={`m-5 space-y-5 flex flex-col`}>
                     <div className={`text-4xl`}>歌单</div>
                    <div className={`w-full flex flex-row justify-between`}>
                    {
                       state.sanglist_list&&state.sanglist_list.slice(state.sanglist_offset, state.sanglist_offset + 5).map((item, index) => (
                            <RowCardItem   onClick={()=>{GoToListDetail(index)}} key={index} name={item.title} src={item.cover}></RowCardItem>
                        ))
                    }
                    </div>                            
                </div>
                  
                         
            </div>
            
        </div>
    );
}
