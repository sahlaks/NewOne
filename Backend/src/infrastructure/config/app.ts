import express, { Request, Response, NextFunction } from 'express'
import cors from 'cors';
import cookieParser from 'cookie-parser';
import session from 'express-session';

import parentRouter from '../routes/parentRoutes';
import doctorRouter from '../routes/doctorRoutes';
import adminRouter from '../routes/adminRoutes';
import doctorModel from '../databases/doctorModel';
import path from 'path';
import feedbackModel from '../databases/feedbackModel';
import dotenv from 'dotenv'
import reviewModel from '../databases/reviewModel';

dotenv.config()
const createServer = () => {
  try {
    const app: express.Application = express()

    const allowedOrigins = [
      'http://localhost:3000',
      'https://new-one-pi.vercel.app/',
    ]
    const corsOptions = {
      origin: (origin: any, callback: any) => {
        if (allowedOrigins.includes(origin) || !origin) {
          callback(null, true);
        } else {
          callback(new Error('Not allowed by CORS'));
        }
      },
      credentials: true,
      methods: 'GET,PUT,PATCH,POST,DELETE',
      allowedHeaders: 'Content-Type,Authorization',
    }

    // Apply CORS middleware
    app.use(cors(corsOptions))
    app.use(cookieParser())
    app.use(
      session({
        secret: 'your_secret_key',
        resave: false,
        saveUninitialized: true,
        cookie: { secure: false },
      })
    )
    
    app.use(express.json())
    app.use(express.urlencoded({ extended: true }))
    app.use('/uploads', express.static(path.resolve(__dirname, '../../../uploads')));

    app.use('/api/parents',parentRouter)
    app.use('/api/doctor', doctorRouter)
    app.use('/api/admin', adminRouter)
    
    app.get('/api/fetch-doctors', async (req: Request, res: Response, next: NextFunction) => {
      try {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 6; 
        const search = req.query.search as string || '';
        const specialization = req.query.specialization as string || '';
        const minRating = req.query.minRating ? parseFloat(req.query.minRating as string) : undefined;
    
        const skip = (page - 1) * limit;

        const searchFilter: any = { isVerified: true };
        if (search) {
            searchFilter.doctorName = { $regex: search, $options: 'i' };
        }
        if (specialization) {
            searchFilter.specialization = { $regex: specialization, $options: 'i' };
        }

       
        const totalDoctors = await doctorModel.aggregate([
          { $match: searchFilter },
          {
              $lookup: {
                  from: 'reviews',
                  localField: '_id',
                  foreignField: 'doctorId',
                  as: 'reviews'
              }
          },
          {
              $addFields: {
                  averageRating: { $ifNull: [{ $avg: "$reviews.reviewRating" }, 0] }
              }
          },
          ...(minRating !== undefined ? [{ 
              $match: { 
                  averageRating: minRating === 5 ? { $eq: 5 } : { $gte: minRating } 
              }
          }] : []),
          { 
              $count: "totalDoctors"
          }
      ]);
      
      const totalDoctorsCount = totalDoctors.length > 0 ? totalDoctors[0].totalDoctors : 0;
        
        const totalPages = Math.ceil(totalDoctorsCount / limit);

      const doctors = await doctorModel.aggregate([
        {
            $match: searchFilter
        },
        {
            $lookup: {
                from: 'reviews',
                localField: '_id',
                foreignField: 'doctorId',
                as: 'reviews'
            }
        },
        {
            $addFields: {
                averageRating: { $avg: "$reviews.reviewRating" }
            }
        },
        ...(minRating !== undefined ? [{ 
          $match: { 
              averageRating: minRating === 5 ? { $eq: 5 } : { $gte: minRating } 
          }
      }] : []),
        {
            $skip: skip  
        },
        {
            $limit: limit 
        },
        {
            $project: { 
                _id: 1,
                doctorName: 1,
                specialization: 1,
                image: 1,
                averageRating: 1,
            }
        }
    ]);
        if (doctors.length > 0) {
          res.status(200).json({
            success: true,
            message: 'Doctors fetched successfully',
            data: {
              doctors,
              pagination: {
                totalPages,
                currentPage: page,
                totalDoctors,
                perPage: limit
              }
            }
          });
        } else {
          res.status(200).json({
            success: false,
            message: 'No doctors found for the specified criteria',
            data: {
              doctors: [],
              pagination: {
                totalPages,
                currentPage: page,
                totalDoctors: 0,
                perPage: limit
              }
            }
          });
        }
      } catch (error) {
        next(error);
      }
    });
    
    app.get('/api/testimonials', async (req: Request, res: Response, next: NextFunction) => {
      try {
        const testimonials = await feedbackModel.find().populate('parentId', 'parentName').exec();
        const shuffledTestimonials = testimonials.sort(() => 0.5 - Math.random());
        const randomTestimonials = shuffledTestimonials.slice(0, 3);
        res.status(200).json({
          success: true,
          data: randomTestimonials,
        });
      } catch (error) {
       next(error)
      }
    })

    app.get('/',(req: Request,res: Response)=>{
      console.log('welcome to homepage')
    })

    //error middleware
    app.use((err: any, req: Request, res: Response, next: NextFunction) => {
      console.error(err.stack)
      const statusCode = err.statusCode || 500;
      const message = err.message || 'Internal server error!';
      res.status(statusCode).json({
        success: false,
        message: message,})
    })
    return app
  } catch (error) {
    console.log(error)
  }
}

export default createServer