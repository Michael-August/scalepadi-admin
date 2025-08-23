import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from "axios";

const axiosClient: AxiosInstance = axios.create({
    baseURL: "https://scale-padi.onrender.com/api/v1",
    withCredentials: true,
    timeout: 5000000
})

const publicEndpoints = [
    "/login/admin",
]

axiosClient.interceptors.request.use(
    async (config) => {
        if(publicEndpoints.some(endpoint => config.url?.includes(endpoint))) {
            return config;
        }

        const token = localStorage.getItem("token");

        if(!token) throw new Error("No access token found in session");

        if (token && config.headers) {
            config.headers["scale-padi-token"] = `${token}`;
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
)

axiosClient.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error: AxiosError) => {
        const originalRequest = error.config as InternalAxiosRequestConfig & {
            _retry?: boolean;
        };

        if (error.response) {
            const status = error.response.status;
            const message = (error.response?.data as { message?: string })?.message || "An error occurred";

            if (status === 500) {
                
            }
        }

        return Promise.reject(error);
    }
);

export { axiosClient };
