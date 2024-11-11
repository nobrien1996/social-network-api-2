const { Thought, User } = require('../models');


const thoughtController = {
  async getThoughts(req, res) {
    try {
      const dbThoughtStuff = await Thought.find().sort({ createdAt: -1 });
      res.json(dbThoughtStuff);
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  },


  async getSingleThought(req, res) {
    try {
      const dbThoughtStuff = await Thought.findOne({ _id: req.params.thoughtId });
      if (!dbThoughtStuff) {
        return res.status(404).json({ message: 'This thought does not exist' });
      }
      res.json(dbThoughtStuff);
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  },


  async createThought(req, res) {
    try {
      const dbThoughtStuff = await Thought.create(req.body);
      const dbUserStuff = await User.findOneAndUpdate(
        { _id: req.body.userId },
        { $push: { thoughts: dbThoughtStuff._id } },
        { new: true }
      );
      if (!dbUserStuff) {
        return res.status(404).json({ message: 'You need a user ID to make this thought' });
      }
      res.json({ message: 'You made a thought' });
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  },


  async updateThought(req, res) {
    const dbThoughtStuff = await Thought.findOneAndUpdate({ _id: req.params.thoughtId }, { $set: req.body }, { runValidators: true, new: true });
    if (!dbThoughtStuff) {
      return res.status(404).json({ message: 'This thought does not exist' });
    }
    res.json(dbThoughtStuff);

    console.log(err);
    res.status(500).json(err);
  },


  async deleteThought(req, res) {
    try {
      const dbThoughtStuff = await Thought.findOneAndRemove({ _id: req.params.thoughtId })
      if (!dbThoughtStuff) {
        return res.status(404).json({ message: 'This thought does not exist' });
      }
      const dbUserStuff = User.findOneAndUpdate({ thoughts: req.params.thoughtId }, { $pull: { thoughts: req.params.thoughtId } }, { new: true });
      if (!dbUserStuff) {
        return res.status(404).json({ message: 'You need a user ID to make this thought' });
      }
      res.json({ message: 'Thought successfully deleted!' });
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  },


  async addReaction(req, res) {
    try {
      const dbThoughtStuff = await Thought.findOneAndUpdate(
        { _id: req.params.thoughtId },
        { $addToSet: { reactions: req.body } },
        { runValidators: true, new: true }
      );

      if (!dbThoughtStuff) {
        return res.status(404).json({ message: 'This thought does not exist' });
      }

      res.json(dbThoughtStuff);
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  },


  async removeReaction(req, res) {
    try {
      const dbThoughtStuff = await Thought.findOneAndUpdate(
        { _id: req.params.thoughtId },
        { $pull: { reactions: { reactionId: req.params.reactionId } } },
        { runValidators: true, new: true }
      );
      if (!dbThoughtStuff) {
        return res.status(404).json({ message: 'This thought does not exist' });
      }
      res.json(dbThoughtStuff);
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  },
};


module.exports = thoughtController;