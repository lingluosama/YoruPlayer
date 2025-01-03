export function RowCardItem(props){
    return(
        <div className={props.className} onClick={props.onClick}>
            <div className={`w-56 h-72 hover:bg-white hover:cursor-pointer hover:bg-opacity-10 rounded-2xl p-4 flex space-y-3 flex-col items-center`}>
                <img alt={`img`} src={`http://${props.src}`} className={` w-48 h-48 object-cover rounded-xl  `}/>
                <div className={`text-xl w-full text-start`}>{props.name}</div>
            </div>
        </div>
        
    )
    
    
}
