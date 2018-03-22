const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    email: { 
        type: String, 
        required: true 
        },
    status: Boolean,
    encryptedPassword: {
        type: String,
        required: true,
        },
    name: {
        first: { type: String, default: ''},
        last:  { type: String, default: ''},
        },
    phone: { type: String, default: ''},
    about: { type: String, default: ''},
    department: {
        type: String,
        enum: ['None', 'Housekeeping', 'Maintenance', 'Front Desk', 'Owner Relation', 'Executive'],
        default: 'None'
        },
    position: { type: String, default: ''},
    access: {
        type: 'String',
        enum: ['Employee', 'Admin', 'Executive'],
        default: 'Employee'
        }
    }, 
    {
        timestamps: true
    }
);

const User = mongoose.model('User', UserSchema);
module.exports = User;