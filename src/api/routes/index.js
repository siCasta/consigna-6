import { Router } from 'express'
import fs from 'fs'
import { __dirname } from '../../__dirname.js'
import { join } from 'path'

const router = Router()
const files = fs.readdirSync(join(__dirname, './api/routes'))

files.forEach(async file => {
    if (file.includes('.routes.js')) {
        const name = file.split('.')[0]
        const route = (await import(`./${file}`)).default
        router.use(`/${name}`, route)
    }
})

export default router