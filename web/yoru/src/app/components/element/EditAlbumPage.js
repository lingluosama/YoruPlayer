import { useRef, useState } from "react"; 
import { SvgCancel } from "../../assets/svg/Cancel"; 
import {$httpFormData} from "../http/fileApi"; 

export function EditAlbumPage(props) {
    const CoverRef = useRef(null);
    const [state, setState] = useState({
        title: "",
        coverFileName: null,
        cover: null,
        description: "",
        author: "",
    });

    const handleState = (name, value) => {
        setState((prevState) => ({ ...prevState, [name]: value }));
    };

    const handleCoverChange = (e) => {
        if (e.target.files.length > 0) {
            handleState("coverFileName", e.target.files[0].name);
            handleState("cover", e.target.files[0]);
        }
    };

    const CancelUploadCover = () => {
        if (CoverRef.current) {
            CoverRef.current.value = null;
            handleState("coverFileName", null);
            handleState("cover", null);
        }
    };
    
    const handleSubmit=async ()=>{
        const formData = new FormData();
        formData.append("title", state.title);
        formData.append("cover", state.cover,state.coverFileName);
        formData.append("description", state.description);
        formData.append("author", state.author);
        await $httpFormData(formData,"/file/album").then(r => console.log(r))
        
    }

    return (
        <div className="w-full flex flex-col items-center p-8 ">
            <div className="flex flex-col space-y-8 w-4/5 bg-gray-800 p-8 rounded-md shadow-lg">
                <div className="text-2xl font-bold text-white">
                    {props.create ? `Create a Album` : `Edit ${state.title}`}
                </div>
                <div className="border-t border-gray-600"></div>
                <div className="w-full h-52 flex-row flex justify-between items-center">
                    {!props.create && (
                        <img
                            src={props.url}
                            alt="img"
                            className="w-48 h-48 object-cover rounded-md shadow-md"
                        />
                    )}
                    <div className="flex flex-col items-center">
                        <label className="w-48 h-52 border-2 border-dashed border-sky-400 bg-gray-600 rounded-2xl flex flex-col items-center justify-center cursor-pointer shadow-md">
                            <span className="text-sky-400 font-semibold">Click To Upload</span>
                            <span className="text-sm text-gray-400">Limited One File, The New Will Replace Old One</span>
                            <input 
                                ref={CoverRef} 
                                type="file" 
                                className="hidden" 
                                onChange={handleCoverChange} 
                            />
                        </label>
                        {state.coverFileName && (
                            <div className="flex items-center justify-between mt-2 text-gray-300 w-full hover:bg-gray-600 hover:rounded-xl hover:border-dashed p-2">
                                <span>{state.coverFileName}</span>
                                <SvgCancel w="16" h="16" onClick={CancelUploadCover} />
                            </div>
                        )}
                    </div>
                </div>
                <label className="flex flex-col space-y-2 text-white">
                    作者:
                    <input 
                        onChange={(e) => handleState(e.target.name, e.target.value)}
                        value={state.author}
                        name="author"
                        type="text"
                        className="bg-gray-600 text-white rounded p-2 focus:outline-none focus:ring-2 focus:ring-sky-400"
                    />
                </label>
                <label className="flex flex-col space-y-2 text-white">
                    标题:
                    <input 
                        onChange={(e) => handleState(e.target.name, e.target.value)}
                        value={state.title}
                        name="title"
                        type="text"
                        className="bg-gray-600 text-white rounded p-2 focus:outline-none focus:ring-2 focus:ring-sky-400"
                    />
                </label>  
                <label className="flex flex-col space-y-2 text-white">
                    描述:
                    <textarea 
                        onChange={(e) => handleState(e.target.name, e.target.value)}
                        value={state.description}
                        name="description"
                        className="bg-gray-600 text-white rounded p-2 focus:outline-none focus:ring-2 focus:ring-sky-400 resize-y"
                        rows="4"
                    />
                </label>
                <div className={`w-full flex items-center justify-center`}>
                    <mdui-button className={`w-32 h-12`} onClick={handleSubmit}>Submit</mdui-button>
                </div>
                    
            </div>
        </div>
    );
}
