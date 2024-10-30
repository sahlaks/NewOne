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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChildRepository = void 0;
const childModel_1 = __importDefault(require("../databases/childModel"));
class ChildRepository {
    /*...................................saving child to database.......................................*/
    saveChild(data, parentId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Add parentId to each child object
                const childrenWithParentId = data.map(child => {
                    const { _id } = child, rest = __rest(child, ["_id"]);
                    return Object.assign(Object.assign({}, rest), { parentId });
                });
                // Use insertMany to insert all documents at once
                const savedChildren = yield childModel_1.default.insertMany(childrenWithParentId);
                const plainChildren = savedChildren.map(child => child.toObject());
                return plainChildren;
            }
            catch (error) {
                console.error('Error saving children:', error);
                return null;
            }
        });
    }
    /*......................................find child data..........................................*/
    findChild(parentId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const child = yield childModel_1.default.find({ parentId: parentId }).exec();
                return child.length ? child : null;
            }
            catch (error) {
                return null;
            }
        });
    }
    /*............................................check whether child exist or not....................................*/
    validateChild(data, parentId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const filter = {
                    parentId: parentId,
                    $or: data.map(child => ({
                        name: child.name,
                        age: child.age,
                        gender: child.gender
                    }))
                };
                const existingChildren = yield childModel_1.default.find(filter);
                if (existingChildren.length > 0) {
                    return existingChildren;
                }
                return null;
            }
            catch (error) {
                return null;
            }
        });
    }
    /*..........................................delete-id......................................*/
    deleteById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield childModel_1.default.findByIdAndDelete(id);
                if (!result)
                    return null;
                return { message: 'Kid deleted successfully' };
            }
            catch (error) {
                console.error('Error deleting kid from database:', error);
                return null;
            }
        });
    }
}
exports.ChildRepository = ChildRepository;
