import {$http} from "@/app/components/http/http"; 

export const GetAllTags=(data:{
})=>{
    return $http(
        "GET",
        "/recommend/tags",
        data,
        false
    )    
}

export const GetSangTags=(data:{
    sid:string
})=>{
    return $http(
        "GET",
        "/recommend/tag/single",
        data,
        false
    )
}

export const CreateTag=(data:{
    name:string,
})=>{
    return $http(
        "POST",
        "/recommend/tag/create",
        data,
        false
    )
}

export const AddTagToSang=(data:{
    sid:string,
    tag:string,
})=>{
    return $http(
        "POST",
        "/recommend/tag/add",
        data,
        false
    )
    
}

export const DropTagFromSang=(data:{
    sid:string,
    tag:string
})=>{
    return $http(
        "POST",
        "/recommend/tag/drop",
        data,
        false
    )
}
export const EraseTag=(data:{
    tag:string,
})=>{
    return $http(
        "POST",
        "/recommend/tag/erase",
        data,
        false
    )
}
export const GetRecommendSang=(data:{
    uid:string,
    target:string
})=>{
    return $http(
        "GET",
        "/recommend/result",
        data,
        false
    )
    
}

export const AddTagForSangList=(data:{
    lid:string,
    tag:string,
})=>{
    return $http(
        "POST",
        "/recommend/tag/add/sanglist",
        data,
        false
    )    
    
}

export const DropTagForSangList=(data:{
    lid:string,
    tag:string
})=>{
    return $http(
        "POST",
        "/recommend/tag/drop/sanglist",
        data,
        false
    )
    
}

export const GetSangListTag=(data:{
    lid:string
})=>{
    return $http(
        "GET",
        "/recommend/tag/sanglist",
        data,
        false        
    )
}
export const SearchTag=(data:{
    keyword:string,
    size:number,
    offset:number,
})=>{
    return $http(
        "GET",
        "/recommend/tag/search",
        data,
        false
        
    )
    
}
