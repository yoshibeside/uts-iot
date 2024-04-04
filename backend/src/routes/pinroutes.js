import {Router} from 'express';
import AuthController from '../controller/authcontroller.js'
import AuthMiddleware from '../middleware/authenticate.js'

class PinRoutes {
  constructor() {
    this.router = Router();
    this.authController = AuthController;
    this.init();
  }

  init() {
    this.router.use(AuthMiddleware.authenticate);
    this.router.post('/createPin', this.authController.createPin);
    this.router.post('/checkPin', this.authController.checkPin);
  }
}

export default new PinRoutes().router;
