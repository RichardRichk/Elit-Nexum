import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { PhotographIcon } from '@heroicons/react/outline';

const ImageDropzone = ({ setImages }) => {
  const onDrop = useCallback((acceptedFiles) => {
    setImages(acceptedFiles);
  }, []);

  const onDropRejected = () => {
    alert('Por favor, envie apenas até 5 arquivos de imagem!');
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    maxFiles: 5,
    accept: 'image/*',
    onDropRejected,
  });

  return (
    <div
      className="bg-white cursor-pointer shadow-md rounded p-8 w-full text-center"
      {...getRootProps()}
    >
      <div className="border-2 border-dashed rounded p-10 border-deepviolet flex flex-col justify-center items-center">
        <input {...getInputProps()} />
        <PhotographIcon className="w-16 h-16 mb-4 text-deepviolet" />
        <p className="text-lg font-semibold mb-1 font-inconsolata">
          Solte suas imagens aqui ou <span className='text-deepviolet font-inconsolata'>navegue</span>
        </p>
        <p className="text-md text-deepgrayelit font-inconsolata font-semibold">
          Máximo de 5 imagens. Proporção 16:9 recomendada.
        </p>
      </div>
    </div>
  );
};

export default ImageDropzone;
