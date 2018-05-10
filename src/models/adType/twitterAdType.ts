import {Platform, Twitter} from "../platform/platform";
import {AdType} from "./adType";
import {AllowedDimensions} from "./allowedDimensions";
import {Dimensions} from "./dimensions";
import {Duration} from "./duration";
import {NumCreativities} from "./numCreativities";

export class TwitterAdType extends AdType {
    public readonly mandatoryTweet: boolean;
    public readonly mandatoryAppIds: boolean;
    public readonly mimetypes?: string[];
    public readonly allowedSize?: AllowedDimensions;
    public readonly duration?: Duration;
    public constructor(
        name: string,
        key: string,
        description: string,
        platform: Platform,
        numCreativities: NumCreativities,
        mandatoryTweet: boolean,
        mandatoryAppIds: boolean,
        mimetypes?: string[],
        allowedSize?: AllowedDimensions,
        duration?: Duration,
    ) {
        super(name, key, description, platform, numCreativities);
        this.mandatoryTweet = (mandatoryTweet);
        this.mandatoryAppIds = (mandatoryAppIds);
        this.mimetypes = (mimetypes);
        this.allowedSize = (allowedSize);
        this.duration = (duration);
    }
}

const TwitterAdTypes: AdType[] = [];

TwitterAdTypes.push(new TwitterAdType(
    "Tweet",
    "TW_TWEET",
    "Simple tweet that appears in the feed",
    Twitter,
    new NumCreativities(0, 0),
    true,
    false,
));

TwitterAdTypes.push(new TwitterAdType(
    "Tweet with image (up to 4 images)",
    "TW_TWEET_IMAGE",
    "Images that appear on a tweet in the feed",
    Twitter,
    new NumCreativities(1, 4),
    true,
    false,
    ["image/jpg", "image/png", "image/webp"],
    new AllowedDimensions(new Dimensions(1200, 800), new Dimensions(2400, 1600)),
));

TwitterAdTypes.push(new TwitterAdType(
    "Tweet with GIF",
    "TW_TWEET_GIF",
    "GIF that appears on a tweet in the feed",
    Twitter,
    new NumCreativities(1, 1),
    true,
    false,
    ["image/gif"],
    new AllowedDimensions(new Dimensions(1200, 800), new Dimensions(2400, 1600)),
));

TwitterAdTypes.push(new TwitterAdType(
    "Tweet with video",
    "TW_TWEET_VIDEO",
    "Video that appears on a tweet in the feed",
    Twitter,
    new NumCreativities(1, 1),
    true,
    false,
    ["video/mp4"],
    new AllowedDimensions(new Dimensions(1200, 800), new Dimensions(2400, 1600)),
));

TwitterAdTypes.push(new TwitterAdType(
    "App card with image",
    "TW_APP_IMAGE",
    "App card that appears on the feed with an image",
    Twitter,
    new NumCreativities(1, 1),
    false,
    true,
    ["image/jpg", "image/png", "image/webp"],
    new AllowedDimensions(new Dimensions(500, 500), new Dimensions(1200, 1200)),
));

TwitterAdTypes.push(new TwitterAdType(
    "App card with video",
    "TW_APP_VIDEO",
    "App card that appears on the feed with a video",
    Twitter,
    new NumCreativities(1, 1),
    false,
    true,
    ["video/mp4"],
    new AllowedDimensions(new Dimensions(500, 500), new Dimensions(1200, 1200)),
));

export default TwitterAdTypes;
