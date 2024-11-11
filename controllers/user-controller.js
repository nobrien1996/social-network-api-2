const { User, Thought } = require('../models');


const userController = {
  async getUsers(req, res) {
    try {
      const dbUserStuff = await User.find().select('-__v')
      res.json(dbUserStuff);
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  },


  async getSingleUser(req, res) {
    try {
      const dbUserStuff = await User.findOne({ _id: req.params.userId }).select('-__v').populate('friends').populate('thoughts');
      if (!dbUserStuff) {
        return res.status(404).json({ message: 'User does not exist' });
      }
      res.json(dbUserStuff);
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  },

  
  async createUser(req, res) {
    try {
      const dbUserStuff = await User.create(req.body);
      res.json(dbUserStuff);
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  },

  
  async updateUser(req, res) {
    try {
      const dbUserStuff = await User.findOneAndUpdate({ _id: req.params.userId }, { $set: req.body, }, { runValidators: true, new: true, });
      if (!dbUserStuff) {
        return res.status(404).json({ message: 'User does not exist' });
      }
      res.json(dbUserStuff);
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  },

  
  async deleteUser(req, res) {
    try {
      const dbUserStuff = await User.findOneAndDelete({ _id: req.params.userId })
      if (!dbUserStuff) {
        return res.status(404).json({ message: 'User does not exist' });
      }
      await Thought.deleteMany({ _id: { $in: dbUserStuff.thoughts } });
      res.json({ message: 'User and their thoughts have been purged from existence' });
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  },


  async addFriend(req, res) {
    try {
      const dbUserStuff = await User.findOneAndUpdate({ _id: req.params.userId }, { $addToSet: { friends: req.params.friendId } }, { new: true });

      if (!dbUserStuff) {
        return res.status(404).json({ message: 'User does not exist' });
      }

      res.json(dbUserStuff);
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  },

  
  async removeFriend(req, res) {
    try {
      const dbUserStuff = await User.findOneAndUpdate({ _id: req.params.userId }, { $pull: { friends: req.params.friendId } }, { new: true });

      if (!dbUserStuff) {
        return res.status(404).json({ message: 'User does not exist' });
      }
      res.json(dbUserStuff);
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  },
};


module.exports = userController;