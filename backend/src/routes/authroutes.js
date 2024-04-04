import {Router} from 'express';
import AuthController from '../controller/authcontroller.js'

class AuthRoutes {
  constructor() {
    this.router = Router();
    this.authController = AuthController;
    this.init();
  }

  init() {
    this.router.post('/login', this.authController.login);
    this.router.post('/signup', this.authController.signup);
  }
}

export default new AuthRoutes().router;
