export function TowRowStripDisplayer(props) {
    return (
        <div className=" w-full flex flex-col space-y-5">
            <div className="w-full flex flex-row space-x-12">
                {props.list.map((item, index) => {
                    if (index % 2 === 0) {
                        return <SingleStrip Onclick={()=>{props.goDetail(index)}}  key={index} src={`http://${item.cover}`} name={item.title} />;
                    }
                })}
            </div>
            <div className="w-full flex flex-row space-x-12">
                {props.list.map((item, index) => {
                    if (index % 2 !== 0) {
                        return <SingleStrip Onclick={()=>{props.goDetail(index)}} key={index} src={`http://${item.cover}`} name={item.title} />;
                    }
                })}
            </div>
        </div>
    );
}

export function SingleStrip(props) {
    return (
        <div onClick={()=>{props.Onclick()}}  className="w-1/4 flex rounded-2xl flex-row items-center bg-white bg-opacity-15 space-x-2">
            <img src={props.src} className="m-1 rounded-2xl flex h-20 w-20 object-cover" alt="img" />
            <div className="text-white text-xl flex text-ellipsis w-1/2 overflow-hidden whitespace-nowrap text-overflow-ellipsis">
                {props.name}
            </div>
        </div>
    );
}
