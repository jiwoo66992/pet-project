import express from 'express';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import cors from 'cors';
import authRouter from './src/auth/auth.routes.js'
import userRouter from './src/user/user.routes.js';

dotenv.config();

const app = express();

app.use(
	bodyParser.urlencoded({
		extended: false,
	}),
);
app.use(bodyParser.json());
app.use(cors());

app.get('/', (req, res) => {
	res.send('APP IS RUNNING');
});
app.use('/auth', authRouter);
app.use('/users', userRouter);

const server = app.listen(6611, () => {
	console.log(`Express running → PORT ${server.address().port}`);
});