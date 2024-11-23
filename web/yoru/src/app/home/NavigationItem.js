import {useState} from "react"; 
export const NavigationItem = (props)=>{
    const [state, setState] = useState({
        InHover:false
    
    })
    const HandleChange = (name,value) => {
        setState(prevState => ({ ...prevState, [name]: value }))
    }
    
    return(
        <div onClick={props.onClick} onMouseEnter={()=>HandleChange("InHover",true)}
             onMouseLeave={()=>HandleChange("InHover",false)}
          className="w-full mt-3 space-y-2 flex flex-col items-center cursor-pointer">
            <div className={`w-1/2 flex items-center justify-center rounded-2xl ${state.InHover ? 'bg-gray-500 bg-opacity-50' : ''}`}>
                <div className={``}>{props.children}</div>
            </div>
            <div className={state.InHover? `underline`:``}>{props.name}</div>
        </div>
        
    )
}
