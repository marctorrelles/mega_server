import {Model, Schema} from "mongoose";
import {AdType, AllowedRatio, AllowedSize, default as AdTypeMongo, Duration} from "../adType.model";

export interface TwitterAdType extends AdType {
    mimetypes: string[];
    allowedSize: AllowedSize;
    duration?: Duration;
    frames?: number;
    actions: string[];
}

const TwitterAdTypeSchema = new Schema({
    mimetypes: [{
        type: String,
        required: true,
    }],
    allowedSize: {
        min: {
            width: {
                type: Number,
                required: true,
            },
            height: {
                type: Number,
                required: true,
            },
        },
        max: {
            width: {
                type: Number,
                required: true,
            },
            height: {
                type: Number,
                required: true,
            },
        },
    },
    duration: {
        min: {
            type: Number,
        },
        max: {
            type: Number,
        },
    },
    frames: {
        type: Number,
    },
    actions: [{
        type: String,
        required: true,
    }],
});

const TwitterAdTypeMongo: Model<TwitterAdType> =
    AdTypeMongo.discriminator("TwitterAdType", TwitterAdTypeSchema);
export default TwitterAdTypeMongo;
