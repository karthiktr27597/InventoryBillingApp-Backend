import express from "express";
import { productRouter } from "./Routes/product.js";
import cors from "cors";
import { invoiceRouter } from "./Routes/invoice.js";
import { userRouter } from "./Routes/user.js";
import { isAuthenticated } from "./Authentication/Auth.js";
import dotenv from "dotenv";
import { connectToMonogDB } from "./ConnectDB.js";
const app = express();
dotenv.config()

//PORT

const PORT = process.env.PORT || 9000

// Connect to MongoDB
// mongoose.connect("mongodb+srv://karthiktr27597:kar@123@cluster0.sy8qw1c.mongodb.net/inventoryBillingDB?retryWrites=true&w=majority")
//{
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
// })
// .then(() => console.log("MongoDB connected"))

connectToMonogDB("mongodb://127.0.0.1:27017")
    .then(() => console.log("mongoDB connected via mongoosh"))
    .catch((err) => {
        console.log(err)
    })


//middleware
app.use(express.json())
app.use(cors())


// application middleware
app.use("/product", isAuthenticated, productRouter)
app.use("/invoice", isAuthenticated, invoiceRouter)
app.use("/", userRouter)


// test
app.get("/", (req, res) => {
    res.send("<h1>Hello World !</h1>")
})


app.listen(`${PORT}`, () => console.log(`server started in localhost:${PORT}`))