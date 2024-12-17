import { TagBottom } from "./element/TagButtom";
import { useEffect, useState } from "react";
import { QueryList } from "../../components/http/queryApi"; 
import { TowRowStripDisplayer } from "../../components/element/TowRowStripDisplayer";

export function MainPage(props) {
    const Tags = ["单曲", "专辑", "歌单"];
    const [state, setState] = useState({
        display: "单曲",
        t_list: []
    });

    const handleState = (name, value) => {
        setState(preState => ({ ...preState, [name]: value }));
    };
    
    const GoToListDetail=(index)=>{
        switch (state.display){
            case "单曲":
                return
            case "专辑":
                props.golist(state.t_list[index],"album")
                return;
            case "歌单":
                props.golist(state.t_list[index],"sanglist")
        }
    }

    const ChangeDisplay = async (name) => {
        switch (name) {
            case "单曲":
                return QueryList({
                    target: "single",
                    size: 8,
                    keyword: "",
                    begin: 0
                });
            case "专辑":
                return QueryList({
                    target: "album",
                    size: 8,
                    keyword: "",
                    begin: 0
                });
            case "歌单":
                return QueryList({
                    target: "sanglist",
                    size: 8,
                    keyword: "",
                    begin: 0
                });
            default:
                return Promise.resolve([]);
        }
    };

    const handleTagClick = async (item) => {
        handleState("display", item);
        const result = await ChangeDisplay(item).then(res => res.data);
        handleState("t_list", result);
    };

    useEffect(() => {
        const fetchData = async () => {
            const result = await ChangeDisplay(state.display).then(res => res.data);
            handleState("t_list", result);
        };
        fetchData();
    }, [state.display]);

    return (
        <div className="items-center  flex max-h-full p-5 flex-col">
            <div className="bg-gray-900 p-5 rounded-2xl w-full min-h-screen">
                <div className="flex flex-row space-x-7 w-full justify-start">
                    {
                        Tags.map((item, index) => (
                            <div key={index}>
                                <TagBottom text={item} choose={item === state.display} onclick={() => handleTagClick(item)} />
                            </div>
                        ))
                    }
                </div>
                <div className={`w-full mt-6`}>
                    <TowRowStripDisplayer  goDetail={GoToListDetail} list={state.t_list}></TowRowStripDisplayer>
                </div>
            </div>
        </div>
    );
}
