import express from 'express';
import userController from './user.controller.js';
import authMiddleware from '../auth/auth.middleware.js';

const userRouter = express.Router();

userRouter.post('/', userController.createUser);  
userRouter.get(
    '/:email', 
    authMiddleware.isAuth,
    authMiddleware.isAuthorized(['user', 'admin']),
    userController.getUser
); 
userRouter.get(
    '/api/v1/abc', 
    authMiddleware.isAuth,
    authMiddleware.isAuthorized(['user', 'admin']),
    userController.getUser
); 
userRouter.get(
    '/api/v1/abcd', 
    authMiddleware.isAuth,
    authMiddleware.isAuthorized(['user', 'admin']),
    userController.getUser
); 
export default userRouter;