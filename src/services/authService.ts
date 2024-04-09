import jwt from "jsonwebtoken";
import { User } from "../models/user.interface";


const JWT_SECRETKEY = process.env.JWT_SECRETKEY || "default-secret";

export const getToken = (user: User):string =>{
    return jwt.sign({id:user.id,email:user.email},JWT_SECRETKEY,{expiresIn:'1h'})

}