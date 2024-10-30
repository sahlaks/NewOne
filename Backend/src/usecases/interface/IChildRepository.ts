import mongoose, { Schema } from "mongoose";
import IChild from "../../domain/entity/Child";

export interface IChildRepository{
    saveChild(data: IChild[], parentId: mongoose.Types.ObjectId): Promise<IChild[] | null>;
    findChild(parentId: mongoose.Types.ObjectId): Promise<IChild[] | null>
    validateChild(data: IChild[], parentId: mongoose.Types.ObjectId): Promise<IChild[] | null>
    deleteById(id: string): Promise<{message: string} | null>
}

