
  const Input = ({ name, type, placeholder, onChange, value }) => {
    return (
      <>
        <input
          type={type}
          name={name}
          id={name}
          placeholder={placeholder}
          onChange={onChange}
          value={value}
          className="w-full outline-none bg-input placeholder:text-gray"
        />
      </>
    );
  };
  
  export default Input;
  