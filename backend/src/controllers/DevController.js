const axios = require("axios");

const Dev = require("../models/Dev");

module.exports = {
  async store(req, res) {
    const { username } = req.body;

    const userExists = await Dev.findOne({ user: username });

    if (userExists) {
      return res.json({ user: userExists });
    }

    try {
      const response = await axios.get(
        `https://api.github.com/users/${username}`
      );

      const { name, bio, avatar_url: avatar } = response.data;

      const dev = await Dev.create({
        name,
        user: username,
        bio,
        avatar
      });
      return res.json({ user: dev });
    } catch (error) {
      const { data, status } = error.response;
      return res.status(404).json({ status: status, error: data.message });
    }
  },

  async index(req, res) {
    const { user } = req.headers;

    const loggedDev = await Dev.findById(user);

    const users = await Dev.find({
      $and: [
        { _id: { $ne: user } },
        { _id: { $nin: loggedDev.likes } },
        { _id: { $nin: loggedDev.dislikes } }
      ]
    });

    return res.json(users);
  }
};
