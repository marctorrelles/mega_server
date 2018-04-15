import {logger} from "../../config/logger";

import {FacebookAdMiddleware} from "../../middleware/facebook/ad.middleware";
import {FacebookBasicMiddleware} from "../../middleware/facebook/basic.middleware";
import {Role} from "../../models/role/role.model";
import {RoleService} from "../../models/role/role.service";
import {Password} from "../../models/user/password";
import {User} from "../../models/user/user.model";
import {UserService} from "../../models/user/user.service";
import {AuthService} from "../../services/auth.service";
import {ExpressSignature} from "../Route";

const userService = new UserService();
const roleService = new RoleService();
const authService = new AuthService();
const facebookBasicMiddleware = new FacebookBasicMiddleware();
const facebookAdMiddleware = new FacebookAdMiddleware();

export let login: ExpressSignature = async (request, response, next) => {

    // params -> email:string, password:string

    const params = request.body;
    const xAccessToken = request.headers["x-access-token"].toString();
    const allowedRoles = ["admin"];

    if (!xAccessToken || await !authService.isAllowed(allowedRoles, xAccessToken)) {
        return response.status(401).send("Unauthorized");
    }
    try {

        const user: User = await userService.findByEmail(params.email);

        if (Password.encrypt(params.password).value !== user.password) {
            return response.status(401).send("Email and password do not match!");
        }

        response.status(200).send({
            _id: user._id,
            token: user.token,
            name: user.name,
            email: user.email,
            role: user.role.name,
            phone: user.phone,
        });
    } catch (err) {
        logger.error(err);
        response.status(400).send(err.toString());
    }
};

export let register: ExpressSignature = async (request, response, next) => {

    // params -> name:string, email:string, password:string, phone?:string

    const params = request.body;
    const xAccessToken = request.headers["x-access-token"].toString();

    const allowedRoles = ["admin"];

    if (!xAccessToken || await !authService.isAllowed(allowedRoles, xAccessToken)) {
        return response.status(401).send("Unauthorized");
    }

    try {
        const role: Role = await roleService.findByName(params.role);
        const user: User = await userService.create(params.name, params.email, params.password, role, params.phone);
        response.status(200).send({
            token: user.token,
            _id: user._id,
            email: user.email,
            name: user.name,
            phone: user.phone,
            role: role.name,
        });
    } catch (err) {
        logger.error(err);
        response.status(400).send(err.toString());
    }
};

export let edit: ExpressSignature = async (request, response, next) => {

    // params -> id:string, name:string, email:string, password:string, phone:string

    const params = request.body;
    const xAccessToken = request.headers["x-access-token"].toString();
    const allowedRoles = ["admin"];

    if (!xAccessToken || await !authService.isAllowed(allowedRoles, xAccessToken)) {
        return response.status(401).send("Unauthorized");
    }

    try {
        const user: User = await userService.update(
            params.id, params.name, params.email, params.password, params.phone,
        );
        response.status(200).send({
            email: user.email,
            _id: user._id,
            name: user.name,
            phone: user.phone,
        });
    } catch (err) {
        logger.error(err);
        response.status(400).send(err.toString());
    }
};

export let remove: ExpressSignature = async (request, response, next) => {

    // params -> id?:string

    const params = request.body;
    const xAccessToken = request.headers["x-access-token"].toString();
    const allowedRoles = ["admin"];

    if (!xAccessToken || await !authService.isAllowed(allowedRoles, xAccessToken)) {
        return response.status(401).send("Unauthorized");
    }

    try {
        await userService.remove(params.id);
        response.status(200).send({
            executed: true,
        });
    } catch (err) {
        logger.error(err);
        response.status(400).send(err.toString());
    }
};

export let list: ExpressSignature = async (request, response, next) => {

    // params -> role?:string

    const params = request.body;
    const xAccessToken = request.headers["x-access-token"].toString();
    const allowedRoles = ["admin"];

    if (!xAccessToken || await !authService.isAllowed(allowedRoles, xAccessToken)) {
        return response.status(401).send("Unauthorized");
    }

    try {
        let role: any;
        if (params.role) {
            role = await roleService.findByName(params.role);
        }

        const user: User[] = await userService.listUsers(role);

        response.status(200).send({
            user,
        });
    } catch (err) {
        logger.error(err);
        response.status(400).send(err.toString());
    }
};

export let getInfo: ExpressSignature = async (request, response, next) => {

    const xAccessToken = request.headers["x-access-token"].toString();
    const allowedRoles = ["admin"];

    if (!xAccessToken || await !authService.isAllowed(allowedRoles, xAccessToken)) {
        return response.status(401).send("Unauthorized");
    }
    try {
        const user: User = await userService.getUserProfile(xAccessToken);
        response.status(200).send(user);
    } catch (err) {
        logger.error(err);
        response.status(400).send(err.toString());
    }
};

export let token: ExpressSignature = async (request, response, next) => {
    const params = request.body;
    const xAccessToken = request.headers["x-access-token"].toString();
    const allowedRoles = ["admin"];

    if (!xAccessToken || await !authService.isAllowed(allowedRoles, xAccessToken)) {
        return response.status(401).send("Unauthorized");
    }

    if (!params.access_token) {
        return response.status(404).send("Please provide an access_token");
    }

    try {

        let user: User = await userService.findByToken(xAccessToken);
        user = await userService.assignAccessToken(user, params.type, params.access_token);
        const fbAccount = await facebookBasicMiddleware.getFacebookInfo(params.access_token);
        const fbAdAccount = await facebookAdMiddleware.getAdAccount(fbAccount.id, params.access_token);
        user = await userService.assignAdAccount(user, params.type, fbAdAccount.account_id);

        console.log(fbAccount);
        console.log(fbAdAccount);
        console.log(user);

        response.status(200).send({
            email: user.email,
            _id: user._id,
            name: user.name,
            phone: user.phone,
        });

    } catch (err) {
        logger.error(err);
        response.status(400).send(err.toString());
    }
};
