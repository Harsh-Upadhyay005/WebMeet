import { logout } from "../lib/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

const useLogout = () => {
    const queryClient = useQueryClient();

    const clearAuthAndRedirect = () => {
        // Clear token from localStorage
        localStorage.removeItem('authToken');
        // Clear all query cache
        queryClient.clear();
        toast.success("Logged out successfully");
        // Hard redirect to ensure clean state
        window.location.href = "/login";
    };

    const {
    mutate: logoutMutation,
    isPending,
    error,
} = useMutation({
        mutationFn: logout,
        onSuccess: () => {
            clearAuthAndRedirect();
        },
        onError: (error) => {
            console.error("Logout error:", error);
            // Even if API fails, clear local auth state and redirect
            clearAuthAndRedirect();
        },
    });

    return { logoutMutation, isPending, error };
};

export default useLogout;