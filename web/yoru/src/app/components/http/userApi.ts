import {$http} from "@/app/components/http/http";

export const UserLogin = (data: { username: string, password: string }) => {
    return $http(
        "GET",
        "/user/login",
        data,
        false
    );
};

export const UserRegister = (data: {
     username: string,
     password: string,
     email:string }) => {
    return $http(
        "POST",
        "/user/register",
        data,
        false
    )    
    
}
export const GetUserInfo=(data:{
    uid:string
})=>{
    return $http(
        "GET",
        "/user/info",
        data,
        false
    )
    
}
export const GetUserSangList=(data:{
    uid:string,
})=>{
    return $http(
        "GET",
        "/user/sanglist",
        data,
        false
    )
}
