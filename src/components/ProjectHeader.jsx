import React, { useState } from 'react';
import { Pencil, Check, X, Upload, Trash2 } from 'lucide-react';
import { supabase } from "../utils/supabase";

const ProjectHeader = ({ project, onUpdate, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(project.name);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const getInitials = (name) => {
    if (!name || typeof name !== 'string') {
      return '';
    }
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const handleFileSelect = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile({
        file: file,
        preview: URL.createObjectURL(file)
      });
    }
  };

  const uploadImage = async (file) => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).slice(2)}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('images')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('images')
        .getPublicUrl(filePath);

      return publicUrl;
    } catch (error) {
      console.error('Error uploading image:', error);
      throw error;
    }
  };

  const handleDelete = async () => {
    try {
      const { error } = await supabase
        .from("projects")
        .delete()
        .eq("id", project.id);

      if (error) throw error;

      if (project.icon) {
        const iconPath = project.icon.split('/').pop();
        await supabase.storage
          .from('images')
          .remove([iconPath]);
      }

      setShowDeleteDialog(false);
      onDelete(project.id);
    } catch (err) {
      console.error("Error deleting project:", err);
    }
  };

  const handleSave = async () => {
    setIsUploading(true);
    try {
      let iconUrl = project.icon;

      if (selectedFile?.file) {
        if (project.icon) {
          const oldIconPath = project.icon.split('/').pop();
          await supabase.storage
            .from('images')
            .remove([oldIconPath]);
        }

        iconUrl = await uploadImage(selectedFile.file);
      }

      const { error } = await supabase
        .from("projects")
        .update({ 
          name: editedName, 
          icon: iconUrl 
        })
        .eq("id", project.id);

      if (error) throw error;

      onUpdate({
        ...project,
        name: editedName,
        icon: iconUrl,
      });

      setIsEditing(false);
    } catch (err) {
      console.error("Error in handleSave:", err);
    } finally {
      setIsUploading(false);
    }
  };

  const handleCancel = () => {
    setEditedName(project.name);
    setSelectedFile(null);
    setIsEditing(false);
  };

  return (
    <>
      <div className="flex items-center gap-5 mb-5 p-5">
        <div className="relative group">
          <div className="w-14 h-14 rounded-lg bg-gray-100 flex items-center justify-center overflow-hidden">
            {(project.icon || selectedFile?.preview) ? (
              <img 
                src={selectedFile?.preview || project.icon} 
                alt={project.name}
                className="w-full h-full object-cover p-2"
              />
            ) : (
              <span className="text-lg font-semibold text-gray-600">
                {getInitials(project.name)}
              </span>
            )}
          </div>
          
          {isEditing && (
            <label className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-lg cursor-pointer">
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileSelect}
              />
              <Upload className="w-6 h-6 text-white" />
            </label>
          )}
        </div>

        {isEditing ? (
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={editedName}
              onChange={(e) => setEditedName(e.target.value)}
              className="px-2 py-1 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={handleSave}
              disabled={isUploading}
              className="p-1 rounded hover:bg-green-100 disabled:opacity-50"
            >
              <Check className="w-5 h-5 text-green-600" />
            </button>
            <button
              onClick={handleCancel}
              disabled={isUploading}
              className="p-1 rounded hover:bg-red-100 disabled:opacity-50"
            >
              <X className="w-5 h-5 text-red-600" />
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <span className="text-lg">{project.name}</span>
            <button
              onClick={() => setIsEditing(true)}
              className="p-1 rounded hover:bg-gray-100"
            >
              <Pencil className="w-4 h-4 text-gray-600" />
            </button>
            <button
              onClick={() => setShowDeleteDialog(true)}
              className="p-1 rounded hover:bg-red-100"
            >
              <Trash2 className="w-4 h-4 text-red-600" />
            </button>
          </div>
        )}
      </div>

      {showDeleteDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg w-96">
            <h2 className="text-lg font-bold mb-4">Delete Project</h2>
            <p className="text-gray-600 mb-4">
              You are deleting your project "{project.name}". Are you sure?
              This action cannot be undone.
            </p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowDeleteDialog(false)}
                className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ProjectHeader;
