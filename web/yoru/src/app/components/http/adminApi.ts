import {$http} from "@/app/components/http/http";


export const DeleteHandler=(data:{
    target:string,
    id:string,
    uid:string
})=>{
    return $http(
        "POST",
        "/admin/delete",
        data,
        false
    )    
}
export const GrantAdmin=(data:{
    uid:string,
    id:string,
    remove:string
})=>{
    return $http(
        "POST",
        "/admin/grant",
        data,
        false
    )
}