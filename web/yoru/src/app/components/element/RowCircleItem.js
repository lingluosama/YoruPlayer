import {emitter} from "next/client"; 
export function RowCircleItem(props){
    const GoAuthorDetail=()=>{
        emitter.emit("GoAuthorDetail",{name:props.name})
    }
    return(
        <div className={props.className} onClick={GoAuthorDetail}>
            <div className={`w-full h-full flex flex-col space-y-5 items-center`}>
                <img alt={`img`} src={`http://${props.src}`} className={`w-48 h-48 rounded-full  `}/>
                <div className={`text-2xl`}>{props.name}</div>
                
            </div>
        </div>
        
    )
    
    
}
