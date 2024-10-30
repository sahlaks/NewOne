import mongoose from "mongoose";
import IChild from "../../domain/entity/Child";
import IParent from "../../domain/entity/Parents";
import INotification from "../../domain/entity/notification";
import IFeedback from "../../domain/entity/feedback";
import IReview from "../../domain/entity/review";

export interface IParentRepository {
    findParentByEmail(email: string): Promise<IParent | null>;
    saveUserDetails(data: IParent): Promise<IParent | null>;
    saveUser(data: IParent, password: string, isGoogleSignUp: boolean): Promise<IParent | null>
    updateUserDetails(email: string, password: string): Promise<IParent | null>;
    findDetailsById(id: string): Promise< IParent | null>;
    saveParent(data: IParent): Promise<IParent | null>;
    updateParentPassword(id: string, password: string): Promise<IParent | null>
    findParent(page: number, limit: number): Promise<IParent[] | null>
    findParentByIdandUpdate(id: string, update: object): Promise<IParent | null>
    findAndDeleteById(id: string): Promise<IParent | null>
    updateParentChildren(parentId: mongoose.Types.ObjectId, childIds: mongoose.Types.ObjectId[]): Promise<IParent | null>
    updateParentOnDelete(kidId: mongoose.Types.ObjectId, parentId: string): Promise<boolean>
    countDocuments(): Promise<number>
    updateParentwithPayment(appointmentId: string, parentId: string): Promise<boolean>
    getNotifications(id: string): Promise<INotification[] | null>
    makeRead(id: string): Promise<boolean>
    saveData(feedbackData: Partial<IFeedback>): Promise<boolean>
    submitReview(reviewData: Partial<IReview>): Promise<boolean>
    findFeedbacks(id: string): Promise<IReview[] | null>
}