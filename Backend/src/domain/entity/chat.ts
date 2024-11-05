import mongoose, { Document, Schema } from "mongoose";

interface IChat extends Document{
    _id: string
    senderId:string
    receiverId:string
    message:string
    read: boolean
    visibleToParent: boolean
    visibleToDoctor: boolean
    createdAt: Date;
    updatedAt: Date;
}

export default IChat;