import app from './app';
import config from './config/config';
import ConnectToMongoDB from './db/conn';

// Connect to DB then start backend server
ConnectToMongoDB().then(() => {
    app.listen(config.port, () => {
        console.log(`Server running on port ${config.port}`);
    });
})
