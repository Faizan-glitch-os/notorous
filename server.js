const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config({ path: './config.env' });

const db = process.env.CLOUD_DB.replace('<db_password>', process.env.PASSWORD);

mongoose.connect(db).then(() => console.log('Connection success'));

const app = require('./app');

const port = process.env.PORT || 3000;

app.listen(port, () => console.log(`Server listening on port ${port}`));
