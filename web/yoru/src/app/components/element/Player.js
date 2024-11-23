import React, { useImperativeHandle, useRef, useState, forwardRef, useEffect } from "react"; 
import {emitter} from "next/client";

const PlayerComponent = forwardRef((props, ref) => {
  const audioRef = useRef(null);
  const [state, setState] = useState({
    CurrentTime: 0,
    IsPlaying: false,
  });

  const handleChange = (name, value) => {
    setState((prevState) => ({ ...prevState, [name]: value }));
  };

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
      }, 500); // 等待500毫秒
    }
  };

  useEffect(() => {
    calculateDuration();
    emitter.on('PlayDuration', HandleProgress);
    return () => {
      emitter.off('PlayDuration', HandleProgress);
    };
  }, [props.src]);

  useImperativeHandle(ref, () => ({
    ChangePlayState,
    HandleProgress,
  }));

  return (
    <div>
      <audio preload="auto" className="hidden" controls src={props.src} ref={audioRef} onTimeUpdate={TimeUpdate}>
        <source src={props.src} />
      </audio>
    </div>
  );
});

export default PlayerComponent;
