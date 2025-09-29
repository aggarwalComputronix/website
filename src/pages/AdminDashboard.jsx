import React, { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';
import { supabase } from '../supabaseClient';

// Helper function to safely parse Excel values into their expected types
const parseValue = (value, targetType) => {
  if (value === undefined || value === null || value === '') {
    return null;
  }

  // Convert common text values in Excel to numbers for 'inventory'
  if (targetType === 'inventory') {
    const textValue = String(value).toLowerCase().trim();
    if (textValue === 'instock' || textValue === 'in stock') {
      return 99999; // Represents effectively unlimited stock
    }
    // Attempt to parse as integer for numeric inventory values
    return parseInt(value, 10) || 0; 
  }

  // Convert values for Numeric types
  if (targetType === 'numeric') {
    const parsed = parseFloat(value);
    // If it's a valid number, return it, otherwise null
    return isNaN(parsed) ? null : parsed;
  }
  
  // Convert values for Boolean types (e.g., 'TRUE', 1, 'Yes' -> true)
  if (targetType === 'boolean') {
    const textValue = String(value).toLowerCase().trim();
    return textValue === 'true' || textValue === '1' || textValue === 'yes';
  }

  // Convert values for Integer types
  if (targetType === 'integer') {
    const parsed = parseInt(value, 10);
    return isNaN(parsed) ? null : parsed;
  }

  // Default to text (string)
  return String(value);
};


const AdminDashboard = () => {
  const [file, setFile] = useState(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingProduct, setEditingProduct] = useState(null); // State for editing

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    // Fetch all products from the real Supabase table
    const { data, error } = await supabase.from('products').select('*');
    if (error) {
      console.error('Error fetching products:', error);
      setProducts([]); 
    } else {
      setProducts(data);
    }
  };

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
    reader.onload = async (e) => {
      const data = e.target.result;
      const workbook = XLSX.read(data, { type: 'binary' });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const parsedData = XLSX.utils.sheet_to_json(sheet);

      const mappedProducts = parsedData.map(row => ({
        "handleId": parseValue(row.handleId, 'text'),
        "fieldType": parseValue(row.fieldType, 'text'),
        "name": parseValue(row.name, 'text'),
        "description": parseValue(row.description, 'text'),
        "productImageUrl": parseValue(row.productImageUrl, 'text'),
        "collection": parseValue(row.collection, 'text'),
        "sku": parseValue(row.sku, 'text'),
        "ribbon": parseValue(row.ribbon, 'text'),
        "price": parseValue(row.price, 'numeric'),
        "surcharge": parseValue(row.surcharge, 'numeric'),
        "visible": parseValue(row.visible, 'boolean'),
        "discountMode": parseValue(row.discountMode, 'text'),
        "discountValue": parseValue(row.discountValue, 'numeric'),
        "inventory": parseValue(row.inventory, 'inventory'),
        "weight": parseValue(row.weight, 'numeric'),
        "cost": parseValue(row.cost, 'numeric'),
        "productOptionName1": parseValue(row.productOptionName1, 'text'),
        "productOptionType1": parseValue(row.productOptionType1, 'text'),
        "productOptionDescription1": parseValue(row.productOptionDescription1, 'text'),
        "productOptionName2": parseValue(row.productOptionName2, 'text'),
        "productOptionType2": parseValue(row.productOptionType2, 'text'),
        "productOptionDescription2": parseValue(row.productOptionDescription2, 'text'),
        "productOptionName3": parseValue(row.productOptionName3, 'text'),
        "productOptionType3": parseValue(row.productOptionType3, 'text'),
        "productOptionDescription3": parseValue(row.productOptionDescription3, 'text'),
        "productOptionName4": parseValue(row.productOptionName4, 'text'),
        "productOptionType4": parseValue(row.productOptionType4, 'text'),
        "productOptionDescription4": parseValue(row.productOptionDescription4, 'text'),
        "productOptionName5": parseValue(row.productOptionName5, 'text'),
        "productOptionType5": parseValue(row.productOptionType5, 'text'),
        "productOptionDescription5": parseValue(row.productOptionDescription5, 'text'),
        "productOptionName6": parseValue(row.productOptionName6, 'text'),
        "productOptionType6": parseValue(row.productOptionType6, 'text'),
        "productOptionDescription6": parseValue(row.productOptionDescription6, 'text'),
        "additionalInfoTitle1": parseValue(row.additionalInfoTitle1, 'text'),
        "additionalInfoDescription1": parseValue(row.additionalInfoDescription1, 'text'),
        "additionalInfoTitle2": parseValue(row.additionalInfoTitle2, 'text'),
        "additionalInfoDescription2": parseValue(row.additionalInfoDescription2, 'text'),
        "additionalInfoTitle3": parseValue(row.additionalInfoTitle3, 'text'),
        "additionalInfoDescription3": parseValue(row.additionalInfoDescription3, 'text'),
        "additionalInfoTitle4": parseValue(row.additionalInfoTitle4, 'text'),
        "additionalInfoDescription4": parseValue(row.additionalInfoDescription4, 'text'),
        "additionalInfoTitle5": parseValue(row.additionalInfoTitle5, 'text'),
        "additionalInfoDescription5": parseValue(row.additionalInfoDescription5, 'text'),
        "additionalInfoTitle6": parseValue(row.additionalInfoTitle6, 'text'),
        "additionalInfoDescription6": parseValue(row.additionalInfoDescription6, 'text'),
        "customTextField1": parseValue(row.customTextField1, 'text'),
        "customTextCharLimit1": parseValue(row.customTextCharLimit1, 'integer'),
        "customTextMandatory1": parseValue(row.customTextMandatory1, 'boolean'),
        "customTextField2": parseValue(row.customTextField2, 'text'),
        "customTextCharLimit2": parseValue(row.customTextCharLimit2, 'integer'),
        "customTextMandatory2": parseValue(row.customTextMandatory2, 'boolean'),
        "brand": parseValue(row.brand, 'text'),
      }));

      // --- SUPABASE INSERTION ---
      console.log(`Attempting to upload ${mappedProducts.length} records to Supabase...`);
      const { error } = await supabase.from('products').insert(mappedProducts);
      
      if (error) {
        console.error('Error inserting data:', error);
        alert('Error inserting data: ' + error.message);
      } else {
        alert('Products uploaded successfully! Total: ' + mappedProducts.length);
        fetchProducts();
      }
      
      setLoading(false);
    };
    reader.readAsBinaryString(fileToUpload);
  };
  
  // --- DELETE PRODUCT LOGIC ---
  const handleDelete = async (productId, productName) => {
    const confirmDelete = await new Promise(resolve => {
        const messageBox = document.createElement('div');
        messageBox.className = 'fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-lg shadow-xl border border-gray-200 text-center z-50';
        messageBox.innerHTML = `
            <h2 class="text-2xl font-bold mb-2 text-red-600">Confirm Deletion</h2>
            <p class="text-gray-700 mb-4">Are you sure you want to delete "${productName}"?</p>
            <div class="flex justify-center space-x-4">
                <button onclick="document.getElementById('confirm-box-container').remove(); resolve(true);" class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition">Yes, Delete</button>
                <button onclick="document.getElementById('confirm-box-container').remove(); resolve(false);" class="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 transition">Cancel</button>
            </div>
        `;
        const container = document.createElement('div');
        container.id = 'confirm-box-container';
        container.appendChild(messageBox);
        document.body.appendChild(container);
    });

    if (!confirmDelete) {
        return;
    }

    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', productId);

    if (error) {
      console.error('Error deleting product:', error);
      alert('Error deleting product: ' + error.message);
    } else {
      alert(`Product "${productName}" deleted successfully.`);
      fetchProducts(); // Refresh list
    }
  };

  // --- SEARCH FILTERING ---
  const filteredProducts = products.filter(product => 
    product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.sku?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.brand?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <section className="container mx-auto px-4 py-16">
      <div className="max-w-6xl mx-auto bg-white p-8 md:p-12 rounded-2xl shadow-lg border border-gray-200">
        <h1 className="text-4xl font-extrabold text-center text-gray-900 mb-8">Admin Dashboard</h1>
        
        {/* File Upload Area */}
        <div className="space-y-8 mb-8">
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
              Excel (.xlsx) or (.xls) files only. (Adds new products to existing inventory)
            </p>
            {loading && (
              <div className="mt-4 text-indigo-600">Uploading and Processing...</div>
            )}
            {file && <p className="mt-2 text-sm text-gray-800">File selected: {file.name}</p>}
          </div>
        </div>

        {/* Product List and Search */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-gray-900">Inventory Management ({products.length} total products)</h2>
          
          {/* Search Bar */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search by Name, SKU, or Brand..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 absolute left-3 top-3 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>

          <div className="overflow-x-auto rounded-lg border border-gray-200">
            <table className="min-w-full bg-white">
              <thead>
                <tr className="bg-gray-100 text-gray-700 uppercase text-sm leading-normal border-b">
                  <th className="py-3 px-4 text-left">Name / SKU</th>
                  <th className="py-3 px-4 text-left">Collection</th>
                  <th className="py-3 px-4 text-left">Brand</th>
                  <th className="py-3 px-4 text-left">Price (₹)</th>
                  <th className="py-3 px-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="text-gray-800 text-sm font-light">
                {filteredProducts.slice(0, 15).map(p => (
                  <tr key={p.id} className="border-b border-gray-200 hover:bg-indigo-50 transition-colors">
                    <td className="py-3 px-4 text-left">
                      <div className="font-semibold text-gray-900">{p.name}</div>
                      <div className="text-xs text-gray-500">{p.sku}</div>
                    </td>
                    <td className="py-3 px-4 text-left">{p.collection}</td>
                    <td className="py-3 px-4 text-left">{p.brand}</td>
                    <td className="py-3 px-4 text-left font-semibold">₹{p.price}</td>
                    <td className="py-3 px-4 text-center whitespace-nowrap">
                      <button 
                        onClick={() => setEditingProduct(p)} 
                        className="text-indigo-600 hover:text-indigo-800 font-medium px-2 py-1 transition"
                      >
                        Edit
                      </button>
                      <button 
                        onClick={() => handleDelete(p.id, p.name)} 
                        className="text-red-600 hover:text-red-800 font-medium px-2 py-1 transition ml-2"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredProducts.length === 0 && (
              <div className="text-center py-8 text-gray-500">No products match your search query.</div>
            )}
             {filteredProducts.length > 15 && (
              <div className="text-center py-3 text-gray-500 bg-gray-50 border-t border-gray-200">
                 Showing 15 of {filteredProducts.length} filtered products...
              </div>
            )}
          </div>
        </div>

        {/* Edit Product Modal (Placeholder) */}
        {editingProduct && (
          <EditProductModal 
            product={editingProduct} 
            onClose={() => setEditingProduct(null)} 
            onSave={() => {
              fetchProducts(); // Refresh list after saving
              setEditingProduct(null); 
            }}
          />
        )}
      </div>
    </section>
  );
};

// --- Edit Modal Component (Placeholder) ---
const EditProductModal = ({ product, onClose, onSave }) => {
    // This is a placeholder for a future modal implementation
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-lg space-y-6">
                <h2 className="text-2xl font-bold text-gray-900">Edit Product: {product.name}</h2>
                <p className="text-gray-600">
                    *Detailed editing features will be built here. For now, you can only view the product data.*
                </p>
                <div className="border p-4 rounded-lg bg-gray-50 text-sm">
                    <strong>SKU:</strong> {product.sku}<br/>
                    <strong>Price:</strong> ₹{product.price}<br/>
                    <strong>Collection:</strong> {product.collection}
                </div>
                <div className="flex justify-end space-x-4">
                    <button onClick={onClose} className="px-4 py-2 text-gray-600 bg-gray-200 rounded-lg hover:bg-gray-300 transition">
                        Close
                    </button>
                    <button 
                      onClick={onSave} 
                      className="px-4 py-2 text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition"
                      // Placeholder for actual save function
                    >
                        Save Changes (Demo)
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
