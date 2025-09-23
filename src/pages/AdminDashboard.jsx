import React, { useState, useEffect } from 'react';
import { supabase } from '../mockSupabase';

const AdminDashboard = () => {
  const [file, setFile] = useState(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState([]);

  // Mock product data fetch for display
  useEffect(() => {
    supabase.from('products').select('*').then(({ data }) => {
      setProducts(data);
    });
  }, []);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      handleFileUpload(selectedFile);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const selectedFile = e.dataTransfer.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      handleFileUpload(selectedFile);
    }
  };

  const handleFileUpload = (fileToUpload) => {
    if (!fileToUpload) return;

    setLoading(true);
    const reader = new FileReader();
    reader.onload = (e) => {
      const data = e.target.result;
      
      // --- Supabase Backend Logic Placeholder ---
      // For now, we'll just show a message and reload the dummy data.
      
      setTimeout(() => {
        setLoading(false);
        const messageBox = document.createElement('div');
        messageBox.className = 'fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-lg shadow-xl border border-gray-200 text-center';
        messageBox.innerHTML = `
          <h2 class="text-2xl font-bold mb-2 text-green-600">Upload Successful!</h2>
          <p class="text-gray-700">File has been processed.</p>
          <button onclick="this.parentNode.remove()" class="mt-4 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition">OK</button>
        `;
        document.body.appendChild(messageBox);
        setFile(null);
      }, 1500);
    };
    reader.readAsBinaryString(fileToUpload);
  };

  return (
    <section className="container mx-auto px-4 py-16">
      <div className="max-w-4xl mx-auto bg-white p-8 md:p-12 rounded-2xl shadow-lg border border-gray-200">
        <h1 className="text-4xl font-extrabold text-center text-gray-900 mb-8">Admin Dashboard</h1>
        <div className="space-y-8">
          {/* File Upload Section */}
          <div
            className={`border-2 border-dashed rounded-lg p-10 text-center transition-colors ${isDragOver ? 'border-indigo-600 bg-indigo-50' : 'border-gray-300 bg-gray-50'}`}
            onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
            onDragLeave={() => setIsDragOver(false)}
            onDrop={handleDrop}
          >
            <input
              type="file"
              onChange={handleFileChange}
              accept=".xlsx, .xls"
              className="hidden"
              id="excel-file-upload"
            />
            <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v8" />
            </svg>
            <p className="text-lg text-gray-600 mb-2">
              <label htmlFor="excel-file-upload" className="font-semibold text-indigo-600 cursor-pointer hover:text-indigo-800 transition">
                Click to upload
              </label>
              &nbsp;or drag and drop
            </p>
            <p className="text-sm text-gray-500">
              Excel (.xlsx) or (.xls) files only.
            </p>
            {loading && (
              <div className="mt-4 text-indigo-600">Uploading and Processing...</div>
            )}
            {file && <p className="mt-2 text-sm text-gray-800">File selected: {file.name}</p>}
          </div>

          {/* Product Listing Section */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Current Products</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white rounded-lg shadow-md border border-gray-200">
                <thead>
                  <tr className="bg-gray-200 text-gray-700 uppercase text-sm leading-normal">
                    <th className="py-3 px-6 text-left">ID</th>
                    <th className="py-3 px-6 text-left">Name</th>
                    <th className="py-3 px-6 text-left">Category</th>
                    <th className="py-3 px-6 text-left">Type</th>
                    <th className="py-3 px-6 text-left">Price ($)</th>
                  </tr>
                </thead>
                <tbody className="text-gray-600 text-sm font-light">
                  {products.map(p => (
                    <tr key={p.id} className="border-b border-gray-200 hover:bg-gray-100">
                      <td className="py-3 px-6 text-left whitespace-nowrap">{p.id}</td>
                      <td className="py-3 px-6 text-left">{p.name}</td>
                      <td className="py-3 px-6 text-left">{p.category}</td>
                      <td className="py-3 px-6 text-left">{p.type}</td>
                      <td className="py-3 px-6 text-left">₹{p.price}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AdminDashboard;
