import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const generateAccessToken = (userID) =>
    jwt.sign({
        id: userID
    }, process.env.SECRET_KEY_ACCESS_TOKEN, {
        expiresIn: "1d"
    });

const generateRefreshToken = (userID) =>
    jwt.sign({
        id: userID
    }, process.env.SECRET_KEY_REFRESH_TOKEN, {
        expiresIn: "7d"
    });

export {
    generateAccessToken,
    generateRefreshToken
};