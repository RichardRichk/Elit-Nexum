const PostDetailsLink = ({ Icon, detail }) => {
  // Verifica se o detail está vazio ou não é válido
  if (!detail || (typeof detail === "string" && detail.trim() === "")) return null;

  return (
    <div className="flex flex-wrap items-center border-b py-1">
      <div className="w-5 mr-2">
        <Icon className="h-5 w-5 text-deepviolet" />
      </div>
      <a
        href={`${detail}?ref=Elit Nexum`}
        target="_blank"
        rel="noopener"
        className="hover:text-deepviolet flex-1 font-inconsolata transition break-all"
      >
        {detail}
      </a>
    </div>
  );
};

export default PostDetailsLink;