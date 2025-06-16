import React, { useState, useEffect } from 'react';
import { storage } from '../services/api/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

export default function BlogForm({ initialData = null, onSubmit, onCancel }) {
  const [title, setTitle] = useState('');
  const [imageLink, setImageLink] = useState('');
  const [sections, setSections] = useState([{ content: '', image_link: '' }]);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title);
      setImageLink(initialData.image_link || '');
      setSections(initialData.sections || [{ content: '', image_link: '' }]);
    }
  }, [initialData]);

  const uploadImage = async (file, pathPrefix = 'blog-images') => {
    const uniqueId = Date.now().toString(36);
    const imageRef = ref(storage, `${pathPrefix}/${uniqueId}-${file.name}`);
    setUploading(true);
    try {
      await uploadBytes(imageRef, file);
      return await getDownloadURL(imageRef);
    } catch (error) {
      console.error('Image upload failed:', error);
      return '';
    } finally {
      setUploading(false);
    }
  };

  const handleMainImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const url = await uploadImage(file);
    if (url) setImageLink(url);
  };

  const handleSectionImageUpload = async (index, file) => {
    const url = await uploadImage(file);
    if (!url) return;
    const updated = [...sections];
    updated[index].image_link = url;
    setSections(updated);
  };

  const handleSectionChange = (index, field, value) => {
    const updated = [...sections];
    updated[index][field] = value;
    setSections(updated);
  };

  const handleAddSection = () => {
    setSections([...sections, { content: '', image_link: '' }]);
  };

  const handleRemoveLastSection = () => {
    if (sections.length > 1) {
      setSections(sections.slice(0, -1));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ title, image_link: imageLink, sections });
    if (!initialData) {
      setTitle('');
      setImageLink('');
      setSections([{ content: '', image_link: '' }]);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-2xl mx-auto p-6 bg-white rounded shadow"
    >
      <h2 className="text-2xl font-bold mb-4">
        {initialData ? 'Update Blog' : 'Create New Blog'}
      </h2>

      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Blog Title"
        className="w-full p-2 mb-4 border rounded"
        required
      />

      <div className="mb-4">
        <label className="block mb-2 font-medium">Main Blog Image</label>
        <input
          type="file"
          accept="image/*"
          onChange={handleMainImageUpload}
          className="w-full p-2 mb-4 border rounded bg-white text-gray-700 cursor-pointer file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-red-50 file:text-red-700 hover:file:bg-red-100"
        />
        {imageLink && (
          <img
            src={imageLink}
            alt="Main"
            className="mt-2 w-full h-48 object-cover rounded"
          />
        )}
      </div>

      {sections.map((section, index) => (
        <div key={index}>
          <h3 className="font-semibold mb-2">Section {index + 1}</h3>
          <textarea
            value={section.content}
            onChange={(e) =>
              handleSectionChange(index, 'content', e.target.value)
            }
            placeholder="Section Content"
            className="w-full p-2 mb-2 border rounded"
          />
          <label className="block">
            <input
              type="file"
              accept="image/*"
              onChange={(e) =>
                handleSectionImageUpload(index, e.target.files[0])
              }
              className="w-full p-2 mb-2 border rounded bg-white text-gray-700 cursor-pointer file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-red-50 file:text-red-700 hover:file:bg-red-100"
            />
          </label>
          {section.image_link && (
            <img
              src={section.image_link}
              alt={`Section ${index + 1}`}
              className="w-full h-40 object-cover rounded"
            />
          )}
        </div>
      ))}

      <div className="flex items-center gap-6 mb-5">
        <button
          type="button"
          onClick={handleRemoveLastSection}
          className="px-3 py-1 rounded bg-red-300 text-white font-bold text-lg"
          disabled={sections.length <= 1}
        >
          -
        </button>
        <button
          type="button"
          onClick={handleAddSection}
          className="px-3 py-1 rounded bg-red-700 text-white font-bold text-lg"
        >
          +
        </button>
      </div>

      <div className="flex gap-4">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 rounded bg-red-300 text-white"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          disabled={uploading}
          className={`px-4 py-2 rounded text-white ${
            initialData ? 'bg-red-400' : 'bg-red-700'
          }`}
        >
          {initialData
            ? uploading
              ? 'Updating...'
              : 'Update Blog'
            : uploading
            ? 'Uploading...'
            : 'Create Blog'}
        </button>
      </div>
    </form>
  );
}
