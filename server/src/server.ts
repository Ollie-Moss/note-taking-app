import app from './app';
import config from './config/config';
import InitializeMongoose from './db/conn';

InitializeMongoose();
app.listen(config.port, () => {
  console.log(`Server running on port ${config.port}`);
});
