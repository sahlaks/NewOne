import { Request, Response, NextFunction } from "express";
import { AdminUseCase } from "../usecases/adminUsecases";
import { bool } from "aws-sdk/clients/signer";

export class AdminController{
    constructor( private AdminUsecase: AdminUseCase) {}

    /*...........................................admin login..............................................*/
    async adminLogin(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
        try{
        const {email, password} = req.body;
        const admin = await this.AdminUsecase.findAdmin(email,password);

        if(!admin.status){
            return res.status(400).json({ success: false,  message: 'Admin not found' });
        }
        res.cookie('access_token',admin.token,{httpOnly: true})
        res.json({ success: true, message: admin.message, data: admin.data });
        } catch (error) {
            next(error)
        }
    }


    /*.........................................parents data.......................................................*/
    async fetchParents(req: Request, res: Response, next: NextFunction): Promise<Response | void>{
        try{
          const page = parseInt(req.query.page as string) || 1;
          const limit = parseInt(req.query.limit as string) || 6;
      
            const parents = await this.AdminUsecase.collectParentData(page,limit);
            if(parents) return res.status(200).json({success: true, message: parents.message, data: parents.data,  totalPages: parents.totalPages, currentPage: page});
            else return res.status(400).json({success: false, message: 'No data available'})
          } catch (error) {
            next(error);
          }
        }

    /*..........................................block a parent............................................*/
    async blockAParent(req: Request, res: Response, next: NextFunction): Promise<Response | void>{
        const id = req.params.id;
        try{
            const result = await this.AdminUsecase.findParentAndBlock(id)
            if (result.status) return res.status(201).json({ success: true, data: result.data });
            else return res.status(400).json({ success: false, message: result.message });
        } catch(error){
            next(error)
        }
    }

    /*...........................................delete a parent.............................................*/
    async deleteAParent(req: Request, res: Response, next: NextFunction): Promise<Response | void>{
       const id = req.params.id
       try{
        const result = await this.AdminUsecase.findAndDelete(id)
        if(result.status) return res.status(200).json({success: true, message: result.message})
        return res.status(400).json({success: false, message: result.message})
       } catch(err){
        next(err)
       }
    }

    /*................................................get all doctors....................................*/
    async fetchdoctors(req: Request, res: Response, next: NextFunction): Promise<Response | void>{
        try{
          const searchQuery = req.query.search as string || '';
          const page = parseInt(req.query.page as string) || 1; 
          const limit = parseInt(req.query.limit as string) || 6;
          const isVerified = req.query.isVerified as any
          let doctors, totalDoctors
          if (searchQuery) {
            doctors = await this.AdminUsecase.collectDoctorData(searchQuery, page, limit, isVerified);
            totalDoctors = await this.AdminUsecase.countSearchResults(searchQuery, isVerified);
          } else {
            doctors = await this.AdminUsecase.collectDocData(page, limit, isVerified);
            totalDoctors = await this.AdminUsecase.countAllDoctors(isVerified);
          }
        if(doctors) return res.status(200).json({success: true, data: doctors.data,  totalPages: Math.ceil(totalDoctors / limit),
          currentPage: page,});
        else return res.status(400).json({success: false, message: 'No data available'})
      } catch (error) {
        next(error);
      }
    }

    /*...........................................block a doctor............................................*/
    async blockDoctor(req: Request, res: Response, next: NextFunction): Promise<Response | void>{
        try {
          const { id } = req.params;
          const result = await this.AdminUsecase.findAndBlockDoctor(id);
          if (result.status) return res.status(201).json({ success: true, data: result.data });
          else return res.status(400).json({ success: false, message: result.message });
      } catch(error){
          next(error)
      }
    }

    /*........................................verify a doctor...............................*/
    async verifyDoctor(req: Request, res: Response, next: NextFunction): Promise<Response | void>{
    try {
        const { id } = req.params;
        const result = await this.AdminUsecase.verifyDoctorwithId(id);
        if (result.status) return res.status(201).json({ success: true, message: result.message, data: result.data });
        else return res.status(400).json({ success: false, message: result.message });
      } catch (error) {
        next(error)
      }
    }

    /*.................................................delete a doctor.......................................*/
    async deleteDoctor(req: Request, res: Response, next: NextFunction): Promise<Response | void>{
        try{
            const { id } = req.params;
            const result = await this.AdminUsecase.deleteDoctorwithId(id);
            if (result.status) return res.status(201).json({ success: true, data: result.data });
            else return res.status(400).json({ success: false, message: result.message });
          } catch (error) {
            next(error)
          }
        }

    
    /*.........................................reject a profile.........................................*/
    async rejectDoctor(req: Request, res: Response, next: NextFunction): Promise<Response | void>{
    try{
      const {id} = req.params
      const { reason } = req.body 
      const result = await this.AdminUsecase.rejectWithId(id,reason)
      if(result.status) return res.status(201).json({ success: true, message: result.message});
      else return res.status(400).json({ success: false, message: result.message });
    } catch (error) {
      next(error)
    }    
}

/*.......................................fetch appointmets...................................*/
async fetchAppointments(req: Request, res: Response, next: NextFunction): Promise<Response | void>{
  try{
    const result = await this.AdminUsecase.collectAppointments()
    if(result.status) return res.status(201).json({ success: true, message: result.message, data: result.data});
      else return res.status(400).json({ success: false, message: result.message });
    } catch (error) {
      next(error)
    }    
}

/*.......................................fetch appointmets...................................*/
async fetchGenderData(req: Request, res: Response, next: NextFunction): Promise<Response | void>{
  try{
    const result = await this.AdminUsecase.collectGenderDetails()
    if(result.status) return res.status(201).json({ success: true, message: result.message, data: result.data});
      else return res.status(400).json({ success: false, message: result.message });
    } catch (error) {
      next(error)
    }    
}

/*.......................................appointment status...................................*/
async fetchAppointmentStatus(req: Request, res: Response, next: NextFunction): Promise<Response | void>{
  try{
    const result = await this.AdminUsecase.collectAppointmentDetails()
    if(result.status) return res.status(201).json({ success: true, message: result.message, data: result.data});
      else return res.status(400).json({ success: false, message: result.message });
    } catch (error) {
      next(error)
    }  
}

/*.......................................user growth...................................*/
async fetchUserCount(req: Request, res: Response, next: NextFunction): Promise<Response | void>{
  try{
    const result = await this.AdminUsecase.collectUserDetails()
    if(result.status) return res.status(201).json({ success: true, message: result.message, data: result.data});
      else return res.status(400).json({ success: false, message: result.message });
    } catch (error) {
      next(error)
    }  
}

/*.........................................slot usage...................................*/
async fetchSlotUsage(req: Request, res: Response, next: NextFunction): Promise<Response | void>{
  try{
    const result = await this.AdminUsecase.collectSlots()
    if(result.status) return res.status(201).json({ success: true, message: result.message, data: result.data});
      else return res.status(400).json({ success: false, message: result.message });
    } catch (error) {
      next(error)
    }  
}
}