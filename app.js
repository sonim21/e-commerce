import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';
import router from './routes/index.js';

dotenv.config();
const app = express();
const url = process.env.DBURL;

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('db connected');
  })
  .catch((error) => {
    console.log("not Connected", error);
  });

const port = process.env.PORT || 4000;

app.listen(port, () => {
    console.log(`server is running port number ${port}`);
})

app.use(express.json());

app.use('/ecom',router);