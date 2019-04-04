import { Request, Response } from "express";
import { getUserRepository } from "../repositories/userRepository";
import jwt from "jsonwebtoken";
import { validateLogin } from "../validation/userValidation"

export class AuthController {

    constructor() { }

    public async login(req: Request, res: Response) {
        const AUTH_SECRET = process.env.AUTH_SECRET; // get salt from environment
        const userRepository = getUserRepository(); // load user repository
        const userDetails = req.body; // get user details from body
        const result = await validateLogin(userDetails); // validate details against schema

        // if it's not valid
        if (result.error) return res.status(400).json({ Error: "User details invalid. Please check fields." });

        // try to get user using the provided details
        const match = await userRepository.findOne(userDetails as any);

        // if there's no match, return error
        if (match === undefined) return res.status(404).json({ Error: "Authentication failed!" });

        // if salt is not defined, return error
        if (AUTH_SECRET === undefined) return res.status(500).json({ Error: "Authentication couldn't be completed. Please check the authentication salt." });

        // Sign the information using salt
        const token = jwt.sign({ id: match.id }, AUTH_SECRET); // validate to generate token

        // return status 200 and the token
        return res.status(200).json({ 'Result': `User [ID = ${match.id}] logged successfully!`, token: token });
    }

}
        