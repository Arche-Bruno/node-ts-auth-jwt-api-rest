import { Request, Response } from "express";
import { comparePasswords, hashPassword } from "../services/passwordService";
import prisma from "../models/user";
import { getToken } from "../services/authService";




export const register = async(req:Request,res:Response):Promise<void>=>{

    const {email,password} = req.body;

    try {
        if(!email){
            res.status(400).json({message:"the email is required"})
            return;
       }
       if(!password){
            res.status(400).json({message:"the password is required"})
            return;
       }

        const hashedPassword = await hashPassword(password);
      

        const user = await prisma.create({
                data:{
                    email,
                    password:hashedPassword
                }
        })

        const token = getToken(user);
        res.status(201).json({token});

        
    } catch (error:any) {
      
        if(error?.code ==='P2002' && error?.meta?.target?.includes('email')){

            res.status(400).json({message:"the email already exists"})

        }
  
        res.status(500).json({error:"hubo un error en el registro"})
        
    }

}

export const login = async(req:Request,res:Response):Promise<void>=>{
    const {email,password}= req.body;
    if(!email){
        res.status(400).json({message:"the email is required"})
        return;
   }
   if(!password){
        res.status(400).json({message:"the password is required"})
        return;
   }

    try {
        const user = await prisma.findUnique(
            {
                where:{email}
            }
        );

        if(!user){
            res.status(404).json({error:'the user was not found'})
            return;

        }

        //if you have the same hashed password 
        
         const passwordMatch = await comparePasswords(password, user.password)
         if(!passwordMatch){
            res.status(401).json({error:'user and password do not match'})
         }
         const token = getToken(user);
         res.status(200).json({token})

    } catch (error:any) {
      
  
        res.status(500).json({error:"hubo un error en el registro"})
    }

}