const { Schema, default: mongoose }= require("mongoose");

const culinarySchema = new Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    imageUrl: { type: String, require: true },
    popularLocation: { type: String, require: true },
    archive: {type: Boolean, required: true},
},  { 
    timestamps: true,
})

const culinaryModel = mongoose.model.Culinary || mongoose.model ("Culinary", culinarySchema);

module.exports = culinaryModel