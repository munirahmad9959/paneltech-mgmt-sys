// import express from 'express';
// import authRoutes from './routes/auth.js';
// import mongoose from 'mongoose';
// import dotenv from 'dotenv';
// import cors from 'cors';
// import morgan from 'morgan';
// import bodyParser from 'body-parser';
// import attendanceRoutes from './routes/attendance.js';
// import leave from './routes/leave.js';
// import userRoutes from './routes/user.js';

// dotenv.config();

// const app = express();

// // Middleware
// app.use(express.json());
// app.use(morgan('common'));
// app.use(bodyParser.json({ limit: "30mb", extended: true }));
// app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
// // Serve static files from the "public/uploads" directory
// app.use('/uploads', express.static('public/uploads'));

// app.use(cors(
//   {
//     origin: 'http://localhost:5173',
//     methods: ['GET', 'POST', 'PUT', 'DELETE'],
//     credentials: true
//   }
// ));


// // Routes
// app.use('/api/user', userRoutes);
// app.use('/api/auth', authRoutes);
// app.use('/api/attendance', attendanceRoutes);
// app.use('/api/leaves', leave);


// app.get('/', (req, res) => {
//   res.send('Hello World!');
// });

// const PORT = process.env.PORT || 6001;

// // MongoDB Connection
// mongoose.connect(process.env.MONGO_URI, {
//   tls: true,  // Ensures TLS is used
//   tlsAllowInvalidCertificates: true // Optional: Ignore invalid certificates

// })
//   .then(() => {
//     app.listen(PORT, () => console.log(`Server running on port: ${PORT} and connected to the database`));
//   })
//   .catch((error) => {
//     console.error(`Failed to connect to database: ${error.message}`);
//     process.exit(1);
//   });


import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import helmet from 'helmet';
import path from 'path';
import { fileURLToPath } from 'url';

// Routes
import authRoutes from './routes/auth.js';
import attendanceRoutes from './routes/attendance.js';
import leaveRoutes from './routes/leave.js';
import userRoutes from './routes/user.js';
import payrollRoutes from './routes/payroll.js'; // Ensure payrollRoutes is imported
import employeeRoutes from './routes/employee.js'; // Ensure employeeRoutes is imported

// Shared Multer Middleware
import { upload } from './middleware/upload.js';

dotenv.config();

// Setup __dirname for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 6001;

// ========== MIDDLEWARE ==========
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));

app.use(cors({
  origin: ['http://localhost:5173'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

app.use(morgan('common'));
app.use(express.json());
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));

// Serve uploaded static files
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));

// ========== ROUTES ==========
app.use('/api/user', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/leaves', leaveRoutes);
app.use('/api/payroll', payrollRoutes); // Ensure payrollRoutes is imported
app.use('/api/employees', employeeRoutes);

// Optional standalone upload route (for testing or general use)
app.post('/api/upload', upload.single('file'), (req, res) => {
  try {
    return res.status(200).json({
      message: 'File uploaded successfully',
      filename: req.file.filename,
      url: `/uploads/${req.file.filename}`
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

// Root test route
app.get('/', (req, res) => {
  res.send('🚀 API is running securely!');
});

// ========== DB CONNECTION ==========
mongoose.connect(process.env.MONGO_URI, {
  tls: true,
  tlsAllowInvalidCertificates: false
})
  .then(() => {
    app.listen(PORT, () => {
      console.log(`✅ DB Connected & Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error(`❌ Database connection failed: ${error.message}`);
    process.exit(1);
  });

