const Footer = () => {
  return (
    <footer className="bg-white">
      <div className="max-w-7xl mx-auto py-2 px-4 overflow-hidden sm:px-6 lg:px-8">
        <p className="text-center text-deepgrayelit font-inconsolata">
          &copy; {new Date().getFullYear()} Elit Nexum - Desenvolvido pela Team Four.
        </p>
      </div>
    </footer>
  );
};

export default Footer;