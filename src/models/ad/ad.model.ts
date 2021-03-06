import {Document, Model, Schema} from "mongoose";
import * as mongoose from "mongoose";
import {Campaign} from "../campaign/campaign.model";
import {Creativity} from "../creativity/creativity.model";
import {User} from "../user/user.model";

export interface Ad extends Document {
    _id: string;
    name: string;
    owner: User;
    adTypeKey: string;
    campaign: Campaign;
    creativities?: Creativity[];
    deleted: boolean;
    created: Date;
    updated: Date;
    published: boolean;
}

const AdSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    owner: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "User",
    },
    adTypeKey: {
        type: String,
        required: true,
    },
    campaign: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "Campaign",
    },
    creativities: [{
        type: Schema.Types.ObjectId,
        ref: "Creativity",
    }],
    deleted: {
        type: Boolean,
        required: true,
        default: false,
    },
    created: {
        type: Date,
        required: true,
        default: Date.now,
    },
    updated: {
        type: Date,
        required: true,
        default: Date.now,
    },
    published: {
        type: Boolean,
        required: true,
        default: false,
    },
});

const AdMongo: Model<Ad> = mongoose.model<Ad>("Ad", AdSchema);
export default AdMongo;
