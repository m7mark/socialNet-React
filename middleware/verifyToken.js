import jwt from "jsonwebtoken"
import createError from "http-errors"

//token includes {id, roles}
export const allAndVerifyToken = (req, res, next) => {
  if (req.method === 'OPTIONS') { next() }
  try {
    const authHeader = req.headers.authorization
    if (!authHeader) { return next() }
    const token = authHeader.split(' ')[1]
    if (token.length < 1 || token === 'null') { return next() }
    const decodeData = jwt.verify(token, process.env.JWT_SEC)
    //include user data from token in to request
    req.user = decodeData
    next()
  } catch {
    return next(createError(500, "Wrong Token"))
  }
}
export const verifyToken = (req, res, next) => {
  if (req.method === 'OPTIONS') { next() }
  try {
    const authHeader = req.headers.authorization
    if (!authHeader) { return next(createError(500, "Empty Token")) }
    const token = authHeader.split(' ')[1]
    if (token.length < 1 || token === 'null') { return next(createError(500, "Empty Token")) }
    const decodeData = jwt.verify(token, process.env.JWT_SEC)
    //include user data from token in to request
    req.user = decodeData
    next()
  } catch {
    return next(createError(500, "Wrong Token"))
  }
}

export const verifyTokenAndAdmin = (req, res, next) =>
  verifyToken(req, res, () => {
    if (req.user?.roles.includes('ADMIN')) { return next() }
    else { return next(createError(500, "No permittion")) }
  })
