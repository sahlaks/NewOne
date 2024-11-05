import IChat from "../../domain/entity/chat";
import IDoctor from "../../domain/entity/doctor";
import IParent from "../../domain/entity/Parents";

export interface IChatRepository {
    findDoctor(search: string): Promise<IDoctor[]>
    findParent(search: string): Promise<IParent[]>
    getMessages(sender: string, receiver: string, role: string): Promise<IChat[] | null>
    saveMessage(message: Partial <IChat>): Promise<IChat | null>
    findChats(id: string): Promise<IChat[] | null>
    findDoctorChats(id: string): Promise<IChat[] | null>
    deleteChat(id: string, docId: string): Promise<boolean>
    deleteChatDoctor(id: string, pId: string): Promise<boolean>
}