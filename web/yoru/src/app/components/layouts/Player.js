import React, { useImperativeHandle, useRef, useState, forwardRef, useEffect } from "react"; 
import {emitter} from "next/client"; 
import {AddToQueue,DeleteToQueue, GetPlayQueue} from "../http/PlayApi";

const PlayerComponent = forwardRef((props, ref) => {
  const audioRef = useRef(null);
  const [state, setState] = useState({
    CurrentTime: 0,
    IsPlaying: false,
    CurrentSang:null,
    PlayList:[],
  });
    
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
  
    const FetchPlayQueue=async ()=>{
        const uid = localStorage.getItem("uid");
        const res = await GetPlayQueue({uid});
        handleChange("PlayList",res.data.sang_list);
        if(res.data.sang_list)setState((prevState)=>{
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
    const AddToPlayQueue=async ({sid,target})=>{
        const uid = localStorage.getItem("uid");
        await AddToQueue({uid:uid,target:target,sid:sid});
        await FetchPlayQueue()
    }
    const DeleteFormPlayQueue=async ({sid})=>{
        const uid = localStorage.getItem("uid");
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
    	props.queryPlayList(state.PlayList)
  }, [state.PlayList]);
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
      <audio preload="auto" className="hidden" controls src={ state.CurrentSang&&`http://${state.CurrentSang.resource}`} ref={audioRef} onTimeUpdate={TimeUpdate}>
      </audio>
    </div>
  );
});

export default PlayerComponent;
