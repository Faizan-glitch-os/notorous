const mongoose = require('mongoose');
const dotenv = require('dotenv');
const fs = require('fs');
const TourModel = require('../../models/tour-model');

dotenv.config({ path: './config.env' });

const db = process.env.CLOUD_DB.replace('<db_password>', process.env.PASSWORD);

mongoose.connect(db).then(console.log('database connected'));

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/tours-simple.json`, 'utf-8'),
);

const importData = async () => {
  try {
    const Tours = await TourModel.create(tours);
    console.log(Tours);
  } catch (error) {
    console.log(error);
  }
  process.exit();
};

const deleteData = async () => {
  try {
    await TourModel.deleteMany();
    console.log('successfuly deleted');
  } catch (error) {
    console.log(error);
  }
  process.exit();
};

if (process.argv[2] === '--import') {
  importData();
} else if (process.argv[2] === '--delete') {
  deleteData();
}
