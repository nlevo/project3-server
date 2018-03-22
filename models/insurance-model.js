const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const InsuranceSchema = new Schema({
    type: { 
        type: String, 
        required: true,
        enum: ['Housewares Package', 'Linen-Terry Package', 'MMA', 'Standard Bedding Package']
    },
    start_date: Date,
    end_date: Date,
    created_by_user: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User'
    },
    payment: {
        isPayed: Boolean,
        log: {
            user: {
                type: mongoose.Schema.Types.ObjectId, 
                ref: 'User'},
            date: Date,
        },
    }
    }, {
        timestamps: true
    }
);

const Insurance = mongoose.model('Insurance', InsuranceSchema);
module.exports = Insurance;