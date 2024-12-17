import {SvgAdd} from "../../assets/svg/Add"; 
import {useEffect, useState} from "react"; 
import {SvgMore} from "../../assets/svg/More"; 
import {emitter} from "next/client"; 
import {SvgWillPlay} from "../../assets/svg/WillPlay"; 
export function ListItem(props) {
    const [state, setState] = useState({
        hover:false,
        more:false
    })
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
    
    
    return(
        <div className={` flex flex-row w-full h-20 justify-between mt-3 rounded-xl hover:bg-white items-center hover:bg-opacity-5`}
             onMouseEnter={()=>{handleState("hover",true)}}
             onMouseLeave={()=>{handleState("hover",false)}}   
             onDoubleClick={ChangePlay}
        >
            <div className={`w-1/3 ${props.inqueue?`w-2/3`:``} items-center  flex flex-row`}>
                {   state.hover?    
                    props.displayIndex&&<SvgWillPlay className={`w-12`} w={`20`} h={`20`} ></SvgWillPlay>:
                    props.displayIndex&&<div className={`w-12 items-center  flex justify-center`}>{props.index+1}</div>
                
                }
                <img src={`http://${props.src}`} alt="img" className={` ml-3 object-cover rounded-lg min-h-16 min-w-16  max-h-16 max-w-16`} ></img>
                <div className={`justify-between flex flex-col ml-5 w-full truncate  `}>
                    <div className={`text-xl w-full truncate`}>{props.title}</div>
                    
                    <div onClick={GoAuthorDetail} className={`text-gray-300 hover:underline hover:text-white`}>{props.author}</div>   
                </div>
            </div>
            <div className={`hover:cursor-pointer hover:underline w-1/3 flex items-center justify-start truncate`}>{props.album}</div>
            <div className={`w-1/6 flex flex-row-reverse items-center justify-between`}>
                {state.hover?<SvgMore  onclick={()=>{handleState(`more`,true)}} className={`${props.wmore?`mr-3 w-8 h-1/2`:`w-1/4`} hover:scale-110  hover:cursor-pointer`} w={`16`} h={`16`}></SvgMore>:<div className={`w-1/4`} />}
                {!props.notime&&<div>{props.length}</div>}
                {!props.noadd&&state.hover?<SvgAdd onclick={AddToQueue} className={` w-1/4 hover:scale-110 hover:cursor-pointer`} w={`16`} h={`16`}></SvgAdd>:<div className={`w-1/4`} />}
            <div className={`z-10 flex `}>
            <div 
            className={`${state.more?` block  right-16 top-0 mt-48 w-48  `:`hidden`}`} 
            style={{background:`#3A3A3A`}}
            onMouseLeave={()=>{handleState("more",false)}}
            >
                <div className={` m-1 flex  flex-col`}>
                    <div className={`space-x-5 flex flex-row w-full h-8 items-center hover:bg-white hover:bg-opacity-5`}>
                        <SvgAdd w={`16`} h={`16`}></SvgAdd>
                        <div>加入歌单</div>
                    </div>
                </div>
                <div className={`m-1  flex  flex-col`}>
                    <div className={`space-x-5 flex flex-row w-full h-8 items-center hover:bg-white hover:bg-opacity-5`}>
                        <SvgAdd w={`16`} h={`16`}></SvgAdd>
                        <div>添加到下一首</div>
                    </div>
                </div>
                <div className={`m-1  flex flex-col`}>
                    <div className={`space-x-5 flex flex-row w-full h-8 items-center hover:bg-white hover:bg-opacity-5`}>
                        <SvgAdd w={`16`} h={`16`}></SvgAdd>
                        <div>添加到队尾</div>
                    </div>
                </div>
                {props.inqueue&&(<div className={`m-1  flex flex-col`}>
                                    <div onClick={()=>RemoveFromQueue()} className={`space-x-5 flex flex-row w-full h-8 items-center hover:bg-white hover:bg-opacity-5`}>
                                        <SvgAdd w={`16`} h={`16`}></SvgAdd>
                                        <div>从队列移除</div>
                                    </div>
                                </div>)}
                {props.insanglist&&(<div className={`m-1  flex flex-col`}>
                                    <div className={`space-x-5 flex flex-row w-full h-8 items-center hover:bg-white hover:bg-opacity-5`}>
                                        <SvgAdd w={`16`} h={`16`}></SvgAdd>
                                        <div>从此歌单移除</div>
                                    </div>
                                </div>)}                
            </div>
            </div>
            </div>
        </div>
    )
    
}
