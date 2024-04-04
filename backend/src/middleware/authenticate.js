import Token from "../utils/token.js";

class AuthMiddleware {
  async authenticate(req, res, next) {
    // Check if the user is authenticated
    try {
      if (!Token.verifyTokenAccess(req)) {
        return res.status(401).json({ message: 'Unauthorized' });
      }
      next();
    }
    catch (error) {
      return res.status(401).json({ message: 'Expired' });
    }
  }
}

export default new AuthMiddleware();