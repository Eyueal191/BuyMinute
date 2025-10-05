import jwt from "jsonwebtoken"
import dotenv from "dotenv"
dotenv.config()
const verifyAccessToken = (accessToken) => {
    let decode = jwt.verify(accessToken, SECRET_KEY_ACCESS_TOKEN)
    let userId = decode.id
    return userId;
}
const verifyRefershToken = (refreshToken) => {
    let decode = jwt.verify(refreshToken, SECRET_KEY_REFRESH_TOKEN)
    let userId = decode.id
    return userId;
}
export {
    verifyAccessToken,
    verifyRefershToken
}