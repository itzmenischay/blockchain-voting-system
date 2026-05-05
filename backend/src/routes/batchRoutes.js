import express from 'express'
import { getBatches } from '../controllers/batchController.js'

const router = express.Router()

router.get("/", getBatches)

export default router;