import express from 'express';
import Appoinmemts from '../models/Appointment.js';
import authMiddleware from '../middleware/AuthMiddleware.js';

const router = express.Router();

// Create a new appointment
router.post('/create', authMiddleware, async (req, res) => {
    const { doctorId, patientId, date, reason, status } = req.body;
    try {
        if (req.user.role !== 'patient') {
            return res.status(403).json({ message: "Only patients can create appointments." });
        }
        const appointment = new Appoinmemts({
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

export default router;