import jwt from "jsonwebtoken"
import dotenv from "dotenv"

dotenv.config()

const secretKey = process.env.SECRET_KEY

export const generateJWT = (user) => {

    // const option = {
    //     expiresIn: "30d"
    // }

    return jwt.sign(user, secretKey)

}

export const isAuthenticated = async (req, res, next) => {

    const token = await req.headers["x-auth-token"]

    if (!token) {
        return res.status(401).json({ message: "Invalid Authorization" })
    }

    jwt.verify(token, secretKey, (err, decoded) => {
        if (err) {
            if (err.name = "TokenExpiredError") {
                return res.status(401).json({ message: "Token expired" })
            }
            return res.status(500).json({ message: "Failed Authentication token" })
        }
        next();
    })
}