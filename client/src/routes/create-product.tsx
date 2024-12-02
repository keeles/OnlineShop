import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {createFileRoute, useNavigate} from "@tanstack/react-router";
import {useForm} from "@tanstack/react-form";
import {api} from "@/lib/api";

export const Route = createFileRoute("/create-product")({
  component: CreateProduct,
});

function CreateProduct() {
  const navigate = useNavigate();
  const form = useForm({
    defaultValues: {
      title: "",
      description: "",
      price: 0,
    },
    onSubmit: async ({value}) => {
      await new Promise((r) => setTimeout(r, 2000));
      const res = await api.products.$post({json: value});
      if (!res.ok) throw new Error("Server Error");
      navigate({to: "/"});
    },
  });

  return (
    <div className="p-2 max-w-md flex flex-col items-center justify-center">
      <h2>Add New Product</h2>
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
          children={(field) => (
            <>
              <Label htmlFor={field.name}>Title</Label>
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
          name="description"
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
          children={(field) => (
            <>
              <Label htmlFor={field.name}>Price</Label>
              <Input
                name={field.name}
                value={field.state.value}
                step="0.01"
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(Number(e.target.value))}
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
    </div>
  );
}
