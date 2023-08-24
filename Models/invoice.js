import mongoose from "mongoose";


// Invoice Schema

const itemSchema = new mongoose.Schema(
    {
        // productId: {
        //     type: mongoose.Schema.Types.ObjectId,
        //     ref: "product",
        //     required: true
        // },
        productName: {
            type: String,
            required: true
        },
        quantity: {
            type: Number,
            required: true
        },
        subtotal: {
            type: Number,
            required: true
        }
    }
)


const invoiceSchema = new mongoose.Schema(
    {
        customername: {
            type: String
        },
        items: [itemSchema],

        totalAmount: {
            type: Number,
            required: true
        },
        timestamp: {
            type: Date,
            default: Date.now
        }
    }
)

// Model

export const invoice = mongoose.model("invoice", invoiceSchema)