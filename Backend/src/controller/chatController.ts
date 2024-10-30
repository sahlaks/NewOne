import { NextFunction, Request, Response } from "express";
import { AuthRequest } from "../domain/entity/types/auth";
import { ChatUseCase } from "../usecases/chatUsecases";
import { error } from "console";
import IChat from "../domain/entity/chat";

export class ChatController {
    constructor( private ChatUsecase: ChatUseCase) {}

    /*.................................search doctor..................................*/
    async searchDoctor(req: AuthRequest, res: Response, next: NextFunction): Promise<Response | void>{
        const userId = req.user?.id as string
        const searchQuery = req.query.search as string || "";
        try{
            const doctors = await this.ChatUsecase.collectDoctorData(searchQuery);
            if(doctors.status) return res.status(200).json({success: true, data: doctors.data})
            return res.status(400).json({success: false})
        } catch(err){
            next(err)
        }  
    }
    /*.................................search parent..................................*/
    async searchParent(req: AuthRequest, res: Response, next: NextFunction): Promise<Response | void>{
        const userId = req.user?.id as string
        const searchQuery = req.query.search as string || "";
        try{
            const parents = await this.ChatUsecase.collectParentData(searchQuery);
            if(parents.status) return res.status(200).json({success: true, data: parents.data})
            return res.status(400).json({success: false})
        } catch(err){
            next(err)
        }  
    }

    /*..............................................fetch messages of a doctor.............................*/
    async fetchMessages(req: AuthRequest, res: Response, next: NextFunction): Promise<Response | void>{
        const senderId = req.user?.id as string
        const receiverID = req.query.id as string
        try{
            const messages = await this.ChatUsecase.fetchMessagesUsingId(senderId,receiverID)
            if(messages.status) return res.status(200).json({success: true, data: messages.data})
            return res.status(400).json({success: false})
        } catch(err){
            next(err)
        }
    }

    /*.........................................save message............................................*/
    async saveMessage(req: Request, res: Response, next: NextFunction): Promise<Response | void>{
        const {senderId, receiverId, message, createdAt, read} = req.body.message
        try {
            const messageData: Partial<IChat> = {
              senderId,
              receiverId,
              message,
              read,
            }

            const msg = await this.ChatUsecase.saveMessage(messageData);
            if(msg.status) return res.status(200).json({success: true})
            return res.status(400).json({success: false})
        } catch(err){
            next(err)
        }
    }
    
    /*.....................................chat lists..................................*/
    async chatLists(req: AuthRequest, res: Response, next: NextFunction): Promise<Response | void>{
        const userId = req.user?.id as string;
        const role = req.user?.role as string;
        try{
            const chats = await this.ChatUsecase.fetchChatLists(userId, role)
            if(chats.status) return res.status(200).json({success: true, data: chats.data})
                return res.status(400).json({success: false})
        } catch(err){
            next(err)
        }
    }
}   