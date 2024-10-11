const PostInput = ({
  Icon,
  label,
  small,
  id,
  placeholder,
  value,
  setValue,
  required,
}) => {
  return (
    <div>
      <label
        htmlFor={id}
        className="block text-md font-medium text-deepviolet mb-2 font-inconsolata"
      >
        {label} {required && <span className="text-red-400 font-inconsolata">*</span>}
        {small && (
          <small className="block text-xs text-deepgrayelit mb-3 font-inconsolata">{small}</small>
        )}
      </label>
      <div className="mt-1 relative rounded shadow-sm">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Icon className="h-5 w-5 text-deepviolet" aria-hidden="true" />
        </div>
        <input
          type="text"
          id={id}
          className="focus:ring-0 border focus:border-violet block w-full pl-10 sm:text-sm border-grayelit rounded font-inconsolata"
          placeholder={placeholder}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          required={required}
        />
      </div>
    </div>
  );
};

export default PostInput;