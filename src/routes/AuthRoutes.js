import express from 'express';
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { authMiddleware } from "../middleware/AuthMiddleware.js";

const express = require('express');

const router = express.Router();

// Register a new user
router.post('/register', async (req, res) => {
    if (req.body.role !== 'doctor' && req.body.specialization === undefined) {
         const { name, email, password} = req.body;
         try {
            const existingUser = await User.findOne({ email });
            if (existingUser) {
            return res.status(400).json({ message: "User already exists." });
            }
            const hashedPassword = await bcrypt.hash(password, 10);
            const newUser = new User({
               name,
               email,
               password: hashedPassword
          });
            await newUser.save();
            res.status(201).json({ success: true, message: "User registered successfully." });
        } catch (error) {
          res.status(500).json({ success: false, message: "Error registering user.", error });
       }
      
    }
    else{
        const { name, email, password, role, specialization } = req.body;
        try {
            const existingUser = await User.findOne({ email });
            if (existingUser) {
            return res.status(400).json({ success: false, message: "User already exists." });
            }
            const hashedPassword = await bcrypt.hash(password, 10);
            const newUser = new User({
               name,
               email,
               password: hashedPassword,
               role,
               specialization
          });
            await newUser.save();
            res.status(201).json({ success: true, message: "Doctor registered successfully." });
        } catch (error) {
          res.status(500).json({ success: false, message: "Error registering doctor.", error });
       }
      
    };
   
});
// Login user
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "User not found." });
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ success: false, message: "Invalid password." });
        }
        const token = jwt.sign({ id: user._id }, process.env.SECRET_KEY, { expiresIn: "1h" });
        res.json({ success: true, token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error logging in.", error });
    }
});
// Get user profile
router.get('/profile', authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }
        res.json({ success: true, user });
    } catch (error) {
        res.status(500).json({ message: "Error fetching profile.", error });
    }
});
//get all doctors
router.get('/doctors', async (req, res) => {
    try {
        const doctors = await User.find({ role: "doctor" }).select('-password');
        res.json({ success: true, doctors });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error fetching doctors.", error });
    }
});

//get doctor by specialization
router.get('/doctors/specialization/:specialization', async (req, res) => {
    try {
        const doctors = await User.find({ role: "doctor", specialization: req.params.specialization }).select('-password');
        res.json({ success: true, doctors });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error fetching doctors by specialization.", error });
    }
});

module.exports = router;