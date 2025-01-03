import IChat from "../../domain/entity/chat";
import IDoctor from "../../domain/entity/doctor";
import IParent from "../../domain/entity/Parents";
import { IChatRepository } from "../../usecases/interface/IChatRepository";
import chatModel from "../databases/chatModel";
import doctorModel from "../databases/doctorModel";
import parentModel from "../databases/parentModel";

export class ChatRepository implements IChatRepository {
    /*......................................search.................................*/
    async findDoctor(search: string): Promise<IDoctor[]> {
        const res = await doctorModel.find( {doctorName: { $regex: search, $options: "i" }, isVerified: true})
        return res;
    }

    /*......................................search.................................*/
    async findParent(search: string): Promise<IParent[]> {
        const res = await parentModel.find( {parentName: { $regex: search, $options: "i" }})
        return res;
    }

    /*...............................get messages..................................*/
    async getMessages(sender: string, receiver: string, role: string): Promise<IChat[] | null> {
      console.log(role);
      const visibilityFilter = role === 'Doctor' ? {visibleToDoctor: true} : {visibleToParent: true}
      const res = await chatModel.find({  $and: [
        {
            $or: [
                { senderId: sender, receiverId: receiver },
                { senderId: receiver, receiverId: sender }
            ]
        },
        visibilityFilter
    ]
            }).sort({createdAt:1})
        if(res) return res
        return null
    }

    /*.........................................save message....................................*/
    async saveMessage(msg: Partial<IChat>): Promise<IChat | null> {
        const message = new chatModel(msg);
        const res = await message.save();
        if(res) return res
        return null
    }

    /*....................................find chats.......................................*/
    async findChats(id: string): Promise<IChat[] | null> {
            try {  
                const chatList = await chatModel.aggregate([
                    {
                      $match: {
                        $or: [
                          { senderId: id}, 
                          { receiverId: id }
                        ],
                        visibleToParent: true,
                      }
                    },
                    
                    {
                      $group: {
                        _id: {
                          $cond: [
                            { $eq: ["$senderId", id] },
                            "$receiverId",
                            "$senderId"
                          ]
                        },
                        lastMessage: { $last: "$$ROOT" }
                      }
                    },
                    {
                        $sort: { createdAt: -1 }
                      },
                    {
                      $addFields: {
                        doctorId: { $toObjectId: "$_id" } 
                      }
                    },
                    {
                      $lookup: {
                        from: "doctors",
                        localField: "doctorId",
                        foreignField: "_id",
                        as: "doctorInfo"
                      }
                    },
                    {
                      $unwind: "$doctorInfo"
                    },
                    {
                      $project: {
                        _id: 0,
                        doctorId: "$doctorInfo._id",
                        doctorName: "$doctorInfo.doctorName",
                        doctorImage: "$doctorInfo.image",
                        lastMessage: {
                          message: "$lastMessage.message",
                          createdAt: "$lastMessage.createdAt",
                          read: "$lastMessage.read",
                          senderId: "$lastMessage.senderId"
                        }
                      }
                    },
                    {
                        $sort: { "lastMessage.createdAt": -1 }
                      },
                  ]);
            return chatList
            } catch (error) {
              return null
            }
        };
          
    /*..................................................doctor chats.......................................................*/
    async findDoctorChats(id: string): Promise<IChat[] | null> {
        try {  
            const chatList = await chatModel.aggregate([
                {
                  $match: {
                    $or: [
                      { senderId: id}, 
                      { receiverId: id }
                    ],
                    visibleToDoctor: true,
                  }
                },
                
                {
                  $group: {
                    _id: {
                      $cond: [
                        { $eq: ["$senderId", id] },
                        "$receiverId",
                        "$senderId"
                      ]
                    },
                    lastMessage: { $last: "$$ROOT" }
                  }
                },
                {
                    $sort: { createdAt: -1 }
                  },
                {
                  $addFields: {
                    parentId: { $toObjectId: "$_id" } 
                  }
                },
                {
                  $lookup: {
                    from: "parents",
                    localField: "parentId",
                    foreignField: "_id",
                    as: "parentInfo"
                  }
                },
                {
                  $unwind: "$parentInfo"
                },
                {
                  $project: {
                    _id: 0,
                    parentId: "$parentInfo._id",
                    parentName: "$parentInfo.parentName",
                    parentImage: "$parentInfo.image",
                    lastMessage: {
                      message: "$lastMessage.message",
                      createdAt: "$lastMessage.createdAt",
                      read: "$lastMessage.read",
                      senderId: "$lastMessage.senderId"
                    }
                  }
                },
                {
                    $sort: { "lastMessage.createdAt": -1 }
                  },
              ])
              
        return chatList
        } catch (error) {
          return null
        }
    }

    /*...........................................delete chat.......................................*/
async deleteChat(id: string, docId: string): Promise<boolean> {
  const res = await chatModel.updateMany(
    {
      $or: [
        { senderId: id, receiverId: docId },
        { senderId: docId, receiverId: id }
      ]
    },
    { $set: { visibleToParent: false } }
  );
  return res.modifiedCount > 0;
}

/*...........................................delete chat.......................................*/
async deleteChatDoctor(id: string, pId: string): Promise<boolean> {
  const res = await chatModel.updateMany(
    {
      $or: [
        { senderId: id, receiverId: pId },
        { senderId: pId, receiverId: id }
      ]
    },
    { $set: { visibleToDoctor: false } }
  );
  return res.modifiedCount > 0;
}

}
