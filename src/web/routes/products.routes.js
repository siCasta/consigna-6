import { Router } from 'express'
import { getProducts, createProduct } from '../controllers/products.controller.js'

const router = Router()

router.get('/', getProducts)
router.get('/create', createProduct)

export default router