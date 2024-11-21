"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const express_session_1 = __importDefault(require("express-session"));
const parentRoutes_1 = __importDefault(require("../routes/parentRoutes"));
const doctorRoutes_1 = __importDefault(require("../routes/doctorRoutes"));
const adminRoutes_1 = __importDefault(require("../routes/adminRoutes"));
const doctorModel_1 = __importDefault(require("../databases/doctorModel"));
const path_1 = __importDefault(require("path"));
const feedbackModel_1 = __importDefault(require("../databases/feedbackModel"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const createServer = () => {
    try {
        const app = (0, express_1.default)();
        const corsOptions = {
            origin: 'https://new-one-pi.vercel.app',
            credentials: true,
            methods: 'GET,PUT,PATCH,POST,DELETE',
            allowedHeaders: 'Content-Type,Authorization',
        };
        // Apply CORS middleware
        app.use((0, cors_1.default)(corsOptions));
        app.use((0, cookie_parser_1.default)());
        app.use((0, express_session_1.default)({
            secret: 'your_secret_key',
            resave: false,
            saveUninitialized: true,
            cookie: { secure: true },
        }));
        app.use(express_1.default.json());
        app.use(express_1.default.urlencoded({ extended: true }));
        app.use('/uploads', express_1.default.static(path_1.default.resolve(__dirname, '../../uploads')));
        console.log(path_1.default.resolve(__dirname, '../../../uploads'));
        app.use('/api/parents', parentRoutes_1.default);
        app.use('/api/doctor', doctorRoutes_1.default);
        app.use('/api/admin', adminRoutes_1.default);
        app.get('/api/fetch-doctors', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
            try {
                const page = parseInt(req.query.page) || 1;
                const limit = parseInt(req.query.limit) || 6;
                const search = req.query.search || '';
                const specialization = req.query.specialization || '';
                const minRating = req.query.minRating ? parseFloat(req.query.minRating) : undefined;
                const skip = (page - 1) * limit;
                const searchFilter = { isVerified: true };
                if (search) {
                    searchFilter.doctorName = { $regex: search, $options: 'i' };
                }
                if (specialization) {
                    searchFilter.specialization = { $regex: specialization, $options: 'i' };
                }
                const totalDoctors = yield doctorModel_1.default.aggregate([
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
                const doctors = yield doctorModel_1.default.aggregate([
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
                }
                else {
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
            }
            catch (error) {
                next(error);
            }
        }));
        app.get('/api/testimonials', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
            try {
                const testimonials = yield feedbackModel_1.default.find().populate('parentId', 'parentName').exec();
                const shuffledTestimonials = testimonials.sort(() => 0.5 - Math.random());
                const randomTestimonials = shuffledTestimonials.slice(0, 3);
                res.status(200).json({
                    success: true,
                    data: randomTestimonials,
                });
            }
            catch (error) {
                next(error);
            }
        }));
        app.get('/', (req, res) => {
            console.log('welcome to homepage');
        });
        //error middleware
        app.use((err, req, res, next) => {
            console.error(err.stack);
            const statusCode = err.statusCode || 500;
            const message = err.message || 'Internal server error!';
            res.status(statusCode).json({
                success: false,
                message: message,
            });
        });
        return app;
    }
    catch (error) {
        console.log(error);
    }
};
exports.default = createServer;
