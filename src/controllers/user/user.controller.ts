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

        const role: Role = await roleService.findById(user.role);

        response.status(200).send({
            id: user._id,
            token: user.token,
            name: user.name,
            email: user.email,
            role: role.name,
            phone: user.phone
        });
    } catch (err) {
        console.log(err);
        response.status(400).send(err);
    }
}

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
            id: user._id,
            email: user.email,
            name: user.name,
            phone: user.phone,
            role: role.name,
        });
    } catch (err) {
        console.log(err);
        response.status(400).send(err);
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
            id: user._id,
            name: user.name,
            phone: user.phone,
        });
    } catch (err) {
        console.log(err);
        response.status(400).send(err);
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
        let user: User = await userService.remove(params.id);
        response.status(200).send({
            executed: true,
        });
    } catch (err) {
        console.log(err);
        response.status(400).send(err);
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
        console.log(err);
        response.status(400).send(err);
    }
};

export let getInfo: ExpressSignature = async (request, response, next) => {

    // params -> id:string

    const params = request.body;
    const xAccessToken = request.headers["x-access-token"].toString();
    const allowedRoles = ["admin"];

    if (!xAccessToken || await !authService.isAllowed(allowedRoles, xAccessToken)) {
        return response.status(401).send("Unauthorized");
    }
    try {
        const user: User = await userService.findById(params.id);
        const role: Role = await roleService.findById(user.role);

        response.status(200).send({
            email: user.email,
            id: user._id,
            name: user.name,
            phone: user.phone,
            role: role.name,
        });
    } catch (err) {
        console.log(err);
        response.status(400).send(err);
    }
};

export let getOwnInfo: ExpressSignature = async (request, response, next) => {

    const xAccessToken = request.headers["x-access-token"].toString();
    const allowedRoles = ["admin"];

    if (!xAccessToken || await !authService.isAllowed(allowedRoles, xAccessToken)) {
        return response.status(401).send("Unauthorized");
    }
    try {
        //TODO FIX
        const user: User = await userService.findByToken(xAccessToken);
        console.log(user);
        const role: Role = await roleService.findById(user.role);

        console.log(role);

        response.status(200).send({
            email: user.email,
            id: user._id,
            name: user.name,
            phone: user.phone,
            role: role.name,
        });
    } catch (err) {
        console.log(err);
        response.status(400).send(err);
    }
};
