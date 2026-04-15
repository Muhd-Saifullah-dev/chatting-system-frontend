import { apiClient } from "@/lib/api-client";
import { LOGIN_ROUTE, SIGNUP_ROUTE } from "@/utils/constant";

export const signup_api = async (email, password) => {
  try {
    const response = await apiClient.post(SIGNUP_ROUTE, { email, password });
    const data = await response.data;
    localStorage.setItem("accessToken", `Bearer ${data.data.accessToken}`);
    return data.data.user
  } catch (error) {
    const message = error?.response?.data?.message || "Signup failed";

    throw new Error(message);
  }
};

export const login_api = async (email, password) => {
  try {
    const response = await apiClient.post(
      LOGIN_ROUTE,
      { email, password },
      { withCredentials: true },
    );
    const data = await response.data;
    localStorage.setItem("accessToken", `Bearer ${data.data.accessToken}`);
    console.log("data",data)
    return data.data.user
  } catch (error) {
    const message = error?.response?.data?.message || "Signup failed";

    throw new Error(message);
  }
};
