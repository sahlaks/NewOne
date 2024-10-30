import IChat from "../domain/entity/chat";
import IDoctor from "../domain/entity/doctor";
import IParent from "../domain/entity/Parents";
import { IChatRepository } from "./interface/IChatRepository";

export class ChatUseCase {
    private ichatRepository: IChatRepository;
    constructor(chatRepository: IChatRepository) {
        this.ichatRepository = chatRepository;
    }

    /*.....................................search doctor............................................*/
    async collectDoctorData(search: string): Promise<{status: boolean; data?: IDoctor[]}>{
        const res = await this.ichatRepository.findDoctor(search)
        if(res) return {status: true, data:res}
        else return {status:false}
    }

    /*.....................................search parent............................................*/
    async collectParentData(search: string): Promise<{status: boolean; data?: IParent[]}>{
        const res = await this.ichatRepository.findParent(search)
        if(res) return {status: true, data:res}
        else return {status:false}
    }

    /*................................fetch messages using ids....................................*/
    async fetchMessagesUsingId(sender: string,receiver: string): Promise<{status: boolean; data?: IChat[]}>{
        const res = await this.ichatRepository.getMessages(sender,receiver)
        if(res) return {status: true, data:res}
        else return {status:false}
    }

    /*.........................................save message....................................*/
    async saveMessage(message: Partial<IChat>): Promise<{status: boolean}>{
        const res = await this.ichatRepository.saveMessage(message)
        if(res) return {status: true}
        else return {status:false}
    }

    /*.............................................chat lists.............................................*/
    async fetchChatLists(id: string, role: string): Promise<{status: boolean; data?: IChat[]}>{
        let res;
        if(role === 'Parent')
            res = await this.ichatRepository.findChats(id)
        else
            res = await this.ichatRepository.findDoctorChats(id)
        if(res) return {status: true, data: res}
        else return {status:false}
    }
}