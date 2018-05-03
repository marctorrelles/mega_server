import {Model} from "mongoose";
import {Platform} from "../platform/platform.model";
import {AdType} from "./adType.model";
import {default as InstagramAdTypeMongo, InstagramAdType} from "./instagramAdType.model";

export class InstagramAdTypeService {
    private mongoModel: Model<InstagramAdType>;

    constructor(mongoModel?: Model<InstagramAdType>) {
        this.mongoModel = mongoModel || InstagramAdTypeMongo;
    }

    public async drop(): Promise<InstagramAdType[]> {
        return await this.mongoModel.remove({});
    }

    public async insertBulk(instagramAdTypes: InstagramAdType[]): Promise<any> {
        const instagramAdTypesInserted: Array< Promise<Platform> > = instagramAdTypes.map(async (adType) => {
            return await this.mongoModel.findOneAndUpdate({key: adType.key}, {$set: adType}, {upsert: true});
        });
        Promise.all(instagramAdTypesInserted).then((instagramAdTypesPromise) => {
            return instagramAdTypesPromise;
        });
    }

    public async findByAdType(id: AdType): Promise<InstagramAdType> {
        return await this.mongoModel.findById(id);
    }
}