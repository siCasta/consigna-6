export const getProducts = async (req, res, next) => {
    const response = await fetch('http://localhost:8080/api/products')
    const products = await response.json()

    res.render('getProducts', {
        products: products.data
    })
}

export const createProduct = (req, res, next) => {
    res.render('createProduct')
}