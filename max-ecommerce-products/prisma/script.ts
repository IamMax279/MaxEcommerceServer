import { PrismaClient } from "@prisma/client"

interface Product {
    name: string
    category: string
    quantity: number
    price: number
}

const insertProducts = async () => {
    try {
        const prisma = new PrismaClient()

        const products: Product[] = [
            {
                name: "Gaming PC",
                category: "technology",
                quantity: 10,
                price: 899.99
            },
            {
                name: "Sweater",
                category: "clothing",
                quantity: 20,
                price: 69.99
            },
            {
                name: "Wardrobe",
                category: "furniture",
                quantity: 30,
                price: 599.99
            },
            {
                name: "Backpack",
                category: "school",
                quantity: 40,
                price: 99.99
            },
        ]

        for(const product of products) {
            await prisma.product.upsert({
                where: {name: product.name},
                update: product,
                create: product
            })
        }
    } catch(error) {
        //won't happen
    }
}

insertProducts()