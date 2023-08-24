import { generateJWT } from "../Authentication/Auth.js";


export const login = async (req, res) => {
    try {
        const { username, password } = req.body;
        if (!username && !password) {
            return res.status(400).json({ message: "Enter username and password" })
        }
        if (username !== "admin" && password !== "admin@123") {
            return res.status(200).json({ message: "Invalid username or password" })
        }
        const token = generateJWT({ username, password })
        return res.status(200).json({ token: token })
    } catch (error) {
        console.error("Error found", error)
        return res.status(500).json({ message: "Internal server error" })
    }

}