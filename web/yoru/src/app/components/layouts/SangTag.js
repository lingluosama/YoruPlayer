import {SvgCancel} from "../../assets/svg/Cancel"; 
import {useState} from "react"; 
import {SvgAdd} from "../../assets/svg/Add"; 
export function SangTag(props){
    const [state, setState] = useState({
        ishover:false
    })
    const handleState=(name,value)=>{
        setState(prevState =>({...prevState, [name]: value }))
    }
    
    return(
        <div className={`w-16 h-8 p-3 ml-6 mt-3 bg-gray-700 relative z-0 rounded-3xl flex hover:cursor-pointer justify-center flex-row items-center`} 
             onMouseOver={()=>handleState("ishover",true)}
             onMouseLeave={()=>handleState("ishover",false)}
             onClick={props.onClick}
             >
            <div className={`w-full flex flex-row items-center justify-center`}>
                <div className={``}>{props.context}</div>
            </div>
            {state.ishover&&
               <div className={`w-full flex h-full justify-center absolute bg-gray-500  items-center rounded-3xl`}>
                   {props.choose&&<SvgCancel w={`16`} h={`16`}></SvgCancel>}
                   {!props.choose&&<SvgAdd w={`16`} h={`16`}></SvgAdd>}
               </div>         
            }
            {
                state.ishover&&!props.choose&&(
                    <div onClick={e=>e.stopPropagation()} className={`absolute w-full items-center justify-center flex rounded-xl h-8 bg-deep-gary top-full text-sm`}>
                        <div 
                        className={`hover:bg-white hover:bg-opacity-20`}
                        onClick={props.extraClick}
                        >移除标签</div>
                    </div>)
            }
            

        </div>
    )
}
