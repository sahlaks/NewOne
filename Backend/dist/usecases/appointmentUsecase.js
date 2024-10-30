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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppointmentUseCase = void 0;
class AppointmentUseCase {
    constructor(appointmentRepository, parentRepository, doctorRepository) {
        this.iappointmentRepository = appointmentRepository;
        this.iparentRepository = parentRepository;
        this.idoctorRepository = doctorRepository;
    }
    /*..............................saving appointment details...................................*/
    savePendingAppointment(details) {
        return __awaiter(this, void 0, void 0, function* () {
            const appointment = Object.assign(Object.assign({}, details), { appointmentStatus: "Pending", paymentStatus: "Pending" });
            const savedAppointment = yield this.iappointmentRepository.saveData(appointment);
            if (savedAppointment)
                return { status: true, message: 'Appointment Saved', data: savedAppointment };
            else
                return { status: false, message: 'Failed to save' };
        });
    }
    /*.............................updating success payment...................................*/
    updateSuccessPayment(id, parentId) {
        return __awaiter(this, void 0, void 0, function* () {
            const update = yield this.iappointmentRepository.updateData(id);
            if (update) {
                const message = `New appointment scheduled for ${update.childId ? update.name : 'a child'} for you on ${update.date} from ${update.startTime} to ${update.endTime}.`;
                const notificationData = {
                    parentId: update.parentId,
                    doctorId: update.doctorId,
                    appointmentId: update._id,
                    message: message,
                    isRead: false,
                    toParent: false,
                };
                const notify = yield this.iappointmentRepository.sendNotification(notificationData);
                const parent = yield this.iparentRepository.updateParentwithPayment(update._id, parentId);
                return { status: true, message: 'Updated Successfully', data: update };
            }
            else
                return { status: false, message: 'Failed to save' };
        });
    }
    /*.......................................failure updating...........................................*/
    updateFailurePayment(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const update = yield this.iappointmentRepository.updateFailure(id);
            if (update)
                return { status: true, message: 'Updated Successfully' };
            return { status: false, message: 'Failed to update' };
        });
    }
    /*.........................................get appointments.......................................*/
    fetchAppointment(id, page, limit) {
        return __awaiter(this, void 0, void 0, function* () {
            const appointments = yield this.iappointmentRepository.fetchAppointments(id, page, limit);
            const totalAppointments = yield this.iappointmentRepository.countDocuments(id);
            const totalPages = Math.ceil(totalAppointments / limit);
            if (appointments)
                return { status: true, message: 'Appointments details fetched successfully', data: appointments, totalPages: totalPages };
            return { status: false, message: 'Error in fetching appointments details' };
        });
    }
    /*.........................................fetch doctor's appointments...........................*/
    fetchDoctorsAppointments(id, page, limit) {
        return __awaiter(this, void 0, void 0, function* () {
            const appointments = yield this.iappointmentRepository.fetchDoctorAppointments(id, page, limit);
            const total = yield this.iappointmentRepository.countDoctorDocuments(id);
            const totalPages = Math.ceil(total / limit);
            if (appointments)
                return { status: true, message: 'Appointments fetched successfully!!', data: appointments, totalPages: totalPages };
            return { status: false, message: 'Error in fetching appointments details' };
        });
    }
    /*........................................change status of appointment..................................*/
    changeStatusOfAppointment(appointmentId, status, doctorId) {
        return __awaiter(this, void 0, void 0, function* () {
            const update = yield this.iappointmentRepository.updateAppointment(appointmentId, status);
            if (update) {
                const message = `Dear Parent, your appointment has been ${status} for ${update.childId ? update.name : 'a child'} on ${update.date} from ${update.startTime} to ${update.endTime}.`;
                const notificationData = {
                    parentId: update.parentId,
                    doctorId: update.doctorId,
                    appointmentId: update._id,
                    message: message,
                    isRead: false,
                    toParent: true,
                };
                yield this.iappointmentRepository.sendNotification(notificationData);
                if (status === 'Scheduled')
                    yield this.idoctorRepository.updateDoctorwithApointment(update._id, doctorId);
                return { status: true, message: 'Status updated successfully!', data: update };
            }
            return { status: false, message: 'Error in updating status' };
        });
    }
    /*.............................status to completed.................................*/
    changeToCompleted(appointmentId, doctorId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.iappointmentRepository.updateAppointment(appointmentId, 'Completed');
            return { status: true, message: 'Status updated successfully!' };
        });
    }
    /*....................................save prescription......................................*/
    savePrescription(data) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.iappointmentRepository.updateAndSave(data);
            return { status: true };
        });
    }
    /*............................................fetch prescription..................................*/
    fetchPrescription(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const res = yield this.iappointmentRepository.findUsingId(id);
            if (res)
                return { status: true, data: res };
            return { status: false };
        });
    }
    /*...........................................history...........................................*/
    getHistory(childId, doctorId, name) {
        return __awaiter(this, void 0, void 0, function* () {
            const res = yield this.iappointmentRepository.findUsingChildId(childId, doctorId, name);
            if (res)
                return { status: true, data: res };
            return { status: false, message: 'No history!' };
        });
    }
}
exports.AppointmentUseCase = AppointmentUseCase;
