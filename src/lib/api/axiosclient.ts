import axios, {
	AxiosError,
	AxiosInstance,
	InternalAxiosRequestConfig,
} from "axios";
import { toast } from "sonner";

const axiosClient: AxiosInstance = axios.create({
	baseURL: "https://scale-padi.onrender.com/api/v1",
	withCredentials: true,
	timeout: 5000000,
});

const publicEndpoints = ["/login/admin", "/invite/admin/"];

axiosClient.interceptors.request.use(
	async (config) => {
		if (
			publicEndpoints.some((endpoint) => config.url?.includes(endpoint))
		) {
			return config;
		}

		const token = localStorage.getItem("token");

		if (!token) {
			// If no token, redirect to signin for protected routes
			window.location.href = "/signin";
			return Promise.reject(
				new Error("Authentication required")
			);
		}

		if (token && config.headers) {
			config.headers["scale-padi-token"] = `${token}`;
		}

		return config;
	},
	(error) => {
		return Promise.reject(error);
	}
);

axiosClient.interceptors.response.use(
	(response) => response,
	async (error: AxiosError) => {
		if (error.response) {
			const status = error.response.status;
			const message = (error.response?.data as { message?: string })?.message || "";

			// Check for any variant of unauthorized or invalid token errors
			const isAuthError =
				status === 401 ||
				(status === 403 &&
					(message.toLowerCase().includes("token") ||
						message.toLowerCase().includes("denied") ||
						message.toLowerCase().includes("unauthorized")));

			if (isAuthError) {
				const currentPath = window.location.pathname;
				if (currentPath !== "/signin" && currentPath !== "/") {
					localStorage.clear();
					toast.error("Session Expired", {
						description: "Your session has timed out. Please sign in again.",
						duration: 5000,
					});
					setTimeout(() => {
						window.location.href = "/signin";
					}, 1000);
				}
			}
		}
		return Promise.reject(error);
	}
);

export { axiosClient };
