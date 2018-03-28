var mongoose = require('mongoose');

var thingSchema = new mongoose.Schema({
    thingName: {
        type: String,
        unique: true,
        required: true,
        trim: true
    }
});
