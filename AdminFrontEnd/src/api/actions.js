// actions/signup.js
import Axios from "axios"
const signUpAction = async ({
    request
}) => {
    try {
        const formData = await request.formData()

        const email = formData.get("email")
        const password = formData.get("password")
        const name = formData.get("name")
        const cpassword = formData.get("cpassword")

        if (password.toLowerCase() !== cpassword.toLowerCase()) {
            return {
                error: true,
                success: false,
                message: "Password and confirm password must match",
            }
        }

        const payLoad = {
            name,
            email,
            password
        }
        const response = await Axios.post("http://localhost:8080/api/user/signup", payLoad)
        let data = response.data;
        return data
    } catch (error) {
        return {
            error: true,
            success: false,
            message: error.response.data.message || "Signup failed. Please try again.",
        }
    }
}

const logInAction = async ({
    request
}) => {
    try {
        let formData = await request.formData()
        let email = formData.get("email");
        let password = formData.get("password");
        if (!email || !password) {
            return {
                message: "Password and Email must be filled",
                success: false,
                error: true
            }
        }
        const data = {
            email,
            password
        }
        const response = await Axios.post("http://localhost:8080/api/user/logIn", data)
        localStorage.setItem("accessToken", email)
        return response.data;
    } catch (error) {
        return {
            error: true,
            success: false,
            message: error.response.data.message || "LogIn failed. Please try again.",
        }
    }
}
const verifyEmailOtpAction = async ({
    request
}) => {
    try {
        const formData = await request.formData();
        const otp = formData.get("otp");
        const email = formData.get("email");

        const data = JSON.stringify({
            otp,
            email
        });

        const response = await Axios.post(
            "http://localhost:8080/api/user/verify-email-otp",
            data, {
                headers: {
                    "Content-Type": "application/json"
                }
            }
        );

        console.log("message", response.data.message);
        return response.data;
    } catch (error) {
        console.error(error.response.data || error.message);
        return {
            error: true,
            success: false,
            message: (error.response.data.message) ||
                error.message ||
                "Something went wrong",
        };
    }
};
const forgotPasswordAction = async ({
    request
}) => {
    try {
        let formData = await request.formData();
        let email = formData.get("email")
        console.log("email", email)
        let payload = JSON.stringify({
            email
        })
        let response = await Axios.post("http://localhost:8080/api/user/forgot-password", payload, {
            headers: {
                "Content-Type": "application/json"
            }
        })
        let data = response.data
        return data
    } catch (error) {
        console.error(error.response.data || error.message);
        return {
            error: true,
            success: false,
            message: (error.response.data.message) ||
                error.message ||
                "Something went wrong",
        };
    }
}

const verifyPasswordResetOtpAction = async ({
    request
}) => {
    try {
        const formData = await request.formData();
        const otp = formData.get("otp");
        const email = formData.get("email");

        const data = JSON.stringify({
            otp,
            email
        });

        const response = await Axios.post(
            "http://localhost:8080/api/user/verify-password-otp",
            data, {
                headers: {
                    "Content-Type": "application/json"
                }
            }
        );

        console.log("message", response.data.message);
        return response.data;
    } catch (error) {
        console.error(error.response.data || error.message);
        return {
            error: true,
            success: false,
            message: (error.response.data.message) ||
                error.message ||
                "Something went wrong",
        };
    }
};
const passwordResetAction = async ({
    request
}) => {
    try {
        const formData = await request.formData()

        const email = formData.get("email")
        const password = formData.get("password")
        const cpassword = formData.get("cpassword")

        if (password.toLowerCase() !== cpassword.toLowerCase()) {
            return {
                error: true,
                success: false,
                message: "Password and confirm password must match",
            }
        }

        const payLoad = {
            email,
            password
        }
        const response = await Axios.post("http://localhost:8080/api/user/reset-password", payLoad, {
            headers: {
                "Content-Type": "application/json"
            }
        })
        let data = response.data;
        return data
    } catch (error) {
        return {
            error: true,
            success: false,
            message: error.response.data.message || "Reset failed. Please try again.",
        }
    }
}

export {
    verifyPasswordResetOtpAction,
    forgotPasswordAction,
    logInAction,
    passwordResetAction
}