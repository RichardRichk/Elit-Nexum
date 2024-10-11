require('dotenv').config({ path: './config.env' });
const path = require('path');
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const handlebars = require('handlebars');
const router = express.Router();
const User = require('../models/User.model');
const sendEmail = require('../utils/sendEmail');
const readHTML = require('../utils/readHTML');
const usernameRegex = /^(?!.*\.\.)(?!.*\.$)[^\W][\w.]{0,29}$/;
const host = process.env.HOST || req.get('host');
const port = process.env.PORT ? `:${process.env.PORT}` : '';

// @route:  GET /api/signup
// @desc:   Checa se o nick está disponível
router.get('/:username', async (req, res) => {
  const { username } = req.params;

  try {
    //Invalido se for muito curto
    if (username.length < 1) {
      return res.status(400).json({ msg: 'Nome de usuário inválido.' });
    }

    // Faz a validação com regex
    if (!usernameRegex.test(username)) {
      return res.status(400).json({ msg: 'Nome de usuário inválido.' });
    }

    // Verifica se o usuário esta disponível
    const user = await User.findOne({ username: username.toLowerCase() });
    if (user) {
      return res.status(400).json({ msg: 'Nome de usuário já está em uso.' });
    }

    res.status(200).json({ msg: 'Nome de usuário disponível' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Erro no servidor.' });
  }
});

// @route:  POST /api/signup
// @desc:   Registra um usuário
router.post('/', async (req, res) => {
  const { name, username, email, password } = req.body;

  if (password.length < 6) {
    return res
      .status(400)
      .json({ msg: 'A senha deve ter pelo menos 6 caracteres.' });
  }

  try {
    // Checa se o email já está registrado
    let user = await User.findOne({ email: email.toLowerCase() });
    if (user) {
      return res.status(400).json({ msg: 'Você já está registrado.' });
    }

    // Checa se o username já está registrado
    user = await User.findOne({ username: username.toLowerCase() });
    if (user) {
      return res.status(400).json({ msg: 'Nome de usuário já está em uso.' });
    }

    user = new User({
      name,
      email: email.toLowerCase(),
      username: username.toLowerCase(),
      password,
    });

    // Criptografa a senha
    user.password = await bcrypt.hash(password, 10);

    // Envia o email de verificação
    const verificationToken = crypto.randomBytes(20).toString('hex');
    user.verificationToken = crypto
      .createHash('sha256')
      .update(verificationToken)
      .digest('hex');

    const verificationUrl = `${req.protocol}://${host}${port}/onboarding/${verificationToken}`;

    const htmlTemplate = await readHTML(
      path.join(__dirname, '..', 'emails', 'verify-email.html')
    );
    const handlebarsTemplate = handlebars.compile(htmlTemplate);
    const replacements = { verificationUrl };
    const html = handlebarsTemplate(replacements);

    try {
      await sendEmail({
        to: user.email,
        subject: 'Elit Nexum - Verificação de conta',
        html,
      });
    } catch (err) {
      console.log(err);
      user.verificationToken = undefined;
      await user.save();
      return res.status(500).json({ msg: 'Erro ao enviar o e-mail de verificação.' });
    }

    await user.save();

    // Define JWT e retornar o token.
    jwt.sign({ userId: user._id }, process.env.JWT_SECRET, (err, token) => {
      if (err) throw err;
      res.status(200).json({
        msg: 'Por favor, verifique seu e-mail para confirmar seu registro.',
        token,
      });
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Erro no servidor.' });
  }
});

module.exports = router;