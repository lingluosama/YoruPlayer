export function TagBottom(props) {
    if(props.choose){return(
            <button className={`bg-white rounded-xl text-black w-12`}>
               {props.text}
            </button>
    )}else{
        return(
            <button onClick={props.onclick}  className={`bg-white bg-opacity-15  text-white rounded-xl w-12`}>
               {props.text}
            </button>
        )
    }
    
}
