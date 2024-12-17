import {useEffect, useRef, useState} from "react"; 
import {SvgPlayQueue} from "../assets/svg/PlayQueue" 
import {SvgPreSang} from "../assets/svg/PreSang"; 
import {SvgStop} from "../assets/svg/Stop"; 
import {SvgNextSang} from "../assets/svg/NextSang"; 
import {SvgLoop} from "../assets/svg/Loop"; 
import {SvgVoice} from "../assets/svg/Voice"; 
import {SvgPackUp} from "../assets/svg/PackUp"; 
import {emitter} from "next/client"; 
import {SvgPlaying} from "../assets/svg/Playing"; 
import {SvgQueue} from "../assets/svg/Queue";
export const BottomBar =(props)=>{
    
    const [state, setState] = useState({
        IsPlaying:false,
        img:"",
        title:"",
        author:"",
        sid:"",
    })
    const HandleChange=(name,value)=>{
        setState(prevState => ({ ...prevState, [name]: value }))
    }
    
    function TranslateTime(duration) {
      const minutes = Math.floor(duration / 60);
      const seconds = Math.floor(duration % 60);
      const formattedMinutes = String(minutes).padStart(2, "0");
      const formattedSeconds = String(seconds).padStart(2, "0");
      return `${formattedMinutes}:${formattedSeconds}`;
    }
    
      const HandleDurationChange=(value)=>{
          emitter.emit('PlayDuration',{value:value})
      }
      const UpdateCurrentInfo=({img,title,author,sid})=>{
        HandleChange("img",img)
        HandleChange("title",title)
        HandleChange("author",author)
        HandleChange("sid",sid)
      }
      const CutSang=()=>{
        emitter.emit("DeletePlayQueue",{sid:state.sid})
      }
      const PreSang=()=>{
        
      }
    
    useEffect(() => {
        emitter.on("CurrentSangInfo",UpdateCurrentInfo)
        const setupSlider=()=>{
            const slider = document.querySelector("#DurationSlider");
                if(slider){
                    slider.labelFormatter=(value)=>`${TranslateTime(value)}`
                }
        }
        setupSlider()
        
    }, []);
    
    
    
    
    return (
        <div className={`w-full flex flex-row items-center h-24 justify-between`}>
            <div className={` w-1/4 flex flex-row items-center space-x-3 `}>
                  <img src={`http://${state.img}`} alt={`img`} className={`w-20 ml-3 h-20 object-cover rounded-2xl`} />
                  <div className={`flex flex-col space-y-2`}>
                      <div className={`text-xl`}>{state.title}</div>
                      <div className={` italic text-sm`}>{state.author}</div>
                  </div>      
            </div>
            <div className={`w-1/2 justify-center flex flex-col items-center `}>
                <div className={`flex flex-row h-12  items-center justify-between w-1/3`}>
                <SvgPlayQueue className={`hover:scale-110 cursor-pointer`} h={`24`} w={`24`}></SvgPlayQueue>
                <SvgPreSang onclick={PreSang} className={`hover:scale-110 cursor-pointer`} h={32} w={32}></SvgPreSang>
                {state.IsPlaying?
                <SvgStop className={`hover:scale-110 cursor-pointer`} h={32} w={32} onclick={()=>{props.changePlayState();HandleChange("IsPlaying",!state.IsPlaying)}} ></SvgStop>
                    :<SvgPlaying className={`hover:scale-110 cursor-pointer`} h={32} w={32} onclick={()=>{props.changePlayState();HandleChange("IsPlaying",!state.IsPlaying)}}></SvgPlaying>
                }
                <SvgNextSang onclick={CutSang} className={`hover:scale-110 cursor-pointer`} h={32} w={32}></SvgNextSang>
                <SvgLoop className={`hover:scale-110 cursor-pointer`} h={24} w={24}></SvgLoop>
                </div>
                 <div className={`flex flex-row w-full items-center `}>
                    <div>{TranslateTime(props.duration)}</div>
                    <mdui-slider 
                        id={`DurationSlider`}
                        value={props.duration}
                        className={`w-5/6`}
                        min={0} max={props.total}
                        onChange={(e)=>HandleDurationChange(e.target.value)}
                        ></mdui-slider>
                    <div>{TranslateTime(props.total)}</div>
                </div>
            </div>
            <div className={`w-1/4 flex flex-row items-center justify-between `}>
                <div className={`flex  w-1/3`}>
                    <SvgVoice className={`hover:scale-110 cursor-pointer`} w={40} h={40}></SvgVoice>
                    <mdui-slider className={`volume `}></mdui-slider>
                </div>
                <SvgQueue w={`32`} h={`32`} className={`hover:scale-110 cursor-pointer`} onclick={props.handlePlayList}></SvgQueue>
                <SvgPackUp  onclick={props.hidden} w={`32`} h={`32`} className={`hover:scale-110 cursor-pointer`}></SvgPackUp>
                <div></div>
            </div>
        </div>
        
    )
   
}
