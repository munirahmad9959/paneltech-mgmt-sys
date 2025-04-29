// import express from 'express';
// import { saveUserData, upload } from '../controllers/user.js';

// const router = express.Router();

// // Multer handles file uploads
// router.post('/save', upload.fields([
//     { name: 'profileImage', maxCount: 1 },
//     { name: 'cnicFront', maxCount: 1 },
//     { name: 'cnicBack', maxCount: 1 },
//     { name: 'cv', maxCount: 1 }
// ]), saveUserData);

// export default router;


// import express from 'express';
// import { saveUserData, getUserData, upload } from '../controllers/user.js';

// const router = express.Router();

// // Multer handles file uploads
// router.post('/save', upload.fields([
//     { name: 'profileImage', maxCount: 1 },
//     { name: 'cnicFront', maxCount: 1 },
//     { name: 'cnicBack', maxCount: 1 },
//     { name: 'cv', maxCount: 1 }
// ]), saveUserData);

// // Add route to get user data
// router.get('/:userId', getUserData);

// export default router;

import express from 'express';
import { saveUserData, getUserData } from '../controllers/user.js';
import { upload } from '../middleware/upload.js'; // shared Multer config

const router = express.Router();

router.post('/save', upload.fields([
    { name: 'profileImage', maxCount: 1 },
    { name: 'cnicFront', maxCount: 1 },
    { name: 'cnicBack', maxCount: 1 },
    { name: 'cv', maxCount: 1 }
]), saveUserData);

router.get('/:userId', getUserData);

export default router;
