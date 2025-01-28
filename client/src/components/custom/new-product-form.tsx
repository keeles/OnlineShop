import {api} from "@/lib/api";
import {createProductSchema} from "@server/sharedTypes";
import {useForm} from "@tanstack/react-form";
import {useNavigate} from "@tanstack/react-router";
import {zodValidator} from "@tanstack/zod-form-adapter";
import {Label} from "../ui/label";
import {Input} from "../ui/input";
import {Button} from "../ui/button";

export default function NewProductForm() {
  const navigate = useNavigate();
  const form = useForm({
    validatorAdapter: zodValidator(),
    defaultValues: {
      title: "",
      description: "",
      price: "",
      images: [
        {
          url: "",
          fileName: "",
        },
      ],
    },
    onSubmit: async ({value}) => {
      const res = await api.products.$post({json: value});
      if (!res.ok) throw new Error("Server Error");
      navigate({to: "/"});
    },
  });

  return (
    <form
      className="max-w-md margin-auto"
      action=""
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        void form.handleSubmit();
      }}
    >
      <form.Field
        name="title"
        validators={{
          onChange: createProductSchema.shape.title,
        }}
        children={(field) => (
          <div>
            <Label htmlFor={field.name}>Title</Label>
            <Input
              name={field.name}
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.value)}
            />
            {field.state.meta.errors ? <em role="alert">{field.state.meta.errors.join(", ")}</em> : null}
          </div>
        )}
      />
      <form.Field
        name="description"
        validators={{
          onChange: createProductSchema.shape.description,
        }}
        children={(field) => (
          <>
            <Label htmlFor={field.name}>Description</Label>
            <Input
              name={field.name}
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.value)}
            />
            {field.state.meta.errors ? <em role="alert">{field.state.meta.errors.join(", ")}</em> : null}
          </>
        )}
      />
      <form.Field
        name="price"
        validators={{
          onChange: createProductSchema.shape.price,
        }}
        children={(field) => (
          <>
            <Label htmlFor={field.name}>Price</Label>
            <Input
              name={field.name}
              value={field.state.value}
              step="0.01"
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.value)}
            />
            {field.state.meta.errors ? <em role="alert">{field.state.meta.errors.join(", ")}</em> : null}
          </>
        )}
      />

      <form.Subscribe
        selector={(state) => [state.canSubmit, state.isSubmitting]}
        children={([canSubmit, isSubmitting]) => (
          <Button className="my-2" type="submit" disabled={!canSubmit}>
            {isSubmitting ? "Adding..." : "Add"}
          </Button>
        )}
      />
    </form>
  );
}
