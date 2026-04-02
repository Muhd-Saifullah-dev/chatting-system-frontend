export const HOST=import.meta.env.VITE_SERVER_URL

export const AUTH_ROUTE="/auth"
export const SIGNUP_ROUTE=`${AUTH_ROUTE}/signup`
export const LOGIN_ROUTE=`${AUTH_ROUTE}/login`
export const REFRESH_TOKEN_ROUTE=`${AUTH_ROUTE}/refresh-token`
export const LOGOUT_ROUTE=`${AUTH_ROUTE}/logout`