require('dotenv').config({ path: './config.env' });
const path = require('path');
const crypto = require('crypto');
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const handlebars = require('handlebars');
const router = express.Router();
const User = require('../models/User.model');
const auth = require('../middleware/auth.middleware');
const upload = require('../middleware/imageUpload.middleware');
const sendEmail = require('../utils/sendEmail');
const readHTML = require('../utils/readHTML');
const host = process.env.HOST || req.get('host');
const port = process.env.PORT ? `:${process.env.PORT}` : '';

// @route:  GET /api/auth
// @desc:   Get logged in user's info
router.get('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(400).json({
        msg: 'Por favor, verifique seu e-mail e conclua o processo de integração primeiro.',
      });
    }
    res.status(200).json({ user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Erro no servidor.' });
  }
});

// @route:  POST /api/auth
// @desc:   Login usuario
router.post('/', async (req, res) => {
  const { email, password } = req.body;

  if (password.length < 6) {
    return res
      .status(400)
      .json({ msg: 'A senha deve ter pelo menos 6 caracteres.' });
  }

  try {
    // Checa se o usuário existe
    const user = await User.findOne({ email: email.toLowerCase() }).select(
      '+password'
    );
    if (!user) {
      return res.status(400).json({ msg: 'Credenciais inválidas.' });
    }

    if (!user.isVerified) {
      return res
        .status(400)
        .json({ msg: 'Por favor, verifique seu e-mail antes de tentar fazer login.' });
    }

    // Checa se a senha está correta
    const isCorrectPassword = await bcrypt.compare(password, user.password);
    if (!isCorrectPassword) {
      return res.status(400).json({ msg: 'Credenciais inválidas.' });
    }

    // Autentica JWT e retorna o token
    jwt.sign({ userId: user._id }, process.env.JWT_SECRET, (err, token) => {
      if (err) throw err;
      res.status(200).json({ token });
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Erro no servidor.' });
  }
});

// @route:  PUT /api/auth
// @desc:   Atualiza as configurações do usuário
router.put('/', auth, upload.single('profilePic'), async (req, res) => {
  try {
    const { name, username } = req.body;

    // Checa se o nome de usuário já está sendo usado
    let user = await User.findOne({ username: username.toLowerCase() });
    if (user && user._id.toString() !== req.userId) {
      return res.status(400).json({ msg: 'Nome de usuário já está em uso.' });
    }

    const updatedUser = {};
    if (name) updatedUser.name = name;
    if (username) updatedUser.username = username;
    if (req.file && req.file.path) updatedUser.profilePicUrl = req.file.path;

    user = await User.findByIdAndUpdate(req.userId, updatedUser, { new: true });

    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Erro no servidor.' });
  }
});

// @route:  PUT /api/auth/password
// @desc:   Atualiza a senha do usuário
router.put('/password', auth, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(req.userId).select('+password');
    if (!user) {
      return res.status(404).json({ msg: 'Usuário não encontrado.' });
    }

    // Checa se as senhas coincidem
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(401).json({ msg: 'Senha incorreta.' });
    }

    if (newPassword.length < 6) {
      return res
        .status(400)
        .json({ msg: 'A senha deve ter pelo menos 6 caracteres.' });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.status(200).json({ msg: 'Senha atualizada.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Erro no servidor.' });
  }
});

// @route:  POST /api/auth/forgot-password
// @desc:   Envia um email de redefinição de senha
router.post('/forgot-password', async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(404).json({ msg: 'Usuário não encontrado.' });
    }

    const resetToken = crypto.randomBytes(20).toString('hex');
    user.resetPasswordToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');
    user.resetPasswordExpire = Date.now() + 30 * 60 * 1000;

    const resetUrl = `${req.protocol}://${host}${port}/reset-password/${resetToken}`;

    const htmlTemplate = await readHTML(
      path.join(__dirname, '..', 'emails', 'forgot-password.html')
    );
    const handlebarsTemplate = handlebars.compile(htmlTemplate);
    const replacements = { resetUrl };
    const html = handlebarsTemplate(replacements);

    try {
      await sendEmail({
        to: user.email,
        subject: 'Elit Nexum - Redefinir senha',
        html,
      });
    } catch (err) {
      console.log(err);
      user.resetPasswordToken = undefined;
      await user.save();
      return res.status(500).json({ msg: 'Erro ao enviar o e-mail de verificação.' });
    }

    await user.save();
    res.status(200).json({ msg: 'E-mail enviado.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Erro no servidor.' });
  }
});

// @route:  PUT /api/auth/reset-password/:token
// @desc:   Redefine a senha do usuário
router.put('/reset-password/:token', async (req, res) => {
  try {
    const resetPasswordToken = crypto
      .createHash('sha256')
      .update(req.params.token)
      .digest('hex');

    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ msg: 'Token inválido ou expirado.' });
    }

    // Atualiza a senha do usuário
    user.password = await bcrypt.hash(req.body.password, 10);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    res.status(200).json({ msg: 'Redefinição de senha concluída.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Erro no servidor.' });
  }
});

module.exports = router;