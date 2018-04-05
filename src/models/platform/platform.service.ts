import {Model} from "mongoose";
import {default as PlatformMongo, Platform} from "./platform.model";

export class PlatformService {
    private mongoModel: Model<Platform>;

    constructor(mongoModel?: Model<Platform>) {
        this.mongoModel = mongoModel || PlatformMongo;
    }

    public async insertBulk(platforms: Platform[]): Promise<any> {
        const platformsInserted: Array< Promise<Platform> > = platforms.map(async (platform) => {
            return await this.mongoModel.findOneAndUpdate(
                {key: platform.key},
                {$set: platform},
                {upsert: true},
            );
        });
        Promise.all(platformsInserted).then((platformsPromise) => {
            return platformsPromise;
        });
    }

    public async drop() {
        await this.mongoModel.remove({});
    }

    public async list(): Promise<Platform[]> {
        return await this.mongoModel.find().lean();
    }

    public async getPlatformByKey(platformKey: string): Promise<Platform> {
        return await this.mongoModel.findOne({ key: platformKey }).lean();
    }

}
