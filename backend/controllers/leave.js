import Leave from '../models/Leave.js';
import mongoose from 'mongoose';
import moment from 'moment';

// Apply for leave
export const applyLeave = async (req, res) => {
    try {
        const { startDate, endDate, leaveType, reason } = req.body;

        if (!moment(startDate).isValid() || !moment(endDate).isValid()) {
            return res.status(400).json({ error: "Invalid date format" });
        }
        if (moment(startDate).isAfter(moment(endDate))) {
            return res.status(400).json({ error: "End date must be after start date" });
        }

        const leave = new Leave({
            startDate,
            endDate,
            leaveType,
            reason,
            employeeId: req.user.id
        });

        await leave.save();
        res.status(201).json({ message: "Leave request submitted", leave });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Get all leaves (supports pagination)
export const getLeaves = async (req, res) => {
    try {
        let query = {};
        if (req.user.role !== 'admin') {
            query.employeeId = req.user.id;
        }

        const { page = 1, limit = 10 } = req.query;
        const leaves = await Leave.find(query)
            .sort({ createdAt: -1 })
            .populate('employeeId', 'fullName email profileImage')
            .limit(Number(limit))
            .skip((Number(page) - 1) * Number(limit));
        console.log(leaves);

        const totalLeaves = await Leave.countDocuments(query);

        res.json({
            leaves,
            totalPages: Math.ceil(totalLeaves / limit),
            currentPage: Number(page)
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Update leave status (admin only)
export const updateLeaveStatus = async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ error: "Only admins can update leave status" });
        }

        const { status } = req.body;
        const validStatuses = ['Approved', 'Rejected'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ error: "Invalid status value" });
        }

        const leave = await Leave.findById(req.params.id);
        if (!leave) {
            return res.status(404).json({ error: "Leave not found" });
        }

        leave.status = status;
        await leave.save();

        res.json({ message: "Leave status updated", leave });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Cancel leave (employee only)
export const cancelLeave = async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ error: "Invalid leave ID" });
        }

        const leave = await Leave.findById(req.params.id);
        if (!leave) {
            return res.status(404).json({ error: "Leave not found" });
        }

        if (leave.employeeId.toString() !== req.user.id) {
            return res.status(403).json({ error: "Not authorized to cancel this leave" });
        }

        if (leave.status !== 'Pending') {
            return res.status(400).json({ error: "Only pending leaves can be cancelled" });
        }

        await Leave.deleteOne({ _id: req.params.id });

        res.json({ message: "Leave cancelled successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
