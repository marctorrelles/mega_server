import {Model} from "mongoose";
import {Ad} from "../ad/ad.model";
import {Creativity} from "../creativity/creativity.model";
import {User} from "../user/user.model";
import {Campaign, default as CampaignMongo} from "./campaign.model";

export class CampaignService {
    private readonly mongoModel: Model<Campaign>;

    constructor(mongoModel?: Model<Campaign>) {
        this.mongoModel = mongoModel || CampaignMongo;
    }

    public async create(
        name: string,
        description: string,
        owner: User,
        ads: Ad[],
        dailyBudget: number,
        startDate: Date,
        endDate: Date,
    ) {
        const campaign = new this.mongoModel({
            name: (name),
            owner: (owner),
            ads: (ads),
            budget: 0,
            dailyBudget: (dailyBudget),
            startDate: (startDate),
            endDate: (endDate),
        });

        if (description.length > 0) { campaign.description = (description); }

        return await campaign.save();
    }

    public async get(user: User, id: string[]): Promise<Creativity> {
        const populateQuery = [{
            path: "ads",
            select: "_id name",
            populate: [
                {path: "adType", select: "name key -_id -__t"},
                {path: "creativities", select: "name path thumbnail mimetype fileformat filetype size duration"},
            ],
        }];
        return await this.mongoModel
            .find({
                owner: user,
                _id: (id),
                deleted: false,
            }, {
                _id: 1,
                name: 1,
                description: 1,
                owner: 1,
                ads: 1,
                budget: 1,
                dailyBudget: 1,
                startDate: 1,
                endDate: 1,
                active: 1,
                created: 1,
                updated: 1,
            })
            .populate(populateQuery)
            .lean();
    }

    public async list(user: User): Promise<Creativity[]> {
        const populateQuery = [{
            path: "ads",
            select: "_id name",
            populate: [
                {path: "adType", select: "name key -_id -__t"},
                {path: "creativities", select: "name path thumbnail mimetype fileformat filetype size duration"},
            ],
        }];
        return await this.mongoModel
            .find({
                owner: user,
                deleted: false,
            }, {
                _id: 1,
                name: 1,
                description: 1,
                owner: 1,
                ads: 1,
                budget: 1,
                dailyBudget: 1,
                startDate: 1,
                endDate: 1,
                active: 1,
                created: 1,
                updated: 1,
            })
            .populate(populateQuery)
            .lean();
    }

    public async remove(id: string): Promise<Creativity> {
        if (id === undefined) { throw new Error("Param id is required"); }

        return await this.mongoModel.findOneAndUpdate({_id: id}, {$set: {deleted: true}});
    }
}