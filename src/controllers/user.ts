require('dotenv').config();

import { Request, Response } from "express";
import { IUser } from "../models/user";

import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import { baseUser } from "../compute/base/user";

export namespace userController {
  export function createUser(req: Request, res: Response){
    if (req.body.invitationCode !== process.env.INVITECODE) {
      res.status(500).json({
        message: "Wrong invitation code"
      });
      return;
    }
  
    bcrypt.hash(req.body.password, 10).then((hash: string) => {
      baseUser.register(req.body.email, hash, req.body.phoneNumber)
        .then((result: any) => {
          res.status(201).json({
            result
          });
        })
        .catch((error: Error) => {
          res.status(500).json({
            errorMessage: error
          });
        });
    });
  };
  
  export function userLogin(req: Request, res: Response){
    let fetchUser: IUser;
  
    baseUser.getByEmail(req.body.email)
    .then((user: IUser) => {
      fetchUser = user;
  
      if (!user) {
        return res.status(401).json({
          message: "Mauvaise Email"
        });
      }
      bcrypt.compare(req.body.password, user.password)
      .then((result: any) => {
        if (!result) {
          return res.status(401).json({
            message: "Mauvaise Mot de passe"
          });
        }
  
        const token = jwt.sign(
          {
            email: fetchUser.email,
            userId: fetchUser._id
          },
          process.env.JWT,
          { expiresIn: "12h" }
        );
  
        res.status(200).json({
          token: token,
          expiresIn: parseInt(process.env.TOKENLIFETIME) * 60 * 60,
          userId: fetchUser._id
        });
      })
    })
    .catch((error: Error) => {
      return res.status(401).json({
        errorMessage: error
      });
    });
  }
}