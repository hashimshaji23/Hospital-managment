import mongoose, { mongo } from "mongoose";

const serviceShema = new mongoose.Schema({
    name: { type: String, require: true, trim: true },
    about: { type: String, default: "" },
    shortDescription: { type: String, default: "" },

    price: { type: Number, default: 0 },
    available: { type: Boolean, default: true },

    imageUrl: { type: String, default: null },
    imagePublicId: { type: String, default: null },

    dates: { type: [String], default: [] },
    slots: { type: Map, of: [String], default: {} },

    instructions: { type: [String], default: [] },

    totalAppointments: { type: Number, default: 0 },
    completed: { type: Number, default: 0 },
    canceled: { type: Number, default: 0 },
}, {timestamps: true} );

serviceShema.index({name: "text", shortDescription: "text"});

const Service = mongoose.model.Service || mongoose.model("service", serviceShema);
export default Service;