const { CREATED, SuccessResponse } = require("../core/success.response");
const AccessService = require("../services/access.service");

class AccessController {
  signUp = async (req, res, next) => {
    new CREATED({
      message: 'Sign up successfully',
      metadata: await AccessService.signUp(req.body)
    }).send(res);
  }
  login = async (req, res, next) => {
    new SuccessResponse({
      metadata: await AccessService.login(req.body)
    }).send(res);
  }
  logout = async (req, res, next) => {
    new SuccessResponse({
      message: 'Log out successfully',
      metadata: await AccessService.logOut(req.keyStore)
    }).send(res);
  }
  handleRefreshToken = async (req, res, next) => {
    new SuccessResponse({
      message: 'Get token successfully',
      metadata: await AccessService.handleRefreshToken({
        refreshToken: req.refreshToken,
        user: req.user,
        keyStore: req.keyStore
      })
    }).send(res); 
  }
}
module.exports = new AccessController()