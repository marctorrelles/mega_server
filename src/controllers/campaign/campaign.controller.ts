import {UserService} from "../../models/user/user.service";
import {AuthService} from "../../services/auth.service";
import {ExpressSignature} from "../Route";
import {AdService} from "../../models/ad/ad.service";
import {CampaignService} from "../../models/campaign/campaign.service";
import {start} from "repl";
import {Campaign} from "../../models/campaign/campaign.model";
import {User} from "../../models/user/user.model";

const adService = new AdService();
const authService = new AuthService();
const campaignService = new CampaignService();
const userService = new UserService();

export let create: ExpressSignature = async (request, response, next) => {
    const params = request.body;
    const xAccessToken = request.headers["x-access-token"].toString();
    const allowedRoles = ["admin"];

    if (!xAccessToken || await !authService.isAllowed(allowedRoles, xAccessToken)) {
        return response.status(401).send("Unauthorized");
    }

    try {
        const name = params.name.toString();
        const owner = await userService.findByToken(xAccessToken);
        const ads = await adService.findAndCheck(params.ads);
        const dailyBudget = Number(params.dailyBudget);
        const startDate = new Date(params.startDate);
        const endDate = new Date(params.endDate);
        const description = params.description;

        const campaign: Campaign = await campaignService.create(name, description, owner, ads, dailyBudget, startDate, endDate);

        response.status(200).send({
            _id: (campaign._id),
            name: (campaign.name),
            description: (campaign.description),
            ads: (params.ads),
            budget: (campaign.budget),
            dailyBudget: (campaign.dailyBudget),
            startDate: (campaign.startDate),
            endDate: (campaign.endDate),
        });
    } catch (err) {
        console.error(err);
        response.status(400).send(err.toString());
    }
};

export let remove: ExpressSignature = async (request, response, next) => {
    const params = request.body;
    const xAccessToken = request.headers["x-access-token"].toString();
    const allowedRoles = ["admin"];

    if (!xAccessToken || await !authService.isAllowed(allowedRoles, xAccessToken)) {
        return response.status(401).send("Unauthorized");
    }

    try {
        await campaignService.remove(params.id);
        response.status(200).send({
            executed: true,
        });
    } catch (err) {
        console.error(err);
        response.status(400).send(err.toString());
    }
};

export let list: ExpressSignature = async (request, response, next) => {
    const xAccessToken = request.headers["x-access-token"].toString();
    const allowedRoles = ["admin"];

    if (!xAccessToken || await !authService.isAllowed(allowedRoles, xAccessToken)) {
        return response.status(401).send("Unauthorized");
    }

    try {
        const user: User = await userService.findByToken(xAccessToken);
        let creativities: any;
        if (request.query.id) {
            creativities = await campaignService.get(user, request.query.id);
        } else {
            creativities = await campaignService.list(user);
        }
        response.status(200).send(
            creativities,
        );
    } catch (err) {
        console.error(err);
        response.status(400).send(err.toString());
    }
};