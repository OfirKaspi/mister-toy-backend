import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'

import { toyService } from './services/toy.service.js'
import { loggerService } from './services/logger.service.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express()


// App Configuration
const corsOptions = {
    origin: [
        'http://127.0.0.1:8080',
        'http://localhost:8080',
        'http://127.0.0.1:5173',
        'http://localhost:5173',
        'http://127.0.0.1:5174',
        'http://localhost:5174',
    ],
    credentials: true
}

app.use(cors(corsOptions))
app.use(cookieParser()) // for res.cookies
app.use(express.json()) // for req.body
app.use(express.static('public'))

// **************** Toys API ****************:
// List
app.get('/api/toy', async (req, res) => {
    try {
        const { name, maxPrice, inStock, pageIdx } = req.query
        const filterBy = { name, maxPrice: +maxPrice, inStock, pageIdx }
        console.log('filterBy from server', filterBy);

        const toys = await toyService.query(filterBy)
        res.send(toys)
    } catch (err) {
        loggerService.error('Cannot load toys', err)
        res.status(400).send('Cannot load toys')
    }
})

// Add
app.post('/api/toy', async (req, res) => {
    try {
        const { name, price, labels, inStock } = req.body
        const toy = { name, price: +price, labels, inStock }

        const savedToy = await toyService.save(toy)
        res.send(savedToy)
    } catch (err) {
        loggerService.error('Cannot add toy', err)
        res.status(400).send('Cannot add toy')
    }
})

// Edit
app.put('/api/toy', async (req, res) => {
    try {
        const { name, labels, price, _id, createdAt, inStock } = req.body
        const toy = { _id, createdAt, name, price: +price, labels, inStock }

        const savedToy = await toyService.save(toy)
        res.send(savedToy)
    } catch (err) {
        loggerService.error('Cannot update toy', err)
        res.status(400).send('Cannot update toy')
    }
})

// Read - getById
app.get('/api/toy/:toyId', async (req, res) => {
    try {
        const { toyId } = req.params

        const toy = await toyService.get(toyId)
        res.send(toy)
    } catch (err) {
        loggerService.error('Cannot get toy', err)
        res.status(400).send(err)
    }
})

// Remove
app.delete('/api/toy/:toyId', async (req, res) => {
    try {
        const { toyId } = req.params
        const msg = await toyService.remove(toyId)
        res.send({ msg, toyId: toyId })
    } catch (err) {
        loggerService.error('Cannot delete toy', err)
        res.status(400).send('Cannot delete toy, ' + err)
    }
})

// app.get('/**', (req, res) => {
//     res.sendFile(path.join(__dirname, 'public', 'index.html'))
// })

// Listen will always be the last line in our server!

const port = process.env.PORT || 3030
app.listen(port, () => {
    loggerService.info(`Server listening on port http://127.0.0.1:${port}/`)
})