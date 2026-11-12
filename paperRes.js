const mongoose = require("mongoose");

const paperSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'userModel',
            index: true
        },
        extractedQuestions: {
            type: mongoose.Schema.Types.Mixed,
            default: {}
        }
    },
    {timestamps: true}
);

const paperModel = mongoose.model("paperModel",paperSchema);

module.exports = paperModel;