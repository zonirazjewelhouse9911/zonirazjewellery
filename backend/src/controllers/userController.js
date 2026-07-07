const userService = require('../services/userService');

class UserController {
  getUsers = async (req, res) => {
    try {
      const users = await userService.getAllUsers();
      return res.status(200).json({ success: true, data: users });
    } catch (error) {
      console.error('Get Users Controller Error:', error);
      return res.status(500).json({ success: false, message: 'Failed to retrieve patron ledger list' });
    }
  }

  getUserById = async (req, res) => {
    try {
      const user = await userService.getUserById(req.params.id);
      if (!user) {
        return res.status(404).json({ success: false, message: 'Patron not found in database' });
      }
      return res.status(200).json({ success: true, data: user });
    } catch (error) {
      console.error('Get Single User Controller Error:', error);
      return res.status(500).json({ success: false, message: 'Failed to retrieve user details' });
    }
  }

  updateUserStatus = async (req, res) => {
    try {
      const { status } = req.body;
      if (!status) {
        return res.status(400).json({ success: false, message: 'Status is required' });
      }
      const user = await userService.updateUserStatus(req.params.id, status);
      return res.status(200).json({
        success: true,
        message: `Account successfully ${status === 'active' ? 'activated' : 'suspended'}`,
        data: user
      });
    } catch (error) {
      console.error('Update User Status Controller Error:', error);
      return res.status(500).json({ success: false, message: error.message || 'Failed to update user status' });
    }
  }
}

module.exports = new UserController();
