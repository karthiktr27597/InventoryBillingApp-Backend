import express from "express";
import { productRouter } from "./Routes/product.js";
import mongoose from "mongoose";
import cors from "cors";
import { invoiceRouter } from "./Routes/invoice.js";
import { userRouter } from "./Routes/user.js";
import { isAuthenticated } from "./Authentication/Auth.js";
import dotenv from "dotenv";
const app = express();
dotenv.config()

//PORT

const PORT = process.env.PORT || 9000

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URL,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => console.log("MongoDB connected"))


//middleware
app.use(express.json())
app.use(cors())


// application middleware
app.use("/product", isAuthenticated, productRouter)
app.use("/invoice", isAuthenticated, invoiceRouter)
app.use("/", userRouter)


// test
app.get("/", (req, res) => {
    res.send("<h1>Welcome to InventoryBillingAPI, Please Navigate</h1>")
})


app.listen(`${PORT}`, () => console.log(`server started in localhost:${PORT}`))