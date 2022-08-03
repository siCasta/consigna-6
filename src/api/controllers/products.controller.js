import cacheC from '../../utils/cache.js'
import Products from '../models/Product.js'

const cache = new cacheC

export async function getProducts(req, res, next) {
    try {
        const productsCache = cache.get('products')

        if (!productsCache) {
            const productsDB = await Products.get()

            cache.set('products', productsDB)

            return res.status(200).json({
                message: 'Productos obtenidos correctamente',
                data: productsDB,
                status: 'success'
            })
        }

        return res.status(200).json({
            message: 'Productos obtenidos correctamente',
            data: productsCache,
            status: 'success'
        })

    } catch (err) {
        next(err)
    }
}

export async function getProduct(req, res, next) {
    try {
        const { id } = req.params

        const productCache = cache.get(`product-${id}`)

        if (!productCache) {
            const productDB = await Products.getById(id)

            if (!productDB) {
                return next({
                    status: 404,
                    message: 'Producto no encontrado'
                })
            }

            cache.set(`product-${id}`, productDB)

            return res.status(200).json({
                message: 'Producto obtenido correctamente',
                data: productDB,
                status: 'success'
            })
        }

        return res.status(200).json({
            message: 'Producto obtenido correctamente',
            data: productCache,
            status: 'success'
        })

    } catch (err) {
        next(err)
    }
}

export async function createProduct(req, res, next) {
    try {
        const { title, price, thumbnail } = req.body

        if (!title || !price || !thumbnail) {
            return next({
                status: 400,
                message: 'Todos los campos son obligatorios'
            })
        }

        const product = await Products.create({ title, price, thumbnail })
        const products = await Products.get()

        cache.set('products', products)

        return res.status(201).json({
            message: 'Producto creado correctamente',
            data: product,
            status: 'success'
        })
    } catch (err) {
        next(err)
    }
}

export async function updateProduct(req, res, next) {
    try {
        const { id } = req.params
        const { title, price, thumbnail } = req.body

        const product = await Products.getById(id)

        if (!product) {
            return next({
                status: 404,
                message: 'Producto no encontrado'
            })
        }

        if (!title || !price || !thumbnail) {
            return next({
                status: 400,
                message: 'Todos los campos son obligatorios'
            })
        }

        await Products.update(id, { title, price, thumbnail })
        const productUpdated = await Products.getById(id)

        cache.set(`product-${id}`, productUpdated)

        return res.status(200).json({
            message: 'Producto actualizado correctamente',
            status: 'success'
        })
    } catch (err) {
        next(err)
    }
}

export async function deleteProduct(req, res, next) {
    try {
        const { id } = req.params

        const product = await Products.getById(id)

        if (!product) {
            return next({
                status: 404,
                message: 'Producto no encontrado'
            })
        }

        await Products.deleteById(id)
        const products = await Products.get()

        cache.set('products', products)

        return res.status(200).json({
            message: 'Producto eliminado correctamente',
            status: 'success'
        })
    } catch (err) {
        next(err)
    }
}