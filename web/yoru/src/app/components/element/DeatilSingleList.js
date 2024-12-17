import { useEffect, useRef, useState } from "react"; 
import { GetAlbumDetail, GetAuthorPage, GetSangListDetail, GeyAuthorByName } from "../http/queryApi"; 
import { getColorFromImage } from "mdui"; 
import { ListItem } from "./ListItem"; 
import { $httpFormData } from "../http/FormDataApi"; 

export function DetailSingleList(props) {
    const imgRef = useRef(null);
    const [state, setState] = useState({
        title: "",
        type: "null",
        cover: "",
        description: "",
        author: "",
        sanglist: [],
        album_name: [],
        albumlist: [],
        color: '#fff',
        author_avatar: "",
        author_name: "",
    });
    
    const handleState = (name, value) => {
        setState(prevState => ({ ...prevState, [name]: value }));
    }

    const GetSangListData = async () => {
        const res = await GetSangListDetail({ lid: props.sanglist.id });
        handleState("sanglist", res.data.singles);
    }

    const GetAlbumListData = async () => {
        const res = await GetAlbumDetail({ aid: props.album.id });
        handleState("sanglist", res.data.singles);
    }

    const GetAuthorInfo = async () => {
        const res = await GeyAuthorByName({ name: props.album.author });
        handleState("author_avatar", res.data.avatar);
        handleState("author_name", res.data.name);
    }

    const GetSingleAlbum = async (sanglist) => {
        const ids = sanglist.map(item => item.album_id);
        const formData = new FormData();
        formData.append("ids", ids);
        const res = await $httpFormData(formData, "/query/album/names");
        handleState("album_name", res.data);
    }
    
    const GetAuthorData = async () => {
        const res = await GetAuthorPage({name: props.name});
        handleState("sanglist", res.data.sang_list);
        handleState("albumlist", res.data.album_list);
        handleState(`cover`,res.data.author.avatar)
    }

    useEffect(() => {
        async function fetchData() {
            switch (props.type) {
                case "album":
                    handleState("title", props.album.title);
                    handleState("type", "专辑");
                    handleState("cover", props.album.cover);
                    handleState("description", props.album.description);
                    await GetAlbumListData();
                    await GetAuthorInfo();
                    break;
                case "sanglist":
                    handleState("title", props.sanglist.title);
                    handleState("cover", props.sanglist.cover);
                    handleState("type", "歌单");
                    await GetSangListData();
                    break;
                case "author":
                    handleState("title", props.name);
                    handleState("type", "艺人");
                    await GetAuthorData();
                    break;
                default:
                    break;
            }
        }

        fetchData().then(() => {
            if (imgRef.current) {
                imgRef.current.addEventListener('load', async () => {
                    const color = await getColorFromImage(imgRef.current);
                    handleState("color", color);
                });
            }
        });

        return () => {
            if (imgRef.current) {
                imgRef.current.removeEventListener('load', async () => {
                    const color = await getColorFromImage(imgRef.current);
                    handleState("color", color);
                });
            }
        };
    }, [props.type]);

    useEffect(() => {
        if (state.sanglist&&state.sanglist.length > 0) {
            GetSingleAlbum(state.sanglist);
        }
        if (imgRef.current) {
            imgRef.current.addEventListener('load', async () => {
                const color = await getColorFromImage(imgRef.current);
                handleState("color", color);
            });
        }
    }, [state.sanglist]);

    useEffect(() => {
        if (imgRef.current && imgRef.current.complete) {
            (async () => {
                const color = await getColorFromImage(imgRef.current);
                handleState("color", color);
            })();
        }
    }, [state.cover]);

      return (
        <div className="m-8 rounded-2xl min-h-screen flex flex-col" style={{ backgroundImage: `linear-gradient(${state.color}, transparent)` }}>
            <div className="w-full h-64 m-8 flex flex-row space-x-5">
                <img 
                    ref={imgRef} 
                    src={`http://${state.cover}`}
                    alt="img"
                    crossOrigin="anonymous"
                    className="h-64 w-64 object-cover rounded-2xl"
                />
                <div className="flex w-4/5 flex-col justify-end space-y-3">
                    <div className="text-2xl">{state.type}</div>
                    <div className="text-white text-7xl flex overflow-hidden w-4/5 whitespace-nowrap text-overflow-ellipsis">{state.title}</div>
                    {state.type === "专辑" && <div className="">{state.description}</div>}
                    {state.type === "专辑" && (
                        <div className="w-full flex flex-row">
                            <img className="h-8 w-8 rounded-full" src={`http://${state.author_avatar}`} alt="img" />
                            <div className="text-xl font-bold hover:underline">{state.author_name}</div>
                        </div>
                    )}
                </div>
            </div>
            <div className="ml-8 mr-8 flex flex-row justify-between">
                <div className="w-2/3 ml-8 flex flex-row">
                    <div className="text-xl font-bold">#</div>
                    <div className="text-xl ml-10">标题</div>
                </div>
                <div className="text-xl items-start w-1/2">专辑</div>
                <div className="w-1/5 flex flex-row justify-between items-center">
                    <div className="w-1/3"></div>
                    <div className="w-1/3 text-xl">时长</div>
                    <div className="w-1/3"></div>
                </div>
            </div>
            <mdui-divider className="ml-8 mr-8"></mdui-divider>   
            <div className="flex flex-col ml-8 mr-8 bg-opacity-5">
                {state.sanglist && state.sanglist.map((item, index) => (
                    <ListItem
                        insanglist={true}
                        sid={item.id}
                        id={item.id}
                        displayIndex={true}
                        index={index}
                        key={index}
                        length={item.length}
                        src={item.cover}
                        title={item.title}
                        author={item.author}
                        album={state.album_name && state.album_name[index] ? state.album_name[index] : ""}
                    />
                ))}
            </div>
        </div>
    );
}
