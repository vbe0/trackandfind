var mongoose = require('mongoose');

var thingSchema = new mongoose.Schema({
    thingName: {
        type: string,
        unique: true,
        required: true,
        trim: true
    }
});

thingSchema.get