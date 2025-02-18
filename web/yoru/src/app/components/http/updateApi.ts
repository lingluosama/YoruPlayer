import {$http} from "@/app/components/http/http"; 
export const AddSingleToAlbum=(data:{
    aid:string,
    sid:string
})=>{
    return $http(
        "POST",
        "/file/album/add",
        data,
        false
    )    
}

export const DeleteSingleFromAlbum=(data:{
    sid:string
})=>{
    return $http(
        "POST",
        "/file/album/delete",
        data,
        false
    )    
}

