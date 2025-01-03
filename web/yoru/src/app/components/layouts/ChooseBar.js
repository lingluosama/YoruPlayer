export function ChooseBar(props) {
    
    const handleClick = (index) => {
        props.clickItem(index);
    }
    
    return(
        <div className={props.className} onMouseLeave={props.mouseleave}>
            <div className={`w-full  flex flex-col space-y-2 items-center`}>
                {props.list&&props.list.map((item, index) => (<div 
                key={index}
                onClick={()=>handleClick(index)}
                className={`w-full h-8 items-center  hover:bg-white hover:cursor-pointer rounded-lg hover:bg-opacity-5 truncate`}
                >
                    {item.title&&item.title}
                    {item.name&&item.name}
                </div>))}
            </div>
           
        
        </div>
    )
} 
