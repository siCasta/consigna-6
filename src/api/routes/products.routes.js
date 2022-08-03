import { Router } from 'express'
import { getProducts, createProduct, updateProduct, deleteProduct, getProduct } from '../controllers/products.controller.js'

const router = Router()

router.route('/')
    .get(getProducts)
    .post(createProduct)

router.route('/:id')
    .get(getProduct)
    .put(updateProduct)
    .delete(deleteProduct)


export default router
