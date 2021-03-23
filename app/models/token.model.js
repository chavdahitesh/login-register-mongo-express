const mongoose = require('mongoose');
const tokenSchema = new mongoose.Schema({
    _userId: { type: mongoose.Schema.Types.ObjectId, require: true, ref: 'users' },
    token: { type: String, require: true }
}, { timestamps: true });
tokenSchema.index({ createdAt: 1 }, { expireAfterSeconds: 86400 });

module.exports = mongoose.model('tokens',tokenSchema);
