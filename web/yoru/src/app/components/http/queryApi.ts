import {$http} from "@/app/components/http/http"; 
import {list} from "postcss";

export const GetAlbumDetail=(data:{aid:string})=>{
    return $http(
        "GET",
        "/query/album/message",
        data,
        false
    )
}

export const GetSingleDetail=(data:{sid:string})=>{
    return $http(
        "GET",
        "/query/single/message",
        data,
        false        
    )
}
export const GetSangListDetail=(data:{lid:string})=>{
    return $http(
        "GET",
        "/query/sanglist/message",
        data,
        false
    )
    
}

export const QueryList=(data:{
    target:string,
    begin:number,
    size:number,
    keyword:string,
})=>{
    return $http(
        "GET",
        "/query/list",
        data,
        false
    )
}

export const GeyAuthorByName=(data:{
    name:string,
})=>{
    return $http(
     "GET",
     "/query/author/name",
     data,
     false   
    )
    
}
export const GetAuthorPage=(data:{
    name:string,
})=>{
    return $http(
        "GET",
        "/query/author/message",
        data,
        false
    )
}
