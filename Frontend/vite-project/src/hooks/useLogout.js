import { logout } from "../lib/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const useLogout = () => {
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    const {
    mutate: logoutMutation,
    isPending,
    error,
} = useMutation({
        mutationFn: logout,
        onSuccess: () => {
            toast.success("Logged out successfully");
            // Clear token from localStorage
            localStorage.removeItem('authToken');
            queryClient.setQueryData(["authUser"], null);
            queryClient.invalidateQueries({ queryKey: ["authUser"] });
            navigate("/login");
        },
        onError: (error) => {
            console.error("Logout error:", error);
        },
    });

    return { logoutMutation, isPending, error };
};

export default useLogout;