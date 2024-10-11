const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const Post = require('../models/Post.model');
const User = require('../models/User.model');
const Follower = require('../models/Follower.model');
const Comment = require('../models/Comment.model');
const sanitizeHtml = require('sanitize-html');
const auth = require('../middleware/auth.middleware');
const upload = require('../middleware/imageUpload.middleware');
const {
  newLikeNotification,
  removeLikeNotification,
} = require('../utils/notifications');

// @route   POST /api/posts
// @desc    Cria uma nova postagem
router.post('/', auth, upload.array('images', 5), async (req, res) => {
  const { title, description, liveDemo, sourceCode, techStack } = req.body;

  if (req.files.length < 1) {
    return res.status(400).json({ msg: 'Pelo menos uma imagem é necessária.' });
  }

  const sanitizedDescription = sanitizeHtml(description);

  try {
    const postObj = {
      user: req.userId,
      title,
      description: sanitizedDescription,
      images: req.files.map((file) => file.path),
      liveDemo,
      techStack: JSON.parse(techStack),
      sourceCode: sourceCode || '',  
    };

    const post = await new Post(postObj).save();
    await new Comment({ post: post._id, comments: [] }).save();

    res.status(201).json(post);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Erro no servidor.' });
  }
});

// @route   GET /api/posts
// @desc    Traz todas as postagens
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 12;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const total = await Post.countDocuments();

    const posts = await Post.find()
      .skip(startIndex)
      .limit(limit)
      .sort({ createdAt: -1 })
      .populate('user');

    let next = null;
    if (endIndex < total) {
      next = page + 1;
    }

    res.status(200).json({ posts, next });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Erro no servidor.' });
  }
});

// @route   GET /api/posts/feed
// @desc    Traz todas as postagens dos usuários que o usuário segue
router.get('/feed', auth, async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 12;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    const user = await Follower.findOne({ user: req.userId }).select(
      '-followers'
    );

    const followingUsers = user.following.map((following) => following.user);

    const total = await Post.countDocuments({ user: { $in: followingUsers } });

    const posts = await Post.find({ user: { $in: followingUsers } })
      .skip(startIndex)
      .limit(limit)
      .sort({ createdAt: -1 })
      .populate('user');

    let next = null;
    if (endIndex < total) {
      next = page + 1;
    }

    res.status(200).json({ posts, next });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Erro no servidor.' });
  }
});

// @route   GET /api/profile/saves
// @desc    traz os posts salvos do usuário
router.get('/saves', auth, async (req, res) => {
  try {
    const saves = await Post.find({
      'saves.user': mongoose.Types.ObjectId(req.userId),
    }).populate('user');
    res.status(200).json(saves);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Erro no servidor.' });
  }
});

// @route   GET /api/posts/:postId
// @desc    Traz o post com o Id fornecido
router.get('/:postId', async (req, res) => {
  try {
    let post = await Post.findById(req.params.postId).populate('user');
    if (!post) {
      return res.status(404).json({ msg: 'Postagem não encontrada.' });
    }
    post.views++;
    post = await post.save();
    res.status(200).json(post);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Erro no servidor.' });
  }
});

// @route   PUT /api/posts/:postId
// @desc    Cria uma nova postagem
router.put('/:postId', auth, upload.array('images', 5), async (req, res) => {
  const {
    title,
    description,
    originalImages,
    liveDemo,
    sourceCode,
    techStack,
    isOriginalImages,
  } = req.body;

  if (!isOriginalImages && req.files.length < 1) {
    return res.status(400).json({ msg: 'Pelo menos uma imagem é necessária.' });
  }

  try {
    let post = await Post.findById(req.params.postId);
    if (!post) {
      return res.status(404).json({ msg: 'Postagem não encontrada.' });
    }

    if (post.user.toString() !== req.userId) {
      return res
        .status(401)
        .json({ msg: 'Você não está autorizado a editar esta postagem.' });
    }

    const sanitizedDescription = sanitizeHtml(description);

    const postObj = {
      title,
      description: sanitizedDescription,
      images: JSON.parse(isOriginalImages)
        ? JSON.parse(originalImages)
        : req.files.map((file) => file.path),
      liveDemo,
      techStack: JSON.parse(techStack),
      sourceCode: sourceCode || '',  
    };

    post = await Post.findByIdAndUpdate(req.params.postId, postObj, {
      new: true,
    });
    res.status(201).json(post);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Erro no servidor.' });
  }
});

// @route   DELETE /api/posts/:postId
// @desc    Deletar uma postagem pelo ID
router.delete('/:postId', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);
    if (!post) {
      return res.status(404).json({ msg: 'Postagem não encontrada.' });
    }
    const user = await User.findById(req.userId);
    if (post.user.toString() === req.userId || user.role === 'root') {
      await post.remove();
      res.status(200).json({ msg: 'Postagem deletada.' });
    } else {
      res
        .status(401)
        .json({ msg: 'Você não está autorizado a deletar esta postagem.' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Erro no servidor.' });
  }
});

// @route   PUT /api/posts/like/:postId
// @desc    Curtir e Descurtir uma postagem
router.put('/like/:postId', auth, async (req, res) => {
  try {
    let post = await Post.findById(req.params.postId);
    if (!post) {
      return res.status(404).json({ msg: 'Postagem não encontrada.' });
    }

    const isLiked =
      post.likes.filter((like) => like.user.toString() === req.userId).length >
      0;

    if (isLiked) {
      // Descurte uma postagem já curtida
      const index = post.likes.findIndex(
        (like) => like.user.toString() === req.userId
      );
      post.likes.splice(index, 1);
      post = await post.save();

      // Remove a notificação de curtida
      if (post.user.toString() !== req.userId) {
        await removeLikeNotification(
          post.user.toString(),
          req.userId,
          req.params.postId
        );
      }

      res.status(200).json(post);
    } else {
      // Curtir uma postagem
      post.likes.unshift({ user: req.userId });
      post = await post.save();

      // Adiciona uma notificação de curtida
      if (post.user.toString() !== req.userId) {
        await newLikeNotification(
          post.user.toString(),
          req.userId,
          req.params.postId
        );
      }

      res.status(200).json(post);
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Erro no servidor.' });
  }
});

// @route   PUT /api/posts/save/:postId
// @desc    Salvar e Desalvar uma postagem
router.put('/save/:postId', auth, async (req, res) => {
  try {
    let post = await Post.findById(req.params.postId);
    if (!post) {
      return res.status(404).json({ msg: 'Postagem não encontrada.' });
    }

    const isSaved =
      post.saves.filter((save) => save.user.toString() === req.userId).length >
      0;

    if (isSaved) {
      // Desalva uma postagem já salva
      const index = post.saves.findIndex(
        (save) => save.user.toString() === req.userId
      );
      post.saves.splice(index, 1);
      post = await post.save();
      res.status(200).json(post);
    } else {
      // Salva uma postagem
      post.saves.unshift({ user: req.userId });
      post = await post.save();
      res.status(200).json(post);
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Erro no servidor.' });
  }
});

// @route   GET /api/posts/like/:postId
// @desc    Obtem curtidas de uma postagem
router.get('/like/:postId', async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId).populate('likes.user');
    if (!post) {
      return res.status(404).json({ msg: 'Postagem não encontrada.' });
    }
    res.status(200).json(post.likes);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Erro no servidor.' });
  }
});

module.exports = router;