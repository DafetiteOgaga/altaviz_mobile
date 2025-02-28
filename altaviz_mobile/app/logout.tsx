import React, { useEffect } from "react";
import { ActivityIndicator } from "react-native";
import Toast from "react-native-toast-message";
import { usePost } from "../requests/makeRequests";
import { useAsyncStorageMethods } from "../context/AsyncMethodsContext";
import { useColorMode } from "../constants/Colors";

interface notiType {
    type: string;
    msg: string;
}

interface UsePostReturn {
    postData: Record<string, any> | null;
    isPostError: string | null;
    isPostLoading: boolean;
    PostSetup: (url: string, formData: FormData) => Promise<void>;
}

// console.log('11111'.repeat(5))
export default function Logout() {
    console.log('22222'.repeat(5))
    const uniColorMode = useColorMode();
    const { removeItem } = useAsyncStorageMethods();
    const { postData, isPostError, isPostLoading, PostSetup }: UsePostReturn = usePost();

    const handleSubmit = () => {
        console.log('33333'.repeat(5))
        const formData = new FormData();
        formData.append("your_csrf_token", "your_csrf_token");

        PostSetup("logout/", formData);
    };

    useEffect(() => {
        console.log('44444'.repeat(5))
        // Automatically trigger logout on component mount
        handleSubmit();
    }, []);

    useEffect(() => {
        console.log('55555'.repeat(5))
        if (postData) {
            console.log('66666'.repeat(5))
            // Clear login data and show success toast
            removeItem("loginData");
            removeItem("baseUrl");
            removeItem("headerDetails");
            console.log("Removed login details");
            console.log("Response login:", postData);

            showToast({ type: "success", msg: "Logged out successfully" });
        } else if (isPostError) {
            console.log('77777'.repeat(5))
            // Show error toast
            console.log("Error (login):", isPostError);
            if (isPostError==='You are not logged in') {
                removeItem("loginData");
                removeItem("baseUrl");
                removeItem("headerDetails");
                console.log("Removed login details");
                showToast({ type: "error", msg: `${isPostError}. Data cleared.` });
            } else showToast({ type: "error", msg: isPostError });
        }
    }, [postData, isPostError]);

    const showToast = (data: notiType) => {
        console.log('88888'.repeat(5))
        console.log("Toast:", data);
        Toast.show({
            type: data.type, // 'success' | 'error' | 'info'
            text1: data.msg,
        });
    };

    return (
        <>{console.log('99999'.repeat(5))}
            {console.log({isPostLoading})}
            {isPostLoading && (
                <ActivityIndicator size="large" color={uniColorMode.buttonSpin} />
            )}
        </>
    );
}