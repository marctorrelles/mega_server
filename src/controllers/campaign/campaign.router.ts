import * as express from "express";
import {Route} from "../Route";
import {create, list, remove, start, stop} from "./campaign.controller";

export default class CampaignRouter implements Route {
    public static create(): Route {
        return new CampaignRouter();
    }

    public URL: string = "/campaign";

    public decorate(app: express.Application) {
        app.route(this.URL + "/create").post(create);
        app.route(this.URL + "/list").get(list);
        app.route(this.URL + "/remove").delete(remove);
        app.route(this.URL + "/start").post(start);
        app.route(this.URL + "/stop").post(stop);
    }
}
