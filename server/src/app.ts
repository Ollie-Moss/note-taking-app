import express from 'express';
import cors from 'cors';
import { errorHandler } from './middlewares/errorHandler';
import bodyParser from 'body-parser';
import { AuthRouter } from './routes/authRoute';
import { NoteRouter } from './routes/noteRoute';
import { GroupRouter } from './routes/groupRoute';
import { UserRouter } from './routes/userRoute';

// Main express application setup

const app = express();

// Middleware
app.use(express.json()); // parse plain json bodies
app.use(bodyParser.urlencoded({ extended: true })); // parse and attach body to req object
app.use(cors()); // enable cors

// Routes
app.use('/api/user', UserRouter) // user crud operations
app.use('/api/auth', AuthRouter) // auth 'login' & 'signup'
app.use("/api/note", NoteRouter) // note crud operations 
app.use("/api/group", GroupRouter) // group crud operations

// Error Handling
app.use(errorHandler); // default error handler

export default app;
