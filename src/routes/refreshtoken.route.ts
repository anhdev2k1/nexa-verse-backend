import express, { Request, Response } from 'express'

const router = express.Router()

router.post('/refresh-token', async (req: Request, res: Response) => {
  const { refreshToken } = req.body
})

export const refreshTokenRouter = router
