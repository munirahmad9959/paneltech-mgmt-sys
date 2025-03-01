import express from 'express';
import authRoutes from './routes/auth.js';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import attendanceRoutes from './routes/attendance.js';


dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(morgan('common'));
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors(
  {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
  }
));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/attendance', attendanceRoutes);

app.get('/', (req, res) => {
  res.send('Hello World!');
});

const PORT = process.env.PORT || 6001;

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
  tls: true,  // Ensures TLS is used
  tlsAllowInvalidCertificates: true // Optional: Ignore invalid certificates

})
  .then(() => {
    app.listen(PORT, () => console.log(`Server running on port: ${PORT} and connected to the database`));
  })
  .catch((error) => {
    console.error(`Failed to connect to database: ${error.message}`);
    process.exit(1);
  });



