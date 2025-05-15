// routes/email.js
import express from 'express';
import { sendEmail, sendBulkEmails } from '../controllers/email.js';
import { upload } from '../middleware/upload.js';
import { authorizeRoles } from '../middleware/roleMiddleware.js';
import { authenticateUser } from '../middleware/authMiddleware.js';

const router = express.Router();

const emailAttachmentUpload = upload.array('attachments', 5); // Allow up to 5 attachments


router.post('/send', authenticateUser, authorizeRoles('admin'), emailAttachmentUpload, sendEmail);

router.post('/bulk', authenticateUser, authorizeRoles('admin'), emailAttachmentUpload, sendBulkEmails);

export default router;