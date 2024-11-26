import {TagBottom} from "./element/TagButtom"; 
import {useState} from "react"; 
export function MainPage(props) {
    const Tags=["单曲","专辑","歌单"]
    const [state,setState]=useState({
        display:"单曲"
    });
    const handleState=(name,value)=>{
        setState(Prestate=>({...Prestate,[name]:value}))
    }
    
  return (
    <div className="items-center MainPage flex max-h-full p-5 flex-col">
        <div className={`  bg-gray-900 p-5 rounded-2xl w-full min-h-screen`}>
        <div className="  flex  flex-row  space-x-7 w-full justify-start">{
            Tags.map((item,index)=>{return(
                <div>
                  <TagBottom text={item} choose={item===state.display} onclick={()=>{handleState("display",item)}}></TagBottom>   
                </div>
            )})
        }</div>
        </div>
    </div>
    
  );
}
