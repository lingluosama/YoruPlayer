"use client";
import { useEffect, useRef, useState } from "react";
import 'mdui/mdui.css';
import '@mdui/icons/search.js';
import 'mdui'; 
import { NavigationItem } from "./NavigationItem"; 
import { BottomBar } from "./BottomBar"; 
import { SvgHome } from "../assets/svg/Home";
import { SvgAlbum } from "../assets/svg/Album"; 
import { SvgDoubleLeft } from "../assets/svg/DoubleLeft"; 
import { SvgDoubleRight } from "../assets/svg/DoubleRight"; 
import { MainPage } from './children/MainPage'; 
import { PlayPage } from './children/PlayPage'; 
import withAuth from "../components/withAuth"; 
import PlayerComponent from "../components/Player"; 
import { SvgPackOpen } from "../assets/svg/PackOpen"; 
import {EditSinglePage} from "../components/element/EditSinglePage"; 
import {SvgUpload} from "../assets/svg/Upload"; 
import {EditAlbumPage} from "../components/element/EditAlbumPage"; 

const Page = () => {
  const [state, setState] = useState({
    drawerOpen: false,
    displayBottomBar: true,
    bottomBarImg: 'https://th.bing.com/th/id/OIP.3n6ZAf145QCfNTn0bQ_9ZAHaEn?&rs=1&pid=ImgDetMain',
    bottomBarTitle: 'NULL',
    bottomBarAuthor: 'NULL',
    duration: 0,
    totalTime: 0,
    currentView: 'home'
  });

  const testurl = "http://localhost:9000/sangs/cardigan.mp3";
  const PlayerRef = useRef(null);
  const bottomBarRef = useRef(null);

  const handleState = (name, value) => {
    setState(prevState => ({ ...prevState, [name]: value }));
  };

  const drawerRef = useRef(null);

  const openDrawer = () => {
    drawerRef.current.open = true;
  };

  const closeDrawer = () => {
    drawerRef.current.open = false;
  };

  const renderComponent = () => {
    switch (state.currentView) {
      case 'home':
        return <MainPage />;
      case 'play':
        return <PlayPage />;
      case 'album':
        return  <EditAlbumPage />;   
      case `upload`:
        return <EditSinglePage create={true}/>  
      default:
        return <MainPage />;
    }
  };

  const UpdateTime = (value) => {
    const roundedValue = Math.round(value);
    handleState("duration", roundedValue);
  };

  const GetTotalTime = (value) => {
    handleState("totalTime", Math.round(value));
  };

  const HandleProgress = (value) => {
    if (PlayerRef.current) {
      PlayerRef.current.HandleProgress(value);
    }
  };

  const ChangePlayState = () => {
    if (PlayerRef.current) {
      PlayerRef.current.ChangePlayState();
    }
  };

  const hideBottomBar = () => {
    if (bottomBarRef.current) {
      bottomBarRef.current.classList.remove("translate-y-0");
      bottomBarRef.current.classList.add("translate-y-full");
      setTimeout(() => {
        handleState("displayBottomBar", false);
      }, 500);
    }
  };

  const showBottomBar = () => {
    if (bottomBarRef.current) {
        bottomBarRef.current.classList.add("translate-y-24");
      bottomBarRef.current.classList.remove("hidden");
      bottomBarRef.current.classList.remove("translate-y-0");
        setTimeout(() => {
        handleState("displayBottomBar", true);
        }, 500); 
    }
  };

  useEffect(() => {
    closeDrawer();
  }, []);

  return (
    <div className="max-h-screen min-h-screen w-full flex flex-col">
      <PlayerComponent
        ref={PlayerRef}
        updateTime={UpdateTime}
        src={testurl}
        getTotalTime={GetTotalTime}
      />
      <div className="flex-grow w-full flex overflow-auto">
        <div className="flex flex-row h-full w-full">
          <mdui-navigation-drawer close-on-overlay-click ref={drawerRef} className={`mdui-theme-dark bg-black flex flex-col items-center justify-center w-24 transform ${state.drawerOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-500`}>
            <NavigationItem name="Home" onClick={() => {handleState('currentView', 'home')}
            }>
              <SvgHome w={24} h={24} />
            </NavigationItem>
            <NavigationItem name="Album" onClick={() => handleState('currentView', 'album')}>
              <SvgAlbum w={24} h={24} />
            </NavigationItem>
            <NavigationItem name={`Upload`} onClick={() => {handleState('currentView', 'upload')}}>
                <SvgUpload w={24} h={24} />
            </NavigationItem>
            
          </mdui-navigation-drawer>
          <mdui-button
            className="absolute top-1/2"
            onClick={() => {
              state.drawerOpen ? closeDrawer() : openDrawer();
              handleState("drawerOpen", !state.drawerOpen);
            }}>
            {state.drawerOpen ? <SvgDoubleLeft w={32} h={32} /> : <SvgDoubleRight w={32} h={32} />}
          </mdui-button>
          <div className="flex-grow overflow-y-auto">
            {renderComponent()}
          </div>
        </div>
      </div>
        <div ref={bottomBarRef} className={`${state.displayBottomBar?``:`hidden`} w-full bg-green-500 h-24 translate-y-0 transition-transform duration-500`}>
          <BottomBar
            url={state.bottomBarImg}
            author={state.bottomBarAuthor}
            title={state.bottomBarTitle}
            total={state.totalTime}
            duration={state.duration}
            changePlayState={ChangePlayState}
            hidden={hideBottomBar}
            handleProgress={HandleProgress}
          />
        </div>
        <div className={`${state.displayBottomBar?`hidden`:``}   w-full flex flex-col items-center justify-center `}>
          <SvgPackOpen w="32" h="32" className="cursor-pointer" onclick={showBottomBar} />
        </div>
    </div>
  );
};

export default withAuth(Page);
