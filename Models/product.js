import mongoose from "mongoose";

// Product Schema

const productSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            unique: true
        },
        description: {
            type: String,
        },
        price: {
            type: Number,
            required: true
        },
        quantity: {
            type: Number,
            required: true
        }
    }
)

// Model

export const product = mongoose.model("product", productSchema)


