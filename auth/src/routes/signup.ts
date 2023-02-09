import express, { Request, Response } from "express";
import { body } from "express-validator";
import jwt from "jsonwebtoken";
import { User } from "../models/user";
import { BadRequestError } from "../errors/bad-request-error";
import { validateRequest } from "../middlewares/validate-requests";

const router = express.Router();

router.post(
  "/api/users/signup",
  [
    body("email").isEmail().withMessage("Email must be valid"),
    body("password")
      .trim()
      .isLength({ min: 4, max: 20 })
      .withMessage("Password must be between 4 and 20 characters"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    
    const { email, password } = req.body;

    const existingUser = await User.findOne({email});

    if(existingUser){
      throw new BadRequestError("Email already exists")
    }
    const user = User.build({email, password});//create user object
    await user.save()//persist user object

    //Generate JWT
    // we need this check to tell typescript to define type of JWT_KEY
    // if(!process.env.JWT_KEY){
    //   throw new Error('JWT_KEY must be defined')
    // } --- this code check should really happen at the start of the program, i.e, in index.js start() function
    const userJwt = jwt.sign({
      id: user.id,
      email: user.email
    }, process.env.JWT_KEY!);

    req.session={
      jwt: userJwt
    }

    res.status(201).send(user);
  }
);

export { router as signupRouter };
