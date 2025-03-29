const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const userRouter = require('./routes/User');
const reportRouter = require('./routes/Report');

dotenv.config();
const app = express();

const corsOptions = {
  origin: 'https://pest-reporting-services.netlify.app',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));
app.use(express.json());

app.use('/pest-report', userRouter);
app.use('/pest-report', reportRouter);

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.log(err));

const PORT = process.env.PORT_NO;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));