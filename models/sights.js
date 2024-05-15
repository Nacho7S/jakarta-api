const { Schema, default: mongoose }= require("mongoose");

const sightsSchema = new Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    imageUrl: { type: String, require: true },
    facility: {type: String, require: true},
    location: { type: String, require: true },
    archive: {type: Boolean, require: true}
},  { 
        timestamps: true,
    })

    const SightsModel = mongoose.model.Sights || mongoose.model ("Sights", sightsSchema);

    module.exports = SightsModel