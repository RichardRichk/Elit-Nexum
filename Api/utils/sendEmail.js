const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'paulo.oliveira.phgo@gmail.com',
      pass: 'ualh wgvk tskp xwda',
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  try {
    await transporter.sendMail({
      from: `<paulo.oliveira.phgo@gmail.com>`,
      to: options.to,
      subject: options.subject,
      html: options.html,
    });
    console.log('E-mail enviado com sucesso!');
  } catch (error) {
    console.error('Erro ao enviar o e-mail:', error);
  }
};

module.exports = sendEmail;