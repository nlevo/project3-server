const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const OwnerSchema = new Schema({
        name: {
            first: String,
            last: String,
            middle: String,
            company: String,
        },
        isActive: Boolean,
        phone: [String],
        email: String,
        website: String,
        address: {
            apartment_num: String,
            street: String,
            city: String,
            state: String,
            zip: String
          },
        own_properties: [
            {
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'Property'
            }
        ],
        created_by_user: 
            {
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'User'
            }
    },
    {
        timestamps: true
    }
);

const Owner = mongoose.model('Owner', OwnerSchema);
module.exports = Owner;