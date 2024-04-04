import {Router} from 'express';
import TransaksiController from '../controller/transaksicontroller.js'
import AuthMiddleware from '../middleware/authenticate.js'

class TransaksiRoutes {
  constructor() {
    this.router = Router();
    this.transaksiController = TransaksiController;
    this.init();
  }

  init() {
    this.router.use(AuthMiddleware.authenticate);
    this.router.post('/addsaldo', this.transaksiController.addSaldo);
    this.router.get('/saldo', this.transaksiController.getSaldo);
    this.router.get('/transactions', this.transaksiController.getTransactions);
    this.router.post('/kurangsaldo', this.transaksiController.kurangSaldo);
  }
}

export default new TransaksiRoutes().router;
