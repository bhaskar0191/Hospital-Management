import express from 'express';
import Appointment from '../models/Appointment.js';
import authMiddleware from '../middleware/AuthMiddleware.js';

const router = express.Router();

// Create a new appointment
router.post('/create', authMiddleware, async (req, res) => {
    const { doctorId, patientId, date, reason, status } = req.body;
    try {
        if (req.user.role !== 'patient') {
            return res.status(403).json({ message: "Only patients can create appointments." });
        }
        const appointment = new Appointment({
            doctor: doctorId,
            patient: patientId,
            date: new Date(date),
            reason,
            status
        });
        await appointment.save();
        res.status(201).json(appointment);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
// Get appointments for a user
router.get('/appointments', authMiddleware, async (req, res) => {
    try {
        const appointments = await Appointment.find()
            .populate('doctor', 'name')
            .populate('patient', 'name')
            .sort({ date: 1 });

        res.status(200).json(appointments);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;