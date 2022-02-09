const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const allRoutes = require('./routes/index');
const path = require('path');
const session = require('express-session');
const cors = require('cors');

dotenv.config();

const server = express();
server.use(express.urlencoded({ extended: true }));

const url = process.env.MONGO_URL;

mongoose.connect(url, err => {
	if (err) {
		console.log(err);
	} else {
		console.log('Connected to MongoDB');
	}
});
mongoose.connection.on('error', err =>
	console.log('MongoDB connection error: ' + err)
);

server.use(express.json());
if (process.env.NODE_ENV !== 'production') {
	server.use(
		cors({
			credentials: true,
			origin: 'http://localhost:3000'
		})
	);
}

if (process.env.NODE_ENV === 'production') {
	server.use(express.static('client/public/build'));

	server.get('/*', (req, res) => {
		res.sendFile(
			path.resolve(
				'client',
				'public',
				'build',
				'index.html'
			)
		);
	});
}
server.use(
	session({
		secret: process.env.SESSION_SECRET || '',
		resave: false,
		saveUninitialized: false,
		cookie: { maxAge: 1000 * 60 * 60 * 24 * 365 }
	})
);

server.use('/api', allRoutes);

const PORT = process.env.PORT || 3001;

server.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});
