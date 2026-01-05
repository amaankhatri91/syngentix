import React, { useState } from "react";
import FileCard from "./FileCard";
import { sampleFiles } from "./FilesData";
import { File } from "./types";
import DeleteFileDialog from "./DeleteFileDialog";

const FilesCards: React.FC = () => {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [fileToDelete, setFileToDelete] = useState<File | null>(null);

  const handleEdit = (id: string) => {
    console.log("Edit clicked for file:", id);
  };

  const handleView = (id: string) => {
    console.log("View clicked for file:", id);
  };

  const handleDelete = (id: string) => {
    const file = sampleFiles.find((f) => f.id === id);
    if (file) {
      setFileToDelete(file);
      setDeleteDialogOpen(true);
    }
  };

  const handleConfirmDelete = () => {
    if (fileToDelete) {
      console.log("Deleting file:", fileToDelete.id);
      setDeleteDialogOpen(false);
      setFileToDelete(null);
    }
  };

  const handleCloseDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setFileToDelete(null);
  };

  return (
    <>
      <div className="space-y-3">
        {sampleFiles?.map((file: File) => (
          <FileCard
            key={file.id}
            file={file}
            onEdit={handleEdit}
            onView={handleView}
            onDelete={handleDelete}
          />
        ))}
      </div>
      <DeleteFileDialog
        open={deleteDialogOpen}
        handler={handleCloseDeleteDialog}
        onConfirm={handleConfirmDelete}
        fileName={fileToDelete?.title}
      />
    </>
  );
};

export default FilesCards;
