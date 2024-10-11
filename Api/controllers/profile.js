const express = require('express');
const router = express.Router();
const User = require('../models/User.model');
const Profile = require('../models/Profile.model');
const Follower = require('../models/Follower.model');
const Post = require('../models/Post.model');
const auth = require('../middleware/auth.middleware');
const {
  newFollowerNotification,
  removeFollowerNotification,
} = require('../utils/notifications');

// @route   GET /api/profile/:username
// @desc    Obtem o perfil de um usuário
router.get('/:username', async (req, res) => {
  try {
    const user = await User.findOne({
      username: req.params.username.toLowerCase(),
    });
    if (!user) {
      return res.status(404).json({ msg: 'Usuário não encontrado.' });
    }

    const profile = await Profile.findOne({ user: user._id }).populate('user');
    const follow = await Follower.findOne({ user: user._id });
    const posts = await Post.find({ user: user._id })
      .sort({ createdAt: -1 })
      .populate('user');

    res.status(200).json({
      profile,
      followers: follow.followers,
      following: follow.following,
      posts,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Erro no servidor.' });
  }
});

// @route   GET /api/profile/:username/followers
// @desc    Obtem seguidores de um usuário
router.get('/:username/followers', async (req, res) => {
  try {
    const user = await User.findOne({
      username: req.params.username.toLowerCase(),
    });
    if (!user) {
      return res.status(404).json({ msg: 'Usuário não encontrado.' });
    }

    const followers = await Follower.findOne({ user: user._id }).populate(
      'followers.user'
    );

    res.status(200).json(followers.followers);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Erro no servidor.' });
  }
});

// @route   GET /api/profile/:username/following
// @desc    Obtem usuários que o usuário segue
router.get('/:username/following', async (req, res) => {
  try {
    const user = await User.findOne({
      username: req.params.username.toLowerCase(),
    });
    if (!user) {
      return res.status(404).json({ msg: 'Usuário não encontrado.' });
    }

    const following = await Follower.findOne({ user: user._id }).populate(
      'following.user'
    );

    res.status(200).json(following.following);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Erro no servidor.' });
  }
});

// @route   POST /api/profile/follow/:userId
// @desc    Seguir ou deixar de seguir um usuário
router.post('/follow/:userId', auth, async (req, res) => {
  try {
    const loggedInUser = await Follower.findOne({ user: req.userId });
    const userToFollowOrUnfollow = await Follower.findOne({
      user: req.params.userId,
    });

    // Se o usuário que está logado não existe ou o usuário que você quer seguir não existe, retorne um erro
    if (!loggedInUser || !userToFollowOrUnfollow) {
      return res.status(404).json({ msg: 'usuário não encontrado.' });
    }

    // Checa se o usuário que está logado já segue o usuário que você quer seguir
    const isFollowing =
      loggedInUser.following.length > 0 &&
      loggedInUser.following.filter(
        (following) => following.user.toString() === req.params.userId
      ).length > 0;

    if (isFollowing) {
      // Deixa de seguir o usuário caso o usuário que está logado já siga o usuário que você quer seguir
      let index = loggedInUser.following.findIndex(
        (following) => following.user.toString() === req.params.userId
      );
      loggedInUser.following.splice(index, 1);
      await loggedInUser.save();

      index = userToFollowOrUnfollow.followers.findIndex(
        (follower) => follower.user.toString() === req.userId
      );
      userToFollowOrUnfollow.followers.splice(index, 1);
      await userToFollowOrUnfollow.save();

      await removeFollowerNotification(req.params.userId, req.userId);

      res.status(200).json(userToFollowOrUnfollow.followers);
    } else {
      loggedInUser.following.unshift({ user: req.params.userId });
      await loggedInUser.save();

      userToFollowOrUnfollow.followers.unshift({ user: req.userId });
      await userToFollowOrUnfollow.save();

      await newFollowerNotification(req.params.userId, req.userId);

      res.status(200).json(userToFollowOrUnfollow.followers);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Erro no servidor.' });
  }
});

// @route   GET /api/profile
// @desc    Obter o perfil do usuário logado.
router.get('/', auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.userId });
    if (!profile) {
      return res.status(404).json({ msg: 'Perfil não encontrado.' });
    }

    res.status(200).json(profile);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Erro no servidor.' });
  }
});

// @route   PUT /api/profile
// @desc    Atualizar perfil do usuário logado.
router.put('/', auth, async (req, res) => {
  try {
    const { bio, techStack, social } = req.body;

    let profile = await Profile.findOne({ user: req.userId });
    if (!profile) {
      return res.status(404).json({ msg: 'Perfil não encontrado.' });
    }

    profile = await Profile.findOneAndUpdate(
      { user: req.userId },
      { bio, techStack, social },
      { new: true }
    );

    res.status(200).json(profile);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Erro no servidor.' });
  }
});

module.exports = router;