import { SvgHome } from "../assets/svg/Home"; 
import { SvgSearch } from "../assets/svg/Search"; 
import { useState } from "react"; 

export const TopBar = (props) => {
    const [state, setState] = useState({
        keyword: ""
    });

    const handleState = (name, value) => {
        setState(preState => ({ ...preState, [name]: value }));
    };

    const handleInputChange = (event) => {
        handleState("keyword", event.target.value);
    };

    const handleKeyDown = (event) => {
        if (event.key === "Enter") {
                props.onSearch(state.keyword);
        }
    };

    return (
        <div className="h-16 w-full items-center justify-center space-x-3 flex flex-row">
            <div className="cursor-pointer w-10 h-10 flex items-center justify-center bg-gray-700 bg-opacity-75 rounded-full">
                <SvgHome onclick={props.gohome} w="28" h="28" />
            </div>
            <div className="relative w-1/4">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <SvgSearch w="24" h="24" />
                </div>
                <input 
                    type="text" 
                    className="pl-10 h-10 rounded-full text-white bg-gray-700 bg-opacity-75 w-full" 
                    value={state.keyword} 
                    onChange={handleInputChange} 
                    onKeyDown={handleKeyDown}
                />
            </div>
        </div>
    );
};
