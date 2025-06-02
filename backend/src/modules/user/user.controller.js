const UserService = require("./user.service");

const NotFoundError = require("../../errors/NotFoundError");

class UserController {
  async getAll(req, res, next) {
    try {
      const users = await UserService.getAll();

      res.json({
        success: true,
        message: "Get user success",
        data: users,
      });
    } catch (err) {
      next(err);
    }
  }

  async getById(req, res, next) {
    try {
      const user = await UserService.getById(req.params.id);
      if (!user) throw new NotFoundError("User not found");

      res.json({
        success: true,
        message: "Get user success",
        data: user,
      });
    } catch (err) {
      next(err);
    }
  }

  async create(req, res, next) {
    try {
      const user = await UserService.create(req.body);

      res.status(201).json({
        success: true,
        message: "Add user success",
        data: user,
      });
    } catch (err) {
      next(err);
    }
  }

  async update(req, res, next) {
    try {
      const user = await UserService.update(req.params.id, req.body);
      if (!user) throw new NotFoundError("User not found");

      res.status(200).json({
        success: true,
        message: "Edit user success",
        data: user,
      });
    } catch (err) {
      next(err);
    }
  }

  async delete(req, res, next) {
    try {
      const user = await UserService.delete(req.params.id);
      if (!user) throw new NotFoundError("User not found");

      res.status(200).json({
        success: true,
        message: "Delete user success",
        data: user,
      });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new UserController();
