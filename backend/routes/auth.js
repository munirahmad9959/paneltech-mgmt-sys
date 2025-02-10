import express from 'express'
import { login } from '../controllers/auth.js';
import { register } from '../controllers/auth.js';
import { logout } from '../controllers/auth.js';

const router = express.Router()

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);

export default router;