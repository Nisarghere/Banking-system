const mongoose = require("mongoose");

const tokenBlacklistSchema = new mongoose.Schema({
    token: {
        type: String,
        required: [true, "Token is required to blacklist"],
        unique: [true, "Token is already blacklisted"]
    },
     
}, {
    timestamps: true
});

tokenBlacklistSchema.index({ blacklistedAt: 1 }, { createdAt: 86400 });

const BlacklistToken = mongoose.model("BlacklistToken", tokenBlacklistSchema);

module.exports = BlacklistToken;