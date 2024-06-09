import Input from "../components/input";

const Form = ({children, onSubmit, formName }) => {

  return (
    <form
      action=""
      onSubmit={onSubmit}
    >
      <h1 className="text-center text-dark text-4xl font-semibold pb-10">
        {formName}
      </h1>
      <div className="flex gap-4 flex-col">
        {children}
      </div>
    </form>
  );
};

export default Form;
