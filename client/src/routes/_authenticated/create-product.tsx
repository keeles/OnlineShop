import {createFileRoute, useNavigate} from "@tanstack/react-router";
import Dropzone from "@/components/custom/drop-zone";
import {useForm} from "@tanstack/react-form";
import {zodValidator} from "@tanstack/zod-form-adapter";
import {api, getSignedUrl} from "@/lib/api";
import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";
import {createProductSchema} from "@server/sharedTypes";
import {Button} from "@/components/ui/button";
import {useState} from "react";

export const Route = createFileRoute("/_authenticated/create-product")({
  component: CreateProduct,
});

function CreateProduct() {
  const [files, setFiles] = useState<File[]>([]);

  const navigate = useNavigate();
  const form = useForm({
    validatorAdapter: zodValidator(),
    defaultValues: {
      title: "",
      description: "",
      price: "",
    },
    onSubmit: async ({value}) => {
      try {
        const valid = createProductSchema.parse(value);
        const fileData = await Promise.all(
          files.map(async (file) => {
            const postData = {fileName: file.name, fileType: file.type, fileSize: file.size};
            const preSigned = await getSignedUrl(postData.fileName, postData.fileType, postData.fileSize);
            await uploadToS3(file, preSigned.url);
            return {fileName: file.name, url: preSigned.url};
          })
        );
        const res = await api.products.$post({json: {...valid, images: fileData}});
        if (!res.ok) throw new Error("Server Error");
        navigate({to: "/"});
      } catch (err) {
        console.log(err);
        alert(err);
      }
    },
  });

  return (
    <div className="p-2 max-w-3xl gap-y-4 flex flex-col items-center justify-center">
      <h2>Add New Product</h2>
      <div className="flex justify-between space-x-10">
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
        <div className="w-96 h-vh">
          <Dropzone files={files} setFiles={setFiles} />
        </div>
      </div>
    </div>
  );
}

async function uploadToS3(file: File, presignedUrl: string) {
  const uploadResponse = await fetch(presignedUrl, {
    method: "PUT",
    headers: {
      "Content-Type": file.type,
    },
    body: file,
  });

  if (!uploadResponse.ok) throw new Error("Server Error");
  return presignedUrl;
}
