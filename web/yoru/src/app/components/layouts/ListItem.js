import {SvgAdd} from "../../assets/svg/Add"; 
import {useEffect, useState} from "react"; 
import {SvgMore} from "../../assets/svg/More"; 
import {emitter} from "next/client"; 
import {SvgWillPlay} from "../../assets/svg/WillPlay";
import {useAddPlaylist} from "../providers/AddPlaylistProvider";
import {SvgRemove} from "../../assets/svg/Remove";
import {DeleteFormSangList} from "../http/userApi";
import {useNotification} from "../providers/NotificationProvider"; 
export function ListItem(props) {
    const [state, setState] = useState({
        hover:false,
        more:false
    })
    var {hidden,showList,hiddenList} = useAddPlaylist();
    var {showNotification} = useNotification()
    const handleState=(name,value)=>{
        setState(prevState =>({...prevState, [name]: value} ))
    }
    const AddToQueue= async ()=>{
       await  emitter.emit("AddPlayQueue",{sid:props.sid,target:"next"});
    }
    const ChangePlay= async ()=>{
       await  emitter.emit("AddPlayQueue",{sid:props.sid,target:"replace"});
    }
    const RemoveFromQueue= ()=>{
        emitter.emit("DeletePlayQueue",{sid:props.sid})
    }
    
    const GoAuthorDetail=()=>{
        emitter.emit("GoAuthorDetail",{name:props.author})
    }
    
    const GoAlbumDetail=()=>{
        emitter.emit("GoAlbumDetail",{title:props.album})
    }
    const RemoveFormPlaylist=async ()=>{
        const res = await DeleteFormSangList({sid:props.sid,lid:props.lid});
        if(res.msg==="Ac"){
            showNotification("success","已从歌单中移除")
            props.reflushSangList()
        }else{
            showNotification("error",res.msg)
        }
    }
    
    return(
        <div
            className={` flex flex-row w-full h-20 relative justify-between mt-3 transition-all rounded-xl hover:bg-white items-center hover:bg-opacity-5 duration-300`}
            onMouseEnter={() => {
                handleState("hover", true)
            }}
            onMouseLeave={() => {
                handleState("hover", false)
            }}
            onDoubleClick={ChangePlay}
        >
            <div
                className={`w-1/2  ${props.inqueue ? `w-2/3` : ``} items-center   flex flex-row justify-between`}>
                <div className={`w-full flex flex-row items-center`}>
                    {state.hover ?
                        props.displayIndex && <SvgWillPlay className={`w-12`} w={`20`} h={`20`}></SvgWillPlay> :
                        props.displayIndex &&
                        <div className={`w-12 items-center  flex justify-center`}>{props.index + 1}</div>

                    }
                    <img src={`http://${props.src}`} alt="img"
                         className={` ml-3 object-cover rounded-lg min-h-16 min-w-16  max-h-16 max-w-16`}></img>
                    <div className={`justify-between flex flex-col ml-5  truncate  `}>
                        <div className={`text-xl w-full truncate`}>{props.title}</div>
                        <div onClick={GoAuthorDetail}
                             className={`text-gray-300 hover:underline hover:text-white`}>{props.author}</div>
                    </div>
                </div>


            </div>
            <div className={`   flex mr-8 w-1/4  justify-start `}>
                <div className={`truncate w-full text-start hover:cursor-pointer hover:underline`}
                     onClick={GoAlbumDetail}>{props.album}</div>
            </div>
            <div className={`w-1/6  flex  `}>
                <div className={`w-full flex flex-row-reverse justify-between `}>
                    {state.hover ? <SvgMore onclick={() => {
                        handleState(`more`, true)
                    }}
                                            className={`${props.wmore ? `absolute left-3/4 bottom-1/3` : `w-1/4`} hover:scale-110  right-0 hover:cursor-pointer`}
                                            w={`16`} h={`16`}></SvgMore> : <div className={`w-1/4`}/>}
                    {!props.notime && <div>{`${Math.floor(props.length / 60)}:${props.length % 60}`}</div>}
                    {!props.noadd && state.hover ?
                        <SvgAdd onclick={AddToQueue} className={` w-1/4 hover:scale-110 hover:cursor-pointer`} w={`16`}
                                h={`16`}></SvgAdd> : <div className={`w-1/4`}/>}
                </div>
                <div className={`z-10 flex `}>
                    <div
                        className={`${state.more ? ` block absolute right-16 bottom-0 mt-48 w-48  ` : `hidden`}`}
                        style={{background: `#3A3A3A`}}
                        onMouseLeave={() => {
                            handleState("more", false)
                        }}
                    >   
                        <div className={` m-1 flex  flex-col`}>
                            <div
                                className={`space-x-5 flex flex-row w-full h-8 items-center hover:bg-white  hover:bg-opacity-5`}
                                onClick={() => {
                                    showList(props.sid)
                                }}
                            > 
                                <SvgAdd w={`16`} h={`16`}></SvgAdd>
                                <div>加入歌单</div>
                            </div>
                        </div>
                        <div className={`m-1  flex  flex-col`}>
                            <div
                                className={`space-x-5 flex flex-row w-full h-8 items-center hover:bg-white hover:bg-opacity-5`}>
                                <SvgAdd w={`16`} h={`16`}></SvgAdd>
                                <div>添加到下一首</div>
                            </div>
                        </div>
                        <div className={`m-1  flex flex-col`}>
                            <div
                                className={`space-x-5 flex flex-row w-full h-8 items-center hover:bg-white hover:bg-opacity-5`}>
                                <SvgAdd w={`16`} h={`16`}></SvgAdd>
                                <div>添加到队尾</div>
                            </div>
                        </div>
                        {props.inqueue && (<div className={`m-1  flex flex-col`}>
                            <div onClick={() => RemoveFromQueue()}
                                 className={`space-x-5 flex flex-row w-full h-8 items-center hover:bg-white hover:bg-opacity-5`}>
                                <SvgRemove w={`16`} h={`16`}></SvgRemove>
                                <div>从队列移除</div>
                            </div>
                        </div>)}
                        {props.insanglist && (<div className={`m-1  flex flex-col`}>
                            <div
                                className={`space-x-5 flex flex-row w-full h-8 items-center hover:bg-white hover:bg-opacity-5`}
                                onClick={RemoveFormPlaylist}
                            >
                                <SvgRemove w={`16`} h={`16`}></SvgRemove>
                                <div>从此歌单移除</div>
                            </div>
                        </div>)}
                    </div>
                </div>
            </div>
        </div>
    )

}
