import { useRef, useState } from "react"; 
import { SvgCancel } from "../../assets/svg/Cancel"; 
import {$httpFormData, UploadNewSingle} from "../http/FormDataApi"; 

export function EditSinglePage(props) {
    const SingleRef = useRef(null);
    const CoverRef = useRef(null);
    const [state, setState] = useState({
        coverFileName: "",
        singleFileName: "",
        author: "",
        title: "",
        cover: null,
        single: null,
    });

    const handleState = (name, value) => {
        setState(prevState => ({ ...prevState, [name]: value }));
    };

    const handleCoverChange = (e) => {
        if (e.target.files.length > 0) {
            handleState("coverFileName", e.target.files[0].name);
            handleState("cover", e.target.files[0]);
        }
    };

    const handleSingleChange = (e) => {
        if (e.target.files.length > 0) {
            handleState("singleFileName", e.target.files[0].name);
            handleState("single", e.target.files[0]);
        }
    };

    const CancelUploadCover = () => {
        if (CoverRef.current) {
            CoverRef.current.value = null;
            handleState("coverFileName", "");
            handleState("cover", null);
        }
    };

    const CancelUploadSingle = () => {
        if (SingleRef.current) {
            SingleRef.current.value = null;
            handleState("singleFileName", "");
            handleState("single", null);
        }
    };

const handleSubmit =async () => {
    const formData = new FormData();
    if (state.cover) {
        formData.append("cover", state.cover,state.coverFileName);
    }
    if (state.single) {
        formData.append("sang", state.single,state.singleFileName);
    }
    formData.append("author", state.author);
    formData.append("title", state.title);

   await  $httpFormData(formData, "/file/single") 
        .then(response => {
            console.log(response);
        })
};


    return (
        <div className={`h-full flex flex-col items-center bg-black text-white p-8`}>
            <div className={`w-4/5 flex flex-col  h-full space-y-8 bg-gray-800 p-8 rounded-md`}>
                <div className={`text-2xl font-bold`}>{props.create ? `Upload New Single` : `Edit Single`}</div>
                <mdui-divider></mdui-divider>
                <label className={`flex flex-col space-y-2`}>
                    音频文件:
                    <input 
                        ref={SingleRef} 
                        type={`file`} 
                        className={`bg-gray-700 text-white rounded p-2`}
                        onChange={handleSingleChange}
                    />
                    {state.singleFileName && (
                        <div className="items-center flex justify-between hover:bg-gray-700 w-full hover:rounded-xl hover:border-dashed mt-2 text-gray-300">
                            {state.singleFileName}
                            <SvgCancel w={"16"} h={"16"} onclick={CancelUploadSingle}></SvgCancel>
                        </div>
                    )}
                </label>                    
                <div className={`w-full h-52 flex-row flex justify-between items-center`}>
                    {!props.create ? (
                        <img src={props.url} alt={`img`} className={`w-48 h-48 object-cover rounded-md`} />  
                    ) : null}
                    <div className={`flex flex-col items-center`}>
                        <label className={`w-48 h-52 border-2 border-dashed border-sky-400 bg-gray-700 rounded-2xl flex flex-col items-center justify-center cursor-pointer`}>
                            <span className={`text-sky-400`}>Click To Upload</span>
                            <span className={`text-sm text-gray-400`}>Limited One File, The New Will Replace Old One</span>
                            <input 
                                ref={CoverRef} 
                                type={`file`} 
                                className={`hidden`} 
                                onChange={handleCoverChange} 
                            />
                        </label>
                        {state.coverFileName && (
                            <div className="items-center flex justify-between hover:bg-gray-700 w-full hover:rounded-xl hover:border-dashed mt-2 text-gray-300">
                                {state.coverFileName}
                                <SvgCancel w={"16"} h={"16"} onclick={CancelUploadCover}></SvgCancel>
                            </div>
                        )}
                    </div>
                </div>
                <label className={`flex flex-col space-y-2`}>
                    标题:
                    <input 
                        onChange={(e) => handleState(e.target.name, e.target.value)}
                        value={state.title}
                        name={`title`}
                        type={`text`}
                        className={`bg-gray-700 text-white rounded p-2`}
                    />
                </label>
                <label className={`flex flex-col space-y-2`}>
                    作者:
                    <input
                        onChange={(e) => handleState(e.target.name, e.target.value)}
                        value={state.author}
                        name={`author`}
                        type={`text`}
                        className={`bg-gray-700 text-white rounded p-2`}
                    />
                </label>
                <label className={`flex w-full justify-center items-center`}>
                    <mdui-button onClick={handleSubmit} className={`w-32 `}>
                        上传
                    </mdui-button>
                </label>
            </div>
        </div>
    );
}
