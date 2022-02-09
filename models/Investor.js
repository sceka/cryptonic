const mongoose = require('mongoose');

const InvestorSchema = mongoose.Schema({
	email: { type: String },
	password: { type: String, trim: true },
	budget: { type: Number, trim: true }
});

const Investor = mongoose.model('investor', InvestorSchema);

module.exports = Investor;
