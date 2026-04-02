import { HOST, REFRESH_TOKEN_ROUTE } from "@/utils/constant";
import axios from "axios";

export const apiClient = axios.create({
  baseURL: HOST,
  withCredentials: true,
});



let isRefreshing = false;
const decodedToken=(token)=>{
  try {
    const pureToken=token.replace("Bearer ","")
    const payload=JSON.parse(atob(pureToken.split(".")[1]))
    return payload
  } catch (error) {
    return null
  }
}

const isTokenExpirySoon=(token,bufferSeconds=120)=>{
  const decoded=decodedToken(token)
  if(!decoded?.exp) return true
  const currentTime=Math.floor(Date.now()/1000)
  const timeLeft=decoded.exp -currentTime
  return timeLeft < bufferSeconds
}

const refreshAccessToken=async()=>{
  try {
    const res=await apiClient.post(REFRESH_TOKEN_ROUTE)
    const newAccessToken=`Bearer ${res.data.data.accessToken}`
    localStorage.setItem("accessToken",newAccessToken)

    return newAccessToken
  } catch (error) {
    console.log("errrorrr",error)
  }
}

apiClient.interceptors.request.use(async(config)=>{
  if(config.url===REFRESH_TOKEN_ROUTE){
    return config
  }
  let token=localStorage.getItem("accessToken")
  if(token && isTokenExpirySoon(token) && !isRefreshing){
    try {
      isRefreshing=true
      token=await refreshAccessToken()
    } catch (error) {
      localStorage.removeItem("accessToken")
        window.location.href = "/login";
        return Promise.reject(error);
    }
    finally{
      isRefreshing=false
    }
  }
  if(token){
    config.headers.Authorization=token
  }
  return config
},

(error)=>Promise.reject(error)

)



let failedQueue = [];

// const proccessQueue = (error, token = null) => {
//   failedQueue.forEach((prom) => {
//     if (error) {
//       prom.reject(error);
//     } else {
//       prom.resolve(token);
//     }
//   });
//   failedQueue = [];
// };

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (originalRequest.url === REFRESH_TOKEN_ROUTE) {
      localStorage.removeItem("accessToken");
      window.location.href = "/login";
      return Promise.reject(error);
    }

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      console.log("1")
      try {
        const newAccessToken = await refreshAccessToken();
        originalRequest.headers.Authorization = newAccessToken;
        return apiClient(originalRequest);
      } catch (refreshError) {
        localStorage.removeItem("accessToken");
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);
