import mongoose, { FilterQuery } from "mongoose";
import IChild from "../../domain/entity/Child";
import childModel from "../databases/childModel";
import { IChildRepository } from "../../usecases/interface/IChildRepository";

export class ChildRepository implements IChildRepository{

    /*...................................saving child to database.......................................*/
    async saveChild(data:IChild[], parentId: mongoose.Types.ObjectId): Promise<IChild[] | null> {
        try {

            // Add parentId to each child object
            const childrenWithParentId = data.map(child => {
                const { _id, ...rest } = child;
                return {
                    ...rest,
                    parentId
                };
                });
            // Use insertMany to insert all documents at once
            const savedChildren = await childModel.insertMany(childrenWithParentId);
            const plainChildren = savedChildren.map(child => child.toObject());
            return plainChildren as IChild[];
        } catch (error) {
            console.error('Error saving children:', error);
            return null;
        }
    }

    /*......................................find child data..........................................*/
    async findChild(parentId: mongoose.Types.ObjectId): Promise<IChild[] | null> {
        try{
            const child = await childModel.find({ parentId: parentId }).exec()
            return child.length ? child : null;
        }catch(error){
            return null
        }
    }

    /*............................................check whether child exist or not....................................*/
    async validateChild(data: IChild[], parentId: mongoose.Types.ObjectId): Promise<IChild[] | null> {
        try{
            const filter: FilterQuery<IChild> = {
                parentId: parentId,
                $or: data.map(child => ({
                    name: child.name,
                    age: child.age,
                    gender: child.gender
                }))
            };

            const existingChildren = await childModel.find(filter);
            if (existingChildren.length > 0) {
                return existingChildren;
            }
            return null;
        } catch(error){
            return null
        }
    }

    /*..........................................delete-id......................................*/
    async deleteById(id: string): Promise<{message: string} | null> {
        try {
            const result = await childModel.findByIdAndDelete(id); 
            if (!result) return null;
            return { message: 'Kid deleted successfully' };
        } catch (error) {
            console.error('Error deleting kid from database:', error);
            return null
        }
    }
}

