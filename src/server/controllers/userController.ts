import { ProfileImage } from './../entities/ProfileImage';
import * as express from "express";
import { User, RankEntry } from "../entities/User";
import { UserService } from "../services/userService";
import { validateUser, validateUserUpdate } from "../validation/userValidation";
import { ProfileImageService } from '../services/profileImageService';
import { testFileRemover } from '../handlers/testFileRemover';
import { convertToDataUrl } from '../handlers/convertToDataUrl';
import { ChallengeStatus } from '../entities/Challenge';
import { UserDashboardChallengeEntry } from '../entities/UserChallenge';
import * as bcrypt from 'bcrypt';

const userService = new UserService(); // service related to user information
const profileImageService = new ProfileImageService(); // service related to profile image

/**
 * User controller class.
 */
export class UserController {

    public constructor() { }

    /**
     * Create new user, returning saved user info if successful.
     * @param req body contaning new user's info.
     * @param res saved user
     */
    public async create(req: express.Request, res: express.Response) {
        try {
            const newUser = req.body; // get information from body
            const result = validateUser(newUser); // validate against schema
 
            // check if validation returned error, returning 400 and displaying message if so.
            if (result.error) {
                return res.status(400).json({ Error: "User details invalid. Please check your fields." });
             } // ir invalid, return 400 with message

            newUser.password = await bcrypt.hash(newUser.password, 10);

            // save user to the DBa
            const user = await userService.create(newUser)
                .catch(error => { //catch any error
                    console.log(error);
                    if(error.detail.includes('email')){
                        error.detail = `Email ${error.parameters[2]} already exists`;
                    }else if(error.detail.includes('username')){
                        error.detail = `Username ${error.parameters[3]} already exists`;
                    }
                    res.status(409).json({ Error: error.detail });
                });

            // return added user and status 200
            res.status(201).json({
                'Result': `User [ID ${(user as User).id}] added successfully!`,
                user
            });
        } catch (error) { // catch any exception
            console.log(error);
            res.status(500).json({
                Error: "Exception caught!"
            });
        }
    }

    /**
     * Retrieve user information using user ID.
     * @param req user ID in params.
     * @param res retrieved user info.
     */
    public async findById(req: express.Request, res: express.Response) {
        try {
            const id = req.params.id; // get user id by URL
            const user = await userService.findById(id); // get user from DB

            if (!user) return res.status(404).json({ Error: "User not found." }) // return error if not found

            res.status(200).json(user); // return user info
        } catch (error) { // catch any exception
            console.log(error);
            res.status(500).json({
                Error: "Exception caught!"
            });
        }
    }

    /**
     * Retrieve all users' information.
     * @param req 
     * @param res 
     */
    public async findAll(req: express.Request, res: express.Response) {
        try {
            const users = await userService.findAll(); // get all users
            if (!users) return res.status(404).json({ Error: "No users were found!" });

            res.status(200).json(users);
        } catch (error) { // catch any exception
            console.log(error);
            res.status(500).json({
                Error: "Exception caught!"
            });
        }
    };

    /**
     * Delete user by ID.
     * @param req params containing user ID.
     * @param res deletion result.
     */
    public async deleteUser(req: express.Request, res: express.Response) {
        try {
            const id = req.params.id; // get user ID from URL
            const loggedId = (req as any).userId; // get logged user ID

            // get user from DB
            const user = await userService.findById(id);          
            if (!user) return res.status(404).json({ Error: "User not found." }) // return error if not found

            // check if user can perform this operation, by comparing the retrieved IDs.
            if (loggedId != id) return res.status(403).json({ Error: "You are not allowed to delete this user!" });

            const deletedUser = await userService.delete(user.id); // delete user using service

            return res.status(200).json(deletedUser); // return status 200 and the deletion result

        } catch (error) { // catch any exception
            console.log(error);
            return res.status(500).json({
                Error: "User could not be deleted!"
            });
        }
    };

    /**
     * Update user info using body information.
     * @param req body containing updated information
     * @param res saved user info
     */
    public async updateUser(req: express.Request, res: express.Response) {
        try {
            // add validation
            const values = req.body; // retrieve information to update from body

            const result = validateUserUpdate(values); // validate against schema
 
            // check if validation returned error, returning 400 and displaying message if so.
            if (result.error) {
                return res.status(400).json({ Error: "Invalid details, please check your inputs and password." });
             }

            const id = req.params.id; // retrieve user ID from params
            const loggedId = (req as any).userId; // retrieve logged user ID from token

            // check if user can perform this operation, by comparing the retrieved IDs.
            if (loggedId != id) return res.status(403).json({ Error: "You are not allowed to update this user!" });
            
            const user = await userService.findById(id); // retrieve user using the ID
            if (!user) return res.status(404).json({ Error: "User not found." }) // return error if not found

            if(values.password){
                values.password = await bcrypt.hash(values.password, 10);
            }

            const savedUser = await userService.update(user as User, values); // call service function to update user

            // if it was successfull, display message and the user info
            return res.status(200).json({
                Result: "User updated successfully",
                savedUser
            });
        } catch (error) {
            console.log(error);
            return res.status(500).json({
                Error: "Exception caught!"
            })
        }
    }

    /**
     * Add profile image to user.
     * @param req 
     * @param res 
     */
    public async addProfileImage(req: express.Request, res: express.Response) {
        try {
            // Get logger user id
            const loggedUserId = (req as any).userId;
            // Get user id to upload image
            const userId = req.params.id;
            // If logged is not owner return not allowed
            if (loggedUserId != userId) {
                return res.status(403).json({ Error: 'Not allowed' });
            }
            // Get logged user
            const user = await userService.findById(loggedUserId);
            // If not found return 404 status
            if (!user) return res.status(404).json({ Error: `User id ${loggedUserId} not found` });
            // If users does not have profile image create one
            if (!user.profileImage) {
                // Create data url
                const dataUrl = convertToDataUrl(req.file);
                // Create new profile image
                const image = new ProfileImage(dataUrl);
                // Save profile image in database
                const profileImage = await profileImageService.create(image, user);
                return res.status(200).json(profileImage);
            }

            // If user has profile image, update it

            // Create data url
            const dataUrl = convertToDataUrl(req.file);
            // Update user profile in database
            const profileImage = await profileImageService.findById(user.profileImage.id);
            profileImage!.url = dataUrl;
            const updatedImage = await profileImageService.save(profileImage!);

            return res.status(200).json(updatedImage);

        } catch (error) {
            console.log(error);
            return res.status(500).json({ Error: 'Internal server error' });
        }
    }

    /**
     * Retrieve ranking of users by score.
     * @param req may include the number of users to return
     * @param res ranking showing current user's position if present
     */
    public async getRank(req: express.Request, res: express.Response) {
        try {
            const loggedId = (req as any).userId; // get logged user id

            // two options: with or without limit
            //with
            const limit = req.body.limit;
            const rank: RankEntry[] = await userService.getRank(limit); // get TOP N rank
            //without
            // const rank: RankEntry[] = await userService.getRank(); // get whole rank

            // if rank is null, return error
            if (!rank) return res.status(403).json({ Error: "Couldn't retrieve rank." });

            // add authUser flag (true when it's the logged user)
            const flaggedRank = rank.map((user) => {
                (user.id == loggedId) ? user.authUser = true : user.authUser = false;
                return user;
            })

            // return rank
            return res.status(200).json(flaggedRank);
        } catch (error) {
            console.log(error);
            return res.status(500).json({
                Error: "Exception caught!"
            })
        }
    }

    // This function might be moved to other file
    /**
     * Return challenges information including current user's status of challenges attempts.
     * @param req 
     * @param res 
     */
    public async getUserChallenges(req: express.Request, res: express.Response) {
        try {
            // get all challenges including the current user's score
            const allChallengesWithScore: UserDashboardChallengeEntry[] = await userService.getChallengesWithScore((req as any).userId);
            // return error if couldn't retrieve information
            if (!allChallengesWithScore) return res.status(400).json({ Error: "Bad request" });

            // Galera. Aqui tentei usar map com uma funcão acessória e não rolou, pq n consegue acessar o this de dentro do map

            // const allChallengesWithStatus: UserDashboardChallengeEntry[] = allChallengesWithScore.map(
            //         (challenge => this._convertScoreToStatus(challenge)), this
            //         );
            
            //Convert score to status
            // iterate through array, check score, add related status and remove score info.
            for (var _x = 0; _x < allChallengesWithScore.length; _x++) {
                // tentei abstrair essa parte e criar uma funcão, mas dá erro
                // allChallengesWithScore[_x] = this._convertScoreToStatus(allChallengesWithScore[_x]);
                if (allChallengesWithScore[_x].maxScore == null) {
                    allChallengesWithScore[_x].status = ChallengeStatus.TODO;
                } else if (allChallengesWithScore[_x].maxScore == 100) {
                    allChallengesWithScore[_x].status = ChallengeStatus.PASSED;
                } else {
                    allChallengesWithScore[_x].status = ChallengeStatus.ATTEMPTED;
                }
                delete allChallengesWithScore[_x].maxScore;
            }

            // return result
            return res.status(200).json(allChallengesWithScore);

        } catch (error) {
            console.log(error);
            return res.status(500).json({
                Error: "Exception caught!"
            })
        }
    }

    // Galera, não consegui usar esse método dentro do for loop acima. Alguém sabe pq?
    // diz que não consegue ler a propriedade _convertScoreToStatus de undefined 
    /**
     * Convert score information to status.
     * @param challenge 
     */
    private _convertScoreToStatus(challenge: UserDashboardChallengeEntry) {
        if (challenge.maxScore == null) {
            challenge.status = ChallengeStatus.TODO;
        } else if (challenge.maxScore == 100) {
            challenge.status = ChallengeStatus.PASSED;
        } else {
            challenge.status = ChallengeStatus.ATTEMPTED;
        }
        delete challenge.maxScore;
        return challenge;
    }

}
