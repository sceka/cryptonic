const bcrypt = require('bcrypt');
const Investor = require('../../models/Investor');
const express = require('express');
const router = require('express').Router();
const saltRounds = 10;

router.post('/signup', async (req, res) => {
	Investor.findOne({ email: req.body.email }).exec(
		async (error, user) => {
			try {
				if (user)
					return res.status(400).json({
						message: 'User already exists.'
					});

				const { budget, email, password } =
					req.body;

				const hashedPassword = await bcrypt.hash(
					password,
					10
				);

				const investor = new Investor({
					budget,
					email,
					password: hashedPassword
				});

				investor.save((error, data) => {
					if (error) {
						return res.status(400).json({
							message: 'Something went wrong'
						});
					}
					if (data) {
						return res.status(201).json({
							investor: data
						});
					}
				});
			} catch (err) {
				console.log(err);
			}
		}
	);
});

router.post('/sign-in', async (req, res, next) => {
	try {
		const { email, password } = req.body;

		const investor = await Investor.findOne({
			email
		})
			.select('email password budget')
			.lean();

		if (!email)
			return status(401).alert('Inccorect email');

		if (!bcrypt.compare(password, investor.password)) {
			res.status(401).send('Inccorect password');
		} else {
			req.session.investor = investor;
			res.sendStatus(200);
		}
	} catch (err) {
		next(err);
	}
});

module.exports = router;
