const express = require('express');
const router = express.Router();
const User = require('../models/User.model');
const Profile = require('../models/Profile.model');
const auth = require('../middleware/auth.middleware');
const { newBadgeNotification } = require('../utils/notifications');

// @route:  POST /api/badges/:userId
// @desc:   Adiciona uma nova medalha ao perfil de um usuário
router.post('/:userId', auth, async (req, res) => {
  const { title, image, description } = req.body;

  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(401).json({ msg: 'Não autorizado.' });
    }

    if (user.role !== 'root') {
      return res.status(401).json({ msg: 'Não autorizado.' });
    }

    let profile = await Profile.findOne({ user: req.params.userId });
    if (!profile) {
      return res.status(404).json({ msg: 'Perfil não encontrado.' });
    }

    profile.badges.push({ title, image, description });
    profile = await profile.save();

    await newBadgeNotification(req.params.userId, title);

    res.status(200).json(profile.badges);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'EErro no servidor.' });;
  }
});

module.exports = router;