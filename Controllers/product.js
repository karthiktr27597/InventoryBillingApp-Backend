import { product } from "../Models/product.js"

export const addProduct = async (req, res) => {
    try {
        console.log(req.body)
        const { name, description, price, quantity } = req.body

        if (!name || !price || !quantity) {
            return res.status(400).json({ message: "Invalid Input" })
        }

        const data = new product({
            name,
            description,
            price,
            quantity
        })

        console.log(data)

        await data.save()
            .then(() => {
                return res.status(200).json(data)
            })
            .catch((err) => {
                if (err.code === 11000) {
                    return res.status(400).json({ message: "Duplicate product" })
                }
                console.log(err)
                return res.status(400).json({ message: 'Failed to add product', Error: err })
            })

    } catch (err) {
        console.log(err)
        return res.status(500).json({ message: 'Internal server error' });
    }
}


export const getProduct = async (req, res) => {
    try {
        const products = await product.find({})
        return res.status(200).json(products)

    }
    catch (err) {
        console.log(err)
        return res.status(500).json({ messge: "Internal server Error" })
    }
}

export const deleteProduct = async (req, res) => {
    try {
        const { productId } = req.params
        await product.findByIdAndDelete(productId)
        return res.status(200).json({ message: "Product deleted successfully" })
    } catch (err) {
        console.log(err)
        return res.status(500).json({ messge: "Internal server Error" })
    }
}

export const findOneProduct = async (req, res) => {
    try {
        const { productId } = req.params
        const data = await product.find({ _id: productId })
        return res.status(200).json(data)
    } catch (err) {
        console.log(err)
        return res.status(500).json({ messge: "Internal server Error" })
    }
}

export const editProduct = async (req, res) => {
    try {
        const productId = req.params.productId;
        const updatedProductData = req.body;
        console.log(updatedProductData)

        const updatedProduct = await product.findByIdAndUpdate(productId, updatedProductData, { new: true });

        if (!updatedProduct) {
            return res.status(404).json({ error: `Product with ID ${productId} not found` });
        }

        res.json(updatedProduct);
    } catch (error) {
        console.error('Error updating product:', error);
        res.status(500).json({ error: 'Error updating product' });
    }
}

