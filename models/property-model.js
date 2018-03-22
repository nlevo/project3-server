const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PropertySchema = new Schema({
        name: { 
            type: String, 
            required: true,
        },
        building: { 
            type: String, 
            required: true,
        },
        unit: String,
        isActive: Boolean,
        address: {
            street: String,
            city: String,
            state: String,
            zip: String
          },
        effective_date: {
            type: Date,
            required: true
        },
        end_date: Date,
        floor_plan: Number,
        max_occupancy: Number,
        comments: [String],
        special_instructions: [{
            instruction: [String]
        }],
        tier: {
            type: String,
            enum: ['Standard', 'Preffered', 'Elite'],
        },
        bathrooms: Number,
        owned_by: {
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'Owner'
        },
        bedrooms: [
            {
                bedroom_type: { type: String, enum: ['Master', 'Guest', 'Media', 'Living', 'Other', '']},
                bedsize1: { type: String, enum: ['King', 'California King', 'Queen', 'Full', 'Twin', 'Bunk Bed', 'Trundle Bed', 'Murphy', 'Sofa', '']},
                bedsize2: { type: String, enum: ['King', 'California King', 'Queen', 'Full', 'Twin', 'Bunk Bed', 'Trundle Bed', 'Murphy', 'Sofa', '']},
                bedsize3: { type: String, enum: ['King', 'California King', 'Queen', 'Full', 'Twin', 'Bunk Bed', 'Trundle Bed', 'Murphy', 'Sofa', '']},
                bedsize4: { type: String, enum: ['King', 'California King', 'Queen', 'Full', 'Twin', 'Bunk Bed', 'Trundle Bed', 'Murphy', 'Sofa', '']},
            }
    ]
    },
    {
        timestamps: true
    }
);

const Property = mongoose.model('Property', PropertySchema);
module.exports = Property;