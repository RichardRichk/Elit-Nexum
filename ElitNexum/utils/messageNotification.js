const messageNotification = (senderName) => {
  const sound = new Audio('/new_message.mp3');
  sound && sound.play();

  if (senderName) {
    document.title = `Nova mensagem de ${senderName}`;
    if (document.visibilityState === 'visible') {
      setTimeout(() => {
        document.title = 'Mensagens - Elit Nexum';
      }, 3000);
    }
  }
};

export default messageNotification;