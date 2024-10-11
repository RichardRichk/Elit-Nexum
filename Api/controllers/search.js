const express = require('express');
const router = express.Router();
const User = require('../models/User.model');
const Post = require('../models/Post.model');
const auth = require('../middleware/auth.middleware');

// @route:  GET /api/search/:searchText
// @desc:   Obtém usuários e postagens relacionado com o campo de busca
router.get('/:searchText', async (req, res) => {
  const { searchText } = req.params;
  if (searchText.trim().length === 0) {
    return res.status(400).json({ msg: 'Texto da pesquisa muito curto.' });
  }

  try {
    const users = await User.find({
      $or: [
        { name: { $regex: searchText, $options: 'i' } },
        { username: { $regex: searchText, $options: 'i' } },
      ],
      isVerified: true,
    }).limit(3);

    const posts = await Post.find({
      title: { $regex: searchText, $options: 'i' },
    })
      .populate('user')
      .limit(3);

    res.status(200).json({ users, posts });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Erro no servidor.' });
  }
});

// @route:  GET /api/search/users/:searchText
// @desc:   Obter usuários relacionados ao texto de pesquisa
router.get('/users/:searchText', auth, async (req, res) => {
  const { searchText } = req.params;
  if (searchText.trim().length === 0) {
    return res.status(400).json({ msg: 'Texto da pesquisa muito curto.' });
  }

  try {
    let users = await User.find({
      $or: [
        { name: { $regex: searchText, $options: 'i' }, isVerified: true },
        { username: { $regex: searchText, $options: 'i' } },
      ],
      isVerified: true,
    });

    users = users.filter((user) => user._id.toString() !== req.userId);

    res.status(200).json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Erro no servidor.' });
  }
});

// @route:  GET /api/search/advanced/tag/:tag
// @desc:   Obtem postagem com as tags associadas
router.get('/advanced/tag/:tag', async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 12;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const total = await Post.countDocuments({ techStack: req.params.tag });

    const posts = await Post.find({ techStack: req.params.tag })
      .skip(startIndex)
      .limit(limit)
      .sort({ createdAt: -1 })
      .populate('user');

    let next = null;
    if (endIndex < total) {
      next = page + 1;
    }

    res.status(200).json({ posts, next, total });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Erro no servidor.' });
  }
});

// @route:  GET /api/search/advanced/users/:searchText
// @desc:   Obter usuários relacionados ao texto de pesquisa
router.get('/advanced/users/:searchText', async (req, res) => {
  try {
    const { searchText } = req.params;

    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 12;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const total = await User.countDocuments({
      $or: [
        { name: { $regex: searchText, $options: 'i' } },
        { username: { $regex: searchText, $options: 'i' } },
      ],
      isVerified: true,
    });

    const users = await User.find({
      $or: [
        { name: { $regex: searchText, $options: 'i' } },
        { username: { $regex: searchText, $options: 'i' } },
      ],
      isVerified: true,
    })
      .skip(startIndex)
      .limit(limit);

    let next = null;
    if (endIndex < total) {
      next = page + 1;
    }

    res.status(200).json({ users, next, total });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Errro no servidor.' });
  }
});

// @route:  GET /api/search/advanced/posts/:searchText
// @desc:   Obter postagens relacionadas ao texto de pesquisa
router.get('/advanced/posts/:searchText', async (req, res) => {
  try {
    const { searchText } = req.params;

    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 12;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const total = await Post.countDocuments({
      title: { $regex: searchText, $options: 'i' },
    });

    const posts = await Post.find({
      title: { $regex: searchText, $options: 'i' },
    })
      .skip(startIndex)
      .limit(limit)
      .sort({ createdAt: -1 })
      .populate('user');

    let next = null;
    if (endIndex < total) {
      next = page + 1;
    }

    res.status(200).json({ posts, next, total });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Erro no servidor.' });
  }
});

module.exports = router;