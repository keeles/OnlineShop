import {SetStateAction, useCallback, useState} from "react";
import {useDropzone} from "react-dropzone";
import {twMerge} from "tailwind-merge";

const acceptedImageTypes = ["image/jpg", "image/jpeg", "image/png", "image/gif"];

export default function Dropzone({files, setFiles}: {files: File[]; setFiles: React.Dispatch<SetStateAction<File[]>>}) {
  const [dragOver, setDragOver] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setDragOver(false);
    setIsLoading(true);

    acceptedFiles.forEach((file: File) => {
      if (!file) return;
      if (!acceptedImageTypes.includes(file.type)) return;
      const alreadyAdded = files.find((prevFile) => prevFile.name === file.name);
      if (alreadyAdded) return;
      files.push(file);
    });
    setFiles(files);
    setIsLoading(false);
  }, []);

  const {getRootProps, getInputProps} = useDropzone({onDrop});

  return (
    <div
      {...getRootProps()}
      onDragOver={() => setDragOver(true)}
      onDragLeave={() => setDragOver(false)}
      className={twMerge(
        "w-full h-full flex items-center justify-center border-dashed rounded-lg border-foreground border-2 hover:cursor-pointer",
        dragOver ? "border-marinaGreen border-2" : "",
        isLoading ? "cursor-not-allowed" : ""
      )}
    >
      <input {...getInputProps()} />
      <p>{files.length > 0 ? `Images Loaded` : `Drag 'n' drop images here, or click to select from files`}</p>
    </div>
  );
}
