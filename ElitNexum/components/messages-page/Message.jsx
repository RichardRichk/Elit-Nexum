import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const Message = ({ message, user, divRef }) => {
  const isUserSender = message.sender === user._id;

  return (
    <div
      className={`${isUserSender ? 'ml-auto' : 'mr-auto'
        } w-max max-w-xs md:max-w-xs lg:max-w-md xl:max-w-lg mb-2`}
      ref={divRef}
    >
      <div
        className={`${isUserSender
          ? 'bg-violet rounded-tr-none'
          : 'bg-deepviolet rounded-tl-none'
          } rounded py-2 mb-1 font-medium px-4 text-left`}
      >
        <p className="break-words text-white">{message.message}</p>
      </div>
      <p
        className={`text-xs text-grayelit ${isUserSender ? 'text-right' : 'text-left'
          }`}
      >
        {format(new Date(message.date), 'd MMM, hh:mm a', { locale: ptBR })}
      </p>
    </div>
  );
};

export default Message;