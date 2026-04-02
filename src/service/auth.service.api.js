import { apiClient } from "@/lib/api-client";
import { SIGNUP_ROUTE } from "@/utils/constant";

export const signup_api = async (email, password) => {
  try {
    const response = await apiClient.post(
      SIGNUP_ROUTE,
      { email, password },
    );
    const data = await response.data;
    localStorage.setItem("accessToken", `Bearer ${data.data.accessToken}`);
  } catch (error) {
    console.log("error",error);
  }
};


