import { Request, Response } from "express";
import prisma from "../models/user"
import { hashPassword } from "../services/passwordService";



export const getAllUser = async(req:Request,res:Response):Promise<void> =>{
    try {
        const allUsers = await prisma.findMany();
        if(allUsers.length===0){
            res.status(204).json([])
            return
        }
        res.status(200).json({allUsers})
    } catch (error:any) {
        
        res.status(500).json({error:"there was an error, try again later"})
    }

}

export const getUserById = async(req:Request,res:Response):Promise<void>=>{
    const idUser=parseInt(req.params.id);;

    try {
        const user = await prisma.findUnique({
            where:{id:idUser}
        })
        if(!user){
            res.status(404).json({error:"the user doesn´t exists"})
        }
        res.status(200).json({user})
    } catch (error:any) {
        res.status(500).json({message:error.message})
        
    }

}
export const postCreateUser=async(req:Request,res:Response):Promise<void>=>{
      const {email,password} = req?.body;

    try {
        if(!email){
          res.status(400).json({error:"email is required"})
          return;
        }
        if(!password){
            res.status(400).json({error:"password is required"})
            return;
        }
        const hashedPassword = await hashPassword(password);
        const user =await prisma.create({
            data:{
                email,
                password:hashedPassword,
            }
        })
        res.status(201).json({user});
        
    } catch (error:any) {
        
        //error si el email ya existe
        if(error?.code ==='P2002' && error?.meta?.target?.includes('email')){

            res.status(400).json({message:"the email already exists"})

        }
        res.status(400).json({message:error.message})
    }

}
export const putUser = async(req:Request,res:Response):Promise<void>=>{

    const userId= parseInt(req.params.id);
    const {email,password}= req.body;

       try {
        let dataUser:any = {...req?.body}
        if(password){
            const hashedPassword= await hashPassword(password);
            dataUser.password=hashedPassword

        }
        if(email){
            dataUser.email=email;
        }

        const user = await prisma.update(
            {
                where:{
                    id:userId
                },
                data:dataUser
            }
        )
        if(!user){
            res.status(404).json({error:"the user was not found"})
        }
        res.status(201).json({user})


       } catch (error) {
        
       }
}
export const deleteUser =async(req:Request,res:Response):Promise<void>=>{
    const userId= parseInt(req.params.id);
    try {
        await prisma.delete({
            where:{
                id:userId
            }
        })
        res.status(200).json({message:`the user ${userId} was deleted`})
        
    } catch (error) {
        console.log(error)
        res.status(500).json({error:"there is an error,please try again later"})
    }
}