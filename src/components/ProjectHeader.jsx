import React, { useState } from 'react';
import { Pencil, Check, X, Upload } from 'lucide-react';

const ProjectHeader = ({ project, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(project.name);
  const [selectedFile, setSelectedFile] = useState(null);
  
  // Generate initials from project name
  const getInitials = (name) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedFile(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    onUpdate({
      ...project,
      name: editedName,
      icon: selectedFile || project.icon
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedName(project.name);
    setSelectedFile(null);
    setIsEditing(false);
  };

  return (
    <div className="flex items-center gap-5 mb-5 p-5">
      <div className="relative group">
        {/* Project Icon/Initials */}
        <div className="w-14 h-14 rounded-lg bg-gray-100 flex items-center justify-center overflow-hidden">
          {project.icon || selectedFile ? (
            <img 
              src={selectedFile || project.icon} 
              alt={project.name}
              className="w-full h-full object-cover p-2"
            />
          ) : (
            <span className="text-lg font-semibold text-gray-600">
              {getInitials(project.name)}
            </span>
          )}
        </div>
        
        {/* Icon Edit Overlay */}
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

      {/* Project Name */}
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
            className="p-1 rounded hover:bg-green-100"
          >
            <Check className="w-5 h-5 text-green-600" />
          </button>
          <button
            onClick={handleCancel}
            className="p-1 rounded hover:bg-red-100"
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
        </div>
      )}
    </div>
  );
};

export default ProjectHeader;