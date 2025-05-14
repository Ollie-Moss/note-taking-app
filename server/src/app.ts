import express from 'express';
import cors from 'cors';
import { errorHandler } from './middlewares/errorHandler';
import bodyParser from 'body-parser';
import { AuthRouter } from './routes/authRoute';
import { NoteRouter } from './routes/noteRoute';
import { GroupRouter } from './routes/groupRoute';

const app = express();

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

// Routes
app.use(AuthRouter)
app.use("/api/note", NoteRouter)
app.use("/api/group", GroupRouter)

// Error Handling
app.use(errorHandler);

export default app;
