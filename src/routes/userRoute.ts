import express, { NextFunction, Request, Response } from "express"
import jwt from "jsonwebtoken"
import { deleteUser, getAllUser, getUserById, postCreateUser, putUser } from "../controllers/usersController";
const router = express.Router();

//code to create our own middleware
const secret = process.env.JWT_SECRETKEY||"default-secret";

const authenticateToken =(req:Request,res:Response,next:NextFunction)=>{

    const headerToken = req.headers['authorization'];
    const token = headerToken && headerToken.split(' ')[1];
    if(!token){
        return res.status(401).json({error:'you aren´t autenticated'})
    }
    jwt.verify(token,secret,(err,decode)=>{
    if(err){
        return res.status(403).json({error:'you don´t have access'})
    }
    next();
    })
    
}

router.post('/',authenticateToken,postCreateUser)
router.get('/',authenticateToken,getAllUser)
router.get('/:id',authenticateToken,getUserById)
router.put('/:id',authenticateToken,putUser)
router.delete('/:id',authenticateToken,deleteUser);

export default router



