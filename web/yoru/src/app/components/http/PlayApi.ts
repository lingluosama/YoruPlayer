import {$http} from "@/app/components/http/http";


export const GetPlayQueue=(data:{
    uid:string
})=>{
    return $http(
        "GET",
        "/play/query",
        data,
        false
    )
}
export const AddToQueue=(data:{
    uid:string,
    sid:string,
    target:string,
})=>{
    return $http(
        "POST",
        "/play/add",
        data,
        false
        
    )
}
export const DeleteToQueue=(data:{
    uid:string,
    sid:string
})=>{
    return $http(
        'POST',
        "/play/delete",
        data,
        false
    )
}
export const ReplaceQueue=(data:{
    target:string,
    id:string,
    uid:string
})=>{
    return $http(
        "GET",
        "/play/replace",
        data,
        false
    )
}
export const GetUserPlayHistory=(data:{
    uid:string
})=>{
    return $http(
        "GET",
        "/play/history",
        data,
        false
    )
}