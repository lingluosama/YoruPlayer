import {useState} from "react"; 
import {GreenPlay} from "../../assets/svg/GreenPlay"; 
export function PlayAbleCard(props){
    const [state, setState] = useState({
        is_hover:false,
    })
    const handleState=(name,value)=>{
        setState(prevState =>({...prevState, [name]: value} ))
    }
    return(
        <div className={props.className} 
            onMouseOver={()=>handleState("is_hover",true)}
            onMouseLeave={()=>handleState("is_hover",false)}
        >
            <div className={`w-full h-full flex flex-col relative space-y-4`}>
                <div className={`h-2/3  `}>
                    <img src={`http://${props.cover}`} className={`h-full w-full object-cover rounded-xl`} />
                    <div className={`absolute right-0 bottom-6`} onClick={props.clcickButton}>
                        {<GreenPlay  w={`48`} h={`48`} className={`transition-all duration-300 ease-in-out translate-y-28 hover:cursor-pointer delay-100 ${state.is_hover?`translate-y-0 opacity-100`:`opacity-0`}`}></GreenPlay>}
                    </div>
                </div>
                <div className={`text-start flex flex-col`}>
                    <div>{props.title}</div> 
                    <div className={`text-gray-400`}>{props.author}</div>
                </div>
            </div>
        </div>
    )
    
    
}
