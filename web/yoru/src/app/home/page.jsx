"use client";
import { useEffect, useRef, useState } from "react";
import 'mdui/mdui.css';
import '@mdui/icons/search.js';
import 'mdui'; 
import { NavigationItem } from "../components/layouts/NavigationItem"; 
import { BottomBar } from "./BottomBar"; 
import { SvgHome } from "../assets/svg/Home";
import { SvgAlbum } from "../assets/svg/Album"; 
import { SvgDoubleLeft } from "../assets/svg/DoubleLeft"; 
import { SvgDoubleRight } from "../assets/svg/DoubleRight"; 
import { MainPage } from './children/MainPage'; 
import withAuth from "../components/withAuth"; 
import PlayerComponent from "../components/layouts/Player"; 
import { SvgPackOpen } from "../assets/svg/PackOpen"; 
import { EditSinglePage } from "../components/pages/EditSinglePage"; 
import { SvgUpload } from "../assets/svg/Upload"; 
import { EditAlbumPage } from "../components/pages/EditAlbumPage"; 
import { TopBar } from "./TopBar"; 
import { SearchResultPage } from "./children/SearchResultPage"; 
import { DetailSingleList } from "../components/pages/DeatilSingleList"; 
import {GetPlayQueue} from "../components/http/PlayApi"; 
import {ListItem} from "../components/layouts/ListItem"; 
import {SvgCancel} from "../assets/svg/Cancel"; 
import {emitter} from "next/client"; 
import {GetAlbumInfoByTitle} from "../components/http/queryApi"; 
import {UserHomePage} from "../components/pages/UserHomePage"; 

const Page = () => {
  const [state, setState] = useState({
    drawerOpen: false,
    PlayListOpen: false,
    displayBottomBar: true,
    bottomBarImg: 'https://th.bing.com/th/id/OIP.3n6ZAf145QCfNTn0bQ_9ZAHaEn?&rs=1&pid=ImgDetMain',
    bottomBarTitle: 'NULL',
    bottomBarAuthor: 'NULL',
    duration: 0,
    totalTime: 0,
    currentView: 'home',
    searchKeyword:'',
    listDetail:null,
    listType:"",
    PlayQueue:[],
    targetAuthor:"",
  });
  const testurl = "http://localhost:9000/sangs/cardigan.mp3";
  const PlayerRef = useRef(null);
  const bottomBarRef = useRef(null);

  const handleState = (name, value) => {
    setState(prevState => ({ ...prevState, [name]: value }));
  };

  const drawerRef = useRef(null);
  const PlayListRef = useRef(null);

  const openDrawer = () => {
    drawerRef.current.open = true;
  };
  const openPlayList = () => {
      PlayListRef.current.open=true
    PlayListRef.current.classList.remove('hidden');
    PlayListRef.current.classList.add('translate-x-0');
    PlayListRef.current.classList.remove('translate-x-full');
  };
  const closeDrawer = () => {
    drawerRef.current.open = false;
  };
  const closePlayList = () => {
      PlayListRef.current.open=false
    PlayListRef.current.classList.add('translate-x-full');
    PlayListRef.current.classList.remove('translate-x-0');
    PlayListRef.current.classList.add('hidden');
  };
  
  const GoToUserHome=()=>{
      handleState("currentView","user-home")
      renderComponent()
  }

  const HandlePlayListOpen = () => {
    state.PlayListOpen ? closePlayList() : openPlayList();
    handleState("PlayListOpen", !state.PlayListOpen);
  };
  const HandleDrawer=()=>{
    state.drawerOpen ? closeDrawer() : openDrawer();
    handleState("drawerOpen", !state.drawerOpen);
  }

  const GetCallbackToListDetailPage = (data, type) => {
    handleState("currentView", "list");
    handleState("listDetail", data);
    handleState("listType", type);
    renderComponent();
  };

  const renderComponent = () => {
    switch (state.currentView) {
      case 'home':
        return <MainPage golist={GetCallbackToListDetailPage} />;
      case 'play':
        return <PlayPage />;
      case 'album':
        return <EditAlbumPage create={true} />;
      case `upload`:
        return <EditSinglePage create={true} />;
      case `search`:
        return <SearchResultPage golist={GetCallbackToListDetailPage} keyword={state.searchKeyword} />;
      case `list`:
        return <DetailSingleList name={state.targetAuthor} type={state.listType} album={state.listDetail} sanglist={state.listDetail}></DetailSingleList>;
      case `list-author`:
          return <DetailSingleList name={state.targetAuthor} type={`author`}></DetailSingleList>;
      case  `user-home`:
          return <UserHomePage></UserHomePage>
        default:
        return <MainPage />;
    }
  };
  const GetPlayQueueFromPlayer = (data) => {
      handleState("PlayQueue", data);
  }
  useEffect(() => {
  }, [PlayerRef]);
  
  
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
      emitter.on('GoAuthorDetail',({name})=>{
          handleState("targetAuthor", name);
          handleState("currentView", "list-author");
          renderComponent();
      } );
      emitter.on("GoAlbumDetail",async ({title})=>{
            const res = await GetAlbumInfoByTitle({title:title});
            GetCallbackToListDetailPage(res.data,"album")
      })
    closeDrawer();
    
  }, []);

  return (
     <div className={`w-full max-h-screen flex flex-row-reverse`}> 
       <div
         ref={PlayListRef}
         className={` bg-black  flex-col items-center justify-center hidden w-64 translate-y-0 transition-transform duration-500`}
       >
         <SvgCancel onclick={HandlePlayListOpen} className={` hover:bg-white hover:bg-opacity-10 hover:outline-8 hover:outline-white/10 absolute top-2 right-2 hover:scale-110 hover:cursor-pointer`} w={`16`} h={`16`}></SvgCancel>
         
         <div className={`w-full mt-2 justify-center items-center text-center`}>播放队列</div>
         {state.PlayQueue&&state.PlayQueue.map((item, index) => (
             <ListItem inqueue={true} sid={item.id} displayIndex={false} key={index} length={item.length} src={item.cover} title={item.title} author={item.author} notime={true} noadd={true} wmore={true}  />
         ))}
       </div>
    <div className="h-screen min-h-screen w-full flex flex-col">
      <TopBar 
        gohome={() => { handleState("currentView", "home"); renderComponent(); }}
        onSearch={(keyword) => {
          handleState("currentView", "search");
          handleState("searchKeyword", keyword);
          renderComponent();
        }}
        onclickAvatar={GoToUserHome}
      />
      <PlayerComponent
        ref={PlayerRef}
        updateTime={UpdateTime}
        src={testurl}
        getTotalTime={GetTotalTime}
        queryPlayList={GetPlayQueueFromPlayer}
      />
      <div className="flex-grow w-full flex overflow-auto">
        <div className="flex flex-row h-full w-full">
          <mdui-navigation-drawer 
            close-on-overlay-click 
            ref={drawerRef} 
            className={`mdui-theme-dark bg-black flex flex-col items-center justify-center w-24 transform ${state.drawerOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-500`}>

            <NavigationItem name="Album" onClick={() => handleState('currentView', 'album')}>
              <SvgAlbum w={24} h={24} />
            </NavigationItem>
            <NavigationItem name={`Upload`} onClick={() => { handleState('currentView', 'upload'); }}>
              <SvgUpload w={24} h={24} />
            </NavigationItem>
            <NavigationItem name={`Author`} onClick={() => { handleState('currentView', 'author'); }}>
              <SvgUpload w={24} h={24} />
            </NavigationItem>
          </mdui-navigation-drawer>
          <mdui-button
            className="absolute top-1/2"
            onClick={HandleDrawer}>
            {state.drawerOpen ? <SvgDoubleLeft w={32} h={32} /> : <SvgDoubleRight w={32} h={32} />}
          </mdui-button>
          <div className="flex-grow overflow-y-auto">
            {renderComponent()}
          </div>

        </div>
      </div>
      
      <div ref={bottomBarRef} className={`${state.displayBottomBar ? `` : `hidden`} w-full bg-white bg-opacity-5 h-24 translate-y-0 transition-transform duration-500`}>
        <BottomBar
          url={state.bottomBarImg}
          author={state.bottomBarAuthor}
          title={state.bottomBarTitle}
          total={state.totalTime}
          duration={state.duration}
          changePlayState={ChangePlayState}
          hidden={hideBottomBar}
          handleProgress={HandleProgress}
          handlePlayList={HandlePlayListOpen}
        />
      </div>
      <div className={`${state.displayBottomBar ? `hidden` : ``} w-full flex flex-col items-center justify-center`}>
        <SvgPackOpen className={`absolute bottom-0 hover:cursor-pointer ` } w={`32`} h={`32`} onclick={showBottomBar} />
      </div>
    </div>
    </div>
  );
};

export default withAuth(Page);
