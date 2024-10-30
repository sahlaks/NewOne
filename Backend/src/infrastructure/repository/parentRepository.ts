import IParent from "../../domain/entity/Parents";
import parentModel from "../databases/parentModel";
import { IParentRepository } from "../../usecases/interface/IParentRepository";
import IChild from "../../domain/entity/Child";
import childModel from "../databases/childModel";
import mongoose, { Schema, Types } from "mongoose";
import INotification from "../../domain/entity/notification";
import notificationModel from "../databases/notificationModel";
import feedbackModel from "../databases/feedbackModel";
import IFeedback from "../../domain/entity/feedback";
import IReview from "../../domain/entity/review";
import reviewModel from "../databases/reviewModel";

export class ParentRepository implements IParentRepository {
  /*..............................find user through email............................................*/
  async findParentByEmail(email: string): Promise<IParent | null> {
    const parent = await parentModel.findOne({ email }).exec();
    return parent;
  }

  /*................................................save a user...................................................*/
  async saveUserDetails(data: IParent): Promise<IParent | null> {
    try {
      const savedUser = await parentModel.create(data);
      return savedUser;
    } catch (error) {
      console.error("Error in saveUserDetails:", error);
      return null;
    }
  }

  /*.....................................saving user through google authentication.......................................*/
  async saveUser(
    data: IParent,
    password: string,
    isGoogleSignUp: boolean
  ): Promise<IParent | null> {
    try {
      const newUser = new parentModel({
        ...data,
        password,
        isGoogleSignUp,
      });
      const parent = await newUser.save();
      return parent;
    } catch (error) {
      console.error("Error saving user to database:", error);
      return null;
    }
  }

  /*...............................................save new password......................................*/
  async updateUserDetails(
    email: string,
    password: string
  ): Promise<IParent | null> {
    const parent = await parentModel.findOneAndUpdate(
      { email: email },
      { $set: { password: password } },
      { new: true }
    );
    return parent;
  }

  /*..........................................find a user throug ID........................................*/
  async findDetailsById(id: string): Promise<IParent | null> {
    const parent = await parentModel.findById(id);
    return parent;
  }

  /*..........................................update parent data........................................*/
  async saveParent(data: IParent): Promise<IParent | null> {
    try {
      const parent = await parentModel.findOneAndUpdate(
        { email: data.email },
        data,
        { new: true, upsert: true }
      );
      return parent;
    } catch (error) {
      console.error("Error updating parent:", error);
      return null;
    }
  }

 /*.....................................find by id then update password..........................................*/
 async updateParentPassword(id: string, password: string): Promise<IParent | null> {
  const doctor = await parentModel.findByIdAndUpdate({_id: id},{$set: {password: password}},{new: true})
  return doctor
}

/*.................................................find whole data...........................................*/
async findParent(page: number, limit: number): Promise<IParent[] | null> {
  const skip = (page - 1) * limit;
  const parents = await parentModel.find() .skip(skip).limit(limit).populate('children').exec();
  return parents
}

async countDocuments(): Promise<number> {
  return parentModel.countDocuments()
}
/*....................................................find and update by blocking..................................*/
async findParentByIdandUpdate(id: string, update: object): Promise<IParent | null> {
  const parent = await parentModel.findByIdAndUpdate({_id: id},{$set: update},{new: true})
  return parent
}

/*............................................find and delete..........................................*/
async findAndDeleteById(id: string): Promise<IParent | null> {
  const parent = await parentModel.findByIdAndDelete(id)
  return parent
}

/*...........................................update with child Ids...................................................*/
async updateParentChildren(parentId: Types.ObjectId, childIds: Types.ObjectId[]): Promise<IParent | null> {
  return await parentModel.findByIdAndUpdate(parentId,  { $push: { children: { $each: childIds } } },  { new: true })
} 

/*........................................update parent on deleting kid.....................................*/
async updateParentOnDelete(kidId: Types.ObjectId, parentId: string): Promise<boolean> {
  const result = await parentModel.updateOne(
    { _id: parentId },                       
    { $pull: { children: kidId } }     
    );
    return result.modifiedCount > 0
}

/*.......................................update payment id.......................................*/
async updateParentwithPayment(appointmentId: string, parentId: string): Promise<boolean> {
  try{
    const appointmentObjectId = new mongoose.Types.ObjectId(appointmentId);
    const res = await parentModel.findByIdAndUpdate(
    parentId,
    { $addToSet: { appointments: appointmentObjectId } },
    { new: true }
  )
  if (res) {
    return true;
  } else {
    return false;
  }
} catch (error) {
  return false;
}
}

/*..............................................all notifications.............................................*/
async getNotifications(id: string): Promise<INotification[] | null> {
  try{
    const notifications = await notificationModel.find({parentId: id, toParent: true}).sort({createdAt: -1})
    return notifications
  } catch (error) {
    return null;
  }
  }

  /*........................................update to read................................................*/
  async makeRead(id: string): Promise<boolean> {
    try{
      await notificationModel.findByIdAndUpdate(id,{$set: {isRead: true}})
      return true
      } catch (error) {
      return false;
    }
  }
  
  /*........................................feedback............................................*/
  async saveData(feedbackData: Partial<IFeedback>): Promise<boolean> {
    try{
    const savedOne = new feedbackModel(feedbackData); 
    await savedOne.save()
    return true
  } catch (error) {
    return false;
  }
}

/*..............................................submit review....................................*/
async submitReview(reviewData: Partial<IReview>): Promise<boolean> {
  try{
    const review = new reviewModel(reviewData);
    const save = await review.save()
    return true
  }catch(error){
    return false
  }
}

/*.............................................feedbacks..........................................*/
async findFeedbacks(dId: string): Promise<IReview[] | null> {
  try{
    const id =  new mongoose.Types.ObjectId(dId);
    const feedbacks = await reviewModel.find({doctorId:id})
    return feedbacks;
  }catch(err){
    return null
  }
}
}


