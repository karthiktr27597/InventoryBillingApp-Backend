import { invoice } from "../Models/invoice.js";
import { product } from "../Models/product.js";

// Create new invoice

export const createInvoice = async (req, res) => {
    const session = await product.startSession();
    session.startTransaction();

    try {
        const { products, totalAmount } = req.body;
        console.log(products, "products")
        console.log("totalAmount", totalAmount)

        const invoiceProducts = [];

        for (const prod of products) {
            // console.log("prod", prod)
            const fetchedProduct = await product.findById(prod._id);
            //  console.log("check", fetchedProduct)

            if (!fetchedProduct) {
                await session.abortTransaction();
                session.endSession();
                return res.status(404).json({ error: `Product with ID ${product.productId} not found` });
            }

            if (fetchedProduct.quantity < prod.quantity) {
                await session.abortTransaction();
                session.endSession();
                return res.status(400).json({ error: `Insufficient quantity for product ${fetchedProduct.name}` });
            }

            console.log(fetchedProduct.quantity, "db")
            console.log(prod.quantity, "Invoice")

            fetchedProduct.quantity -= prod.quantity;  //  197 = 197-1  
            await fetchedProduct.save();

            invoiceProducts.push({
                productName: prod.name,
                quantity: prod.quantity,
                subtotal: prod.quantity * prod.price
            });

            // console.log(fetchedProduct, "save")
            console.log("array", invoiceProducts)
        }

        const newInvoice = new invoice({
            items: invoiceProducts,
            totalAmount: totalAmount
        });

        await newInvoice.save();

        await session.commitTransaction();
        session.endSession();

        res.status(201).json(newInvoice);
    } catch (error) {
        console.error('Error creating invoice:', error);
        await session.abortTransaction();
        session.endSession();
        res.status(500).json({ error: 'Error creating invoice' });
    }
}


export const getSaleData = async (req, res) => {
    try {
        // const startOfDay = new Date();
        // startOfDay.setHours(0, 0, 0, 0);

        // invoice.aggregate([
        //     {
        //         $match: {
        //             timestamp: { $gte: startOfDay }
        //         }
        //     },
        //     {
        //         $group: {
        //             _id: {
        //                 day: { $dayOfMonth: '$timestamp' },
        //                 month: { $month: '$timestamp' },
        //                 year: { $year: '$timestamp' }
        //             },
        //             totalAmount: { $sum: '$totalAmount' }
        //         }
        //     },
        //     {
        //         $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 }
        //     }
        // ])
        //     .then(dailySales => {
        //         console.log(dailySales);
        //         res.status(200).json({ data: dailySales })
        //         // Process and display the daily sales report
        //     })
        //     .catch(error => {
        //         console.error('Error generating daily sales report:', error);
        //     });
        const currentDate = new Date();
        const currentYear = currentDate.getFullYear();
        const currentMonth = currentDate.getMonth();

        const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate(); // Get number of days in the current month
        const startOfMonth = new Date(currentYear, currentMonth, 1);
        const endOfMonth = new Date(currentYear, currentMonth, daysInMonth, 23, 59, 59, 999);

        const salesData = await invoice.aggregate([
            {
                $match: {
                    timestamp: { $gte: startOfMonth, $lte: endOfMonth }
                }
            },
            {
                $group: {
                    _id: {
                        day: { $dayOfMonth: '$timestamp' }
                    },
                    totalAmount: { $sum: '$totalAmount' }
                }
            },
            {
                $sort: { '_id.day': 1 }
            }
        ]);

        const dailySales = Array.from({ length: daysInMonth }, (_, index) => {
            const daySales = salesData.find(data => data._id.day === index + 1);
            return {
                _id: { day: index + 1 },
                totalAmount: daySales ? daySales.totalAmount : 0
            };
        });

        return res.json(dailySales);

    } catch (err) {
        console.log("Error:", err)
        return res.status(500).json({ message: 'Internal server Error' });
    }
}

export const getRequiredSalesData = async (req, res) => {
    try {
        const selectedYear = req.query.year;
        const selectedMonth = req.query.month;

        const daysInMonth = new Date(selectedYear, selectedMonth, 0).getDate(); // Get number of days in the current month
        const startOfMonth = new Date(selectedYear, selectedMonth - 1, 1);
        const endOfMonth = new Date(selectedYear, selectedMonth - 1, daysInMonth, 23, 59, 59, 999);


        const salesData = await invoice.aggregate([
            {
                $match: {
                    timestamp: { $gte: startOfMonth, $lte: endOfMonth }
                }
            },
            {
                $group: {
                    _id: {
                        day: { $dayOfMonth: '$timestamp' }
                    },
                    totalAmount: { $sum: '$totalAmount' }
                }
            },
            {
                $sort: { '_id.day': 1 }
            }
        ]);

        const dailySales = Array.from({ length: daysInMonth }, (_, index) => {
            const daySales = salesData.find(data => data._id.day === index + 1);
            return {
                _id: { day: index + 1 },
                totalAmount: daySales ? daySales.totalAmount : 0
            };
        });

        res.json(dailySales);

    } catch (error) {
        console.error('Error fetching daily sales data:', error);
        res.status(500).json({ error: 'Error fetching daily sales data' });
    }
}