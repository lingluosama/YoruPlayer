import {useState} from "react";
import {GreenAdvance} from "../../assets/svg/GreenAdvance";

export function RowCardItem(props) {
    const [state, setState] = useState({
        is_hover: false,
    });

    const handleState = (name, value) => {
        setState(prevState => ({...prevState, [name]: value}));
    };

    return (
        <div className={props.className} >
            <div
                onMouseEnter={() => handleState("is_hover", true)}
                onMouseLeave={() => handleState("is_hover", false)}
                className={`w-56 h-72 hover:bg-white overflow-hidden relative  hover:bg-opacity-10 rounded-2xl p-4 flex space-y-3 flex-col items-center`}>
                {!props.create && <img alt={`img`} src={`http://${props.src}`} className={`w-48 h-48 object-cover rounded-xl`} />}
                {props.create && (
                    <div className="w-48 h-48 flex items-center justify-center">
                        <div className="flex items-center justify-center w-full h-full">
                            <div className="bg-white w-2 h-3/5 rounded-2xl"></div>
                            <div className="absolute bg-white h-2 w-3/5 rounded-2xl"></div>
                        </div>
                    </div>
                )}
                <div className={`text-xl w-full text-start`}>{props.name}</div>
                <div className={`absolute transition bg-white right-3 bottom-0 rounded-full ${state.is_hover ? `-translate-y-12` : `translate-y-12`}`}>
                    <GreenAdvance onClick={props.onClick} className={`hover:cursor-pointer`} w={`48`} h={`48`}></GreenAdvance>
                </div>
            </div>
        </div>
    );
}
