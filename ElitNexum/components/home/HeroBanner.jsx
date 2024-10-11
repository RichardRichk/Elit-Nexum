import Lottie from "lottie-react";
import animationData from "../../public/illustrations/space.json";

const HeroBanner = ({ user }) => {
  return (
    <div id="back-to-top" className="bg-gradient-to-br from-deepviolet via-violet to-deepviolet py-5 px-4 md:px-0 md:py-5 overflow-hidden">
      <div className="container mx-auto flex gap-3 items-center flex-wrap sm:flex-nowrap md:px-12">
        <div className="flex-3 text-center md:text-left">
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-4 md:mb-6 xl:w-5/6 2xl:w-3/4 font-poppins">
            {user
              ? "Compartilhe seus projetos com desenvolvedores ao redor do mundo"
              : "Descubra sites e desenvolvedores criativos"}
          </h1>
          <p className="text-sm md:text-md lg:text-lg font-medium text-white mb-6 xl:w-5/6 2xl:w-3/4 font-poppins">
            {user
              ? "Tem um projeto para mostrar? Publique-o no Elit Nexum para que seu trabalho criativo seja visto por centenas de desenvolvedores, ganhe distintivos e seja promovido em nossas redes sociais."
              : "Crie uma conta gratuita hoje para interagir com postagens de desenvolvedores ao redor do mundo. Abra as portas para curtir, comentar, seguir e conversar."}
          </p>
        </div>
        <Lottie className="hidden md:block mx-auto mb-10 sm:mb-0 md:h-96 lg:h-104 2xl:h-120 3xl:h-144 w-auto flex-2 overflow-hidden"  style={{ transform: 'scale(1.5)', margin: '0' }} animationData={animationData} loop={true} />
      </div>
    </div>
  );
};

export default HeroBanner;