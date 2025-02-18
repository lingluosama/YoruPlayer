import { TagBottom } from "../../components/layouts/TagButtom";
import { useEffect, useState } from "react";
import { QueryList } from "../../components/http/queryApi"; 
import { TowRowStripDisplayer } from "../../components/layouts/TowRowStripDisplayer"; 
import {GetUserInfo} from "../../components/http/userApi"; 
import {GetRecommendSang} from "../../components/http/recommendApi"; 
import {PlayAbleCard} from "../../components/layouts/PlayAbleCard"; 
import {emitter} from "next/client"; 
import {RowCardItem} from "../../components/layouts/RowCardItem"; 
import {RowCircleItem} from "../../components/layouts/RowCircleItem";
import {OnLoad} from "../../components/pages/OnLoad";

export function MainPage(props) {
    const Tags = ["单曲", "专辑", "歌单"];
    const [state, setState] = useState({
        display: "单曲",
        t_list: [],
        current_user:null,
        rec_list:[],
        rec_author:[],
        rec_sanglist:[]
    });

    const handleState = (name, value) => {
        setState(preState => ({ ...preState, [name]: value }));
    };
    
    const GoToListDetail=(index)=>{
        switch (state.display){
            case "单曲":
                return
            case "专辑":
                props.golist(state.t_list[index],"album")
                return;
            case "歌单":
                props.golist(state.t_list[index],"sanglist")
        }
    }

    const ChangeDisplay = async (name) => {
        switch (name) {
            case "单曲":
                return QueryList({
                    target: "single",
                    size: 8,
                    keyword: "",
                    begin: 0
                });
            case "专辑":
                return QueryList({
                    target: "album",
                    size: 8,
                    keyword: "",
                    begin: 0
                });
            case "歌单":
                return QueryList({
                    target: "sanglist",
                    size: 8,
                    keyword: "",
                    begin: 0
                });
            default:
                return Promise.resolve([]);
        }
    };
    //推荐绿按钮切歌
    const ChangePlay=async (sid)=>{
        emitter.emit("AddPlayQueue",{sid:sid,target:"replace"});
    }
    const GoSangList=(index)=>{
        props.golist(state.rec_sanglist[index],"sanglist")
    }
    const handleTagClick = async (item) => {
        handleState("display", item);
        const result = await ChangeDisplay(item).then(res => res.data);
        handleState("t_list", result);
    };

    useEffect(() => {
        const fetchData = async () => {
            const result = await ChangeDisplay(state.display).then(res => res.data);
            handleState("t_list", result);
        };
        fetchData();
    }, [state.display]);
    useEffect(() => {
    	const GetUserData = async () => {
            var uid = localStorage.getItem("uid");
            if(uid) {
                var res = await GetUserInfo({uid:uid});
                handleState("current_user",res.data);
            }
            res = await GetRecommendSang({uid:uid,target:"single"});
            handleState("rec_list",res.data);
            res = await GetRecommendSang({uid:uid,target:"author"});
            handleState("rec_author",res.data);
            res = await GetRecommendSang({uid:uid,target:"sanglist"});
            handleState("rec_sanglist",res.data);
    	}
        GetUserData()
    }, []);
    

    return (
        <div className="items-center  flex h-auto p-5 flex-col">
            <div className="bg-gray-900 p-5 rounded-2xl w-full min-h-screen">
                <div className="flex flex-row space-x-7 w-full justify-start">
                    {
                        Tags.map((item, index) => (
                            <div key={index}>
                                <TagBottom text={item} choose={item === state.display} onclick={() => handleTagClick(item)} />
                            </div>
                        ))
                    }
                </div>
                <div className={`w-full mt-6`}>
                    <TowRowStripDisplayer  goDetail={GoToListDetail} list={state.t_list}></TowRowStripDisplayer>
                </div>
                <div className={`w-full flex-col mt-6 space-y-3`}>
                    {state.current_user&&<div className={`text-2xl`}>根据{state.current_user.name}的喜好推荐</div>}
                    <div className={`w-full p-3 overflow-hidden flex flex-row  space-x-6`}>
                        {state.rec_list&&state.rec_list.map((item, index) => (
                            <PlayAbleCard clcickButton={()=>ChangePlay(item.id)} key={index} title={item.title} cover={item.cover} author={item.author} 
                            className={`w-48 h-52 p-4 hover:bg-white transition-all duration-300 hover:bg-opacity-10 rounded-lg`}></PlayAbleCard>
                        ))}
                    </div>
                </div>
                <div className={`w-full flex-col overflow-hidden`}>
                    {state.current_user&&<div className={`text-2xl`}>百听不厌</div>}
                    <div className={`flex flex-row w-full space-x-6 p-3`}>
                    {
                     state.rec_author&&state.rec_author.map((item, index) => (
                            <RowCircleItem rounded={true} key={index} name={item.name} src={item.avatar} className={` w-48  h-52 transition-all duration-300  p-3 hover:bg-white hover:bg-opacity-10 rounded-xl`}></RowCircleItem>
                        ))
                    }
                    </div>
                </div>
                <div className={`w-full flex-col overflow-hidden`}>
                    {state.current_user&&<div className={`text-2xl`}>发现更多</div>}
                    <div className={`flex flex-row w-full space-x-6 p-3`}>
                    {
                        state.rec_sanglist&&state.rec_sanglist.map((item, index) => (
                            <RowCircleItem golist={()=>GoSangList(index)} rounded={false} className={` w-48  h-52 transition-all duration-300  p-3 hover:bg-white hover:bg-opacity-10 rounded-xl`}  key={index} name={item.title} src={item.cover}></RowCircleItem>
                        ))
                    }
                    </div>
                </div>
            </div>
        </div>||<OnLoad></OnLoad>
    );
}
