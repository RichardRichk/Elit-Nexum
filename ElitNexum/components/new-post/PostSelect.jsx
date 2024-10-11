import { useState, useEffect, useRef } from 'react';
import { AiOutlineDown } from "react-icons/ai";

const MultiSelect = ({
  label,
  options,
  value,
  setValue,
  required,
  showRequiredAsterisk = true,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const selectRef = useRef(null);
  const buttonRef = useRef(null); 

  useEffect(() => {
    if (value) {
      setSelectedOptions(value.split(', ').filter(Boolean));
    } else {
      setSelectedOptions([]);
    }
  }, [value]);

  const toggleOption = (option) => {
    const isSelected = selectedOptions.includes(option);
    const newSelectedOptions = isSelected
      ? selectedOptions.filter((opt) => opt !== option)
      : [...selectedOptions, option];

    setSelectedOptions(newSelectedOptions);
    setValue(newSelectedOptions.join(', '));
  };

  const handleToggleDropdown = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      buttonRef.current.focus();
    }
  };

  const handleClickOutside = (event) => {
    if (selectRef.current && !selectRef.current.contains(event.target)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div ref={selectRef}>
      <label className="block text-md font-medium text-deepviolet mb-2 font-inconsolata">
        {label} {showRequiredAsterisk && required && <span className="text-red-400">*</span>}
      </label>
      <div className="relative">
        <div
          ref={buttonRef} 
          onClick={handleToggleDropdown}
          className="border font-inconsolata focus:ring-0 focus:border-violet border-grayelit rounded p-2 cursor-pointer bg-white flex justify-between items-center"
          tabIndex={0} 
        >
          <span className={selectedOptions.length > 0 ? '' : 'text-deepgrayelit text-sm font-inconsolata'}>
            {selectedOptions.length > 0
              ? selectedOptions.join(', ')
              : 'Selecione opções'}
          </span>
          <AiOutlineDown className="h-4 w-4 text-deepgrayelit" />
        </div>
        {isOpen && (
          <div className="absolute z-10 mt-1 w-full bg-white border border-grayelit rounded shadow-lg">
            {options.map((option) => (
              <div
                key={option.value}
                className={`font-inconsolata flex justify-between items-center p-2 cursor-pointer hover:bg-gray-100 ${selectedOptions.includes(option.value) ? 'bg-gray-200' : ''
                  }`}
                onClick={() => {
                  toggleOption(option.value);
                }}
              >
                <span className='font-inconsolata'>{option.label}</span>
                {selectedOptions.includes(option.value) && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleOption(option.value);
                    }}
                    className="text-red-500"
                  >
                    &times;
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MultiSelect;