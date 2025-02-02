import { useForm } from "react-hook-form";

const Footer = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = (data) => {
    console.log(data);
  };

  return (
    <footer className="bg-neutral py-8">
      <div className="container mx-auto px-4">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="max-w-md mx-auto space-y-4"
        >
          <div>
            <input
              className="w-full p-2 border rounded"
              {...register("name", { required: "Nom requis" })}
              placeholder="Votre nom"
            />
            {errors.name && <p className="text-red-500">{errors.name.message}</p>}
          </div>
          <div>
            <input
              className="w-full p-2 border rounded"
              {...register("email", { required: "Email requis" })}
              placeholder="Votre email"
              type="email"
            />
            {errors.email && <p className="text-red-500">{errors.email.message}</p>}
          </div>
          <div>
            <textarea
              className="w-full p-2 border rounded"
              {...register("message", { required: "Message requis" })}
              placeholder="Votre message"
              rows="4"
            />
            {errors.message && <p className="text-red-500">{errors.message.message}</p>}
          </div>
          <button
            type="submit"
            className="w-full bg-primary text-white py-2 px-4 rounded hover:bg-opacity-90 transition-all"
          >
            Envoyer
          </button>
        </form>
      </div>
    </footer>
  );
};

export default Footer; 