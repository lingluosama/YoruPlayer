import {useEffect, useState} from "react";

export const VideoBackground=(props)=>{
    const [mute,setMute] = useState(props.mute);
    
    useEffect(()=>{
      setMute(props.mute)  
    },[props])
    
    return(
        <div className={` relative h-screen w-screen`}>
            <video 
                autoPlay={true}
                muted={mute} 
                loop={true} 
                className={`absolute w-full h-full z-5 object-cover`}
                
            >
                <source src={`http://localhost:9000/video/takarabokuwo.mp4`} type={`video/mp4`} />
            </video>
        </div>
    )
    
}