import {$http} from "@/app/components/http/http"; 
export const AddSingleToAlbum=(data:{
    aid:string,
    sid:string
})=>{
    return $http(
        "GET",
        "/file/add/album",
        data,
        false
    )    
}
