import express from 'express';
import { saveUserData, getUserData } from '../controllers/user.js';
import { upload } from '../middleware/upload.js'; // shared Multer config

const router = express.Router();

router.post('/save', upload.fields([
    { name: 'profileImage', maxCount: 1 },
    { name: 'cnicDoc', maxCount: 1 },
    { name: 'cvDoc', maxCount: 1 }
]), saveUserData);

router.get('/:userId', getUserData);

export default router;
