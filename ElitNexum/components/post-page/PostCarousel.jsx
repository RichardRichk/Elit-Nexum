import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const PostCarousel = ({ images, title }) => {
  const settings = {
    autoplay: true,
    autoplaySpeed: 5000,
    className: 'group',
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    nextArrow: <SampleNextArrow />,
    prevArrow: <SamplePrevArrow />,
  };

  function SamplePrevArrow(props) {
    const { className, style, onClick } = props;
    return (
      <div
        className={
          className +
          ' opacity-0 group-hover:opacity-100 transition before:text-deepviolet block z-50'
        }
        style={{ ...style, left: '3vw', fontSize: '2rem' }}
        onClick={onClick}
      />
    );
  }

  function SampleNextArrow(props) {
    const { className, style, onClick } = props;
    return (
      <div
        className={
          className + ' opacity-0 group-hover:opacity-100 transition block z-50'
        }
        style={{ ...style, right: '3vw', fontSize: '2rem' }}
        onClick={onClick}
      />
    );
  }

  return (
    <Slider {...settings}>
      {images.map((image) => (
        <div key={image} className="group">
          <img className="rounded w-full h-auto" src={image} alt={title} />
        </div>
      ))}
    </Slider>
  );
};

export default PostCarousel;