import React, {forwardRef, useEffect, useImperativeHandle, useRef, useState} from "react";
import {emitter} from "next/client";
import {AddToQueue, DeleteToQueue, GetPlayQueue} from "../http/PlayApi";
import {useNotification} from "../providers/NotificationProvider";
import {debounce} from "next/dist/server/utils";

const PlayerComponent = forwardRef((props, ref) => {
  const audioRef = useRef(null);
  const [state, setState] = useState({
    CurrentTime: 0,
    IsPlaying: false,
    CurrentSang:null,
    HistoryList:[],  
  });
  const [currentList, setCurrentList] = useState([])
  const [historyList,setHistoryList]=useState([])  
    
  const handleChange = (name, value) => {
    setState((prevState) => ({ ...prevState, [name]: value }));
  };
  
  const emitCurrentSangInfo=(data)=>{
      emitter.emit("CurrentSangInfo",{
          img:data.cover,
          title:data.title,
          author:data.author,
          sid:data.id,
          });
  }
  
    const FetchPlayQueue=async (isBackOff)=>{
        const uid = localStorage.getItem("uid");
        const res = await GetPlayQueue({uid});
        setCurrentList(prev => {
            return res.data?res.data.sang_list:[];
        });
        if(res.data&&res.data.sang_list)setState((prevState)=>{
            const newPlayList=res.data.sang_list
            if(!prevState.CurrentSang || prevState.CurrentSang.id !== newPlayList[0].id){
                const newCurrentSang=newPlayList[0];
                emitCurrentSangInfo(newCurrentSang)
                return{
                    ...prevState,
                    CurrentSang:newCurrentSang,
                    PlayList:newPlayList,
                }
            }
            return {
                ...prevState,
                PlayList:newPlayList,
            }
        })
    }
    
    const{showNotification}= useNotification()
    const BackOffQueue=useRef(
        debounce(async ()=>{
            setHistoryList( (pre)=>{
                if(pre.length>0){
                    const uid = localStorage.getItem("uid");
                    AddToQueue({uid:uid,target:"replace",sid:pre[pre.length-1].id});
                    pre.pop()
                }else{
                    showNotification("error","已经是历史最后一项")
                }
                return pre
            })
            
        },200)
    ).current
    
    const AddToPlayQueue=async ({sid,target})=>{
        const uid = localStorage.getItem("uid");
        if(target==="replace"){
            setCurrentList(pre=>{
                if(pre){
                    setHistoryList(prevState =>{
                        if(!prevState){
                            prevState.push(pre[0])
                        }else{
                            if(prevState[prevState.length-1]!==pre[0]){
                                prevState.push(pre[0])
                            }
                        }
                        return prevState
                    })
                }
            })
        }
        await AddToQueue({uid:uid,target:target,sid:sid});
        
        await FetchPlayQueue()
    }
    const DeleteFormPlayQueue=async ({sid})=>{
        const uid = localStorage.getItem("uid");
        setCurrentList(pre=>{
            if(pre){
                if(pre[0].id===sid){
                    setHistoryList(prevState =>{
                        if(!prevState){
                            prevState.push(pre[0])
                        }else{
                            if(prevState[prevState.length-1]!==pre[0]){
                                prevState.push(pre[0])
                            }
                        }
                        console.log(prevState)
                        return prevState
                    })
                }
            }
        })
        
        await DeleteToQueue({uid:uid,sid:sid})
        await FetchPlayQueue()
    }
    
  const TimeUpdate = () => {
    if (audioRef.current) {
      handleChange("CurrentTime", audioRef.current.currentTime);
      props.updateTime(audioRef.current.currentTime);
    }
  };

  const ChangePlayState = () => {
    if (audioRef.current) {
      if (state.IsPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      handleChange("IsPlaying", !state.IsPlaying);
    }
  };


  const calculateDuration = async () => {
    if (audioRef.current) {
      audioRef.current.src = props.src;
      audioRef.current.oncanplay = function () {
        props.getTotalTime(audioRef.current.duration);
        if (state.IsPlaying) {
          audioRef.current.play();
        } else {
          audioRef.current.pause();
        }
      };
    }
  };

  const HandleProgress = async (event) => {
    if (audioRef.current) {
      const wasPlaying = !audioRef.current.paused; // 检查当前播放状态
      audioRef.current.pause(); // 暂停播放
      audioRef.current.currentTime = event.value;

      setTimeout(() => {
        if (wasPlaying) {
          audioRef.current.play(); 
        }
      }, 500); 
    }
  };
  const HandleVolumeChange=({value})=>{
      audioRef.current.volume = value/100;
  }

  useEffect(() => {
    calculateDuration();
    
    emitter.on('PlayDuration', HandleProgress);
    emitter.on('AddPlayQueue', AddToPlayQueue);
    emitter.on('DeletePlayQueue',DeleteFormPlayQueue);
    emitter.on(`ChangeVolume`,HandleVolumeChange);
    emitter.on(`FetchPlayQueue`,FetchPlayQueue);
    emitter.on(`BackOffQueue`,async ()=>{BackOffQueue();await FetchPlayQueue()})
    if(audioRef.current){audioRef.current.volume=localStorage.getItem("volume")/100;}
    return () => {
      emitter.off('PlayDuration', HandleProgress);
      emitter.off('AddPlayQueue', AddToPlayQueue);
      emitter.off('DeletePlayQueue',DeleteFormPlayQueue);
      
    };
  }, [props.src]);
  useEffect(() => {
      
      const fetchData=async ()=>{
  	   await FetchPlayQueue();
      }
      fetchData().then()
  }, []);
  
  
  useEffect(() => {
    	props.queryPlayList(currentList)
  }, [currentList]);
  useEffect(() => {
      
      setTimeout(() => {
        if (state.IsPlaying) {
          audioRef.current.play(); 
        }
      }, 500); 
  }, [state.CurrentSang]);  
  useImperativeHandle(ref, () => ({
    ChangePlayState,
    HandleProgress,
  }));

  return (
    <div>
      <audio 
      preload="auto" 
      className="hidden" 
      controls 
      src={ state.CurrentSang&&`http://${state.CurrentSang.resource}`} 
      ref={audioRef} 
      onTimeUpdate={TimeUpdate}
      onEnded={async ()=>{await DeleteFormPlayQueue({sid:state.CurrentSang.id})}}
      >
      </audio>
    </div>
  );
});

export default PlayerComponent;
