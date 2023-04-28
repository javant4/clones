import React, { useRef, useState } from "react";

const useSelectFile = () => {
  const [selectedUploadFile, setSelectedUploadFile] = useState<File>();
  const [selectedFile, setSelectedFile] = useState<string>("");

  const onSelectFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    const reader = new FileReader();
    if (event.target.files?.[0]) {
      reader.readAsDataURL(event.target.files[0]);
      setSelectedUploadFile(event.target.files?.[0]);
    }

    reader.onload = (readerEvent) => {
      if (readerEvent.target?.result) {
        setSelectedFile(readerEvent.target?.result as string);
      }
    };
  };
  return {
    selectedFile,
    setSelectedFile,
    selectedUploadFile,
    setSelectedUploadFile,
    onSelectFile,
  };
};

export default useSelectFile;
