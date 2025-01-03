import { SvgDoubleLeft } from "../../assets/svg/DoubleLeft"; 
import { SvgDoubleRight } from "../../assets/svg/DoubleRight"; 
import {useState} from "react"; 

export function PageIndexer(props) {
    const currentIndex = props.offset/props.peace;
    const totalPages = Math.ceil(props.length / props.peace)
    
    return (
        <div className={props.className}> 
            <SvgDoubleLeft className={`w-16 h-16 hover:bg-white hover:rounded-2xl hover:bg-opacity-10`} onclick={props.pre} />
            <div className={`w-1/4 flex flex-row space-x-5 justify-between`}>
                { 
                    Array.from({ length: Math.ceil(props.length / props.peace) }).map((_, index) => (
                        index-1<=currentIndex&&currentIndex<=index+1&&<div 
                            key={index} 
                            className={ 
                                (currentIndex===index) ?
                                `w-3 text-center bg-white rounded-2xl text-black` : 
                                ``
                            }
                        > 
                            {index + 1} 
                        </div>
                    ))
                }
                {(totalPages > currentIndex + 2) && ( <div>...{totalPages} </div> )}

            </div>
            <SvgDoubleRight className={`w-16 h-16 hover:bg-white hover:rounded-2xl hover:bg-opacity-10`} onclick={props.next} />
        </div>
    );
}
