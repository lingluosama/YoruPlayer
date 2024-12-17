export function RowCardItem(props){
    return(
        <div className={props.className} onClick={props.onClick}>
            <div className={`w-full h-full flex flex-col space-y-5 items-center`}>
                <img alt={`img`} src={`http://${props.src}`} className={` w-48 h-60 rounded-xl  `}/>
                <div className={`text-2xl`}>{props.name}</div>
                
            </div>
        </div>
        
    )
    
    
}
