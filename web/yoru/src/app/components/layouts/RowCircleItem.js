import {emitter} from "next/client"; 
import {GreenAdvance} from "../../assets/svg/GreenAdvance"; 
import {useState} from "react"; 
export function RowCircleItem(props){
    const [state, setState] = useState({
        is_hover:false,
    })
    const handleState=(name,value)=>{
        setState(prevState =>({...prevState, [name]: value} ))
    }
    const GoAuthorDetail=()=>{
        if(props.rounded)emitter.emit("GoAuthorDetail",{name:props.name})
        else props.golist()
    }
    return(
        <div className={props.className} 
            onMouseOver={()=>handleState("is_hover",true)}
            onMouseLeave={()=>handleState("is_hover",false)}>
            <div className={`w-full h-full flex flex-col space-y-2 items-center transition-all relative overflow-hidden`}>
                <img alt={`img`} src={`http://${props.src}`} className={` h-2/3 aspect-1  object-cover  ${props.rounded?`rounded-full`:``} `}/>
               <div className={`w-full flex flex-col`}>
                    <div className={`text-2xl`}>{props.name}</div>
                    {props.rounded?<div>艺人</div>:<div>歌单</div>} 
               </div>
              <GreenAdvance   
              className={`absolute bg-white transition rounded-full bottom-0 right-4  duration-300 hover:cursor-pointer ${state.is_hover?`-translate-y-12 opacity-100`:`translate-y-12 opacity-0`}`}
               w={`48`} h={`48`}
               onClick={()=>GoAuthorDetail()}
               ></GreenAdvance>
            </div>
        </div>
        
    )
    
    
}
