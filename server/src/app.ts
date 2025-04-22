import express from 'express';
import { errorHandler } from './middlewares/errorHandler';
import bodyParser from 'body-parser';
import { AuthRouter } from './routes/authRoute';
import { NoteRouter } from './routes/noteRoute';

const app = express();

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.use(AuthRouter)
app.use(NoteRouter)

// Error Handling
app.use(errorHandler);

export default app;
