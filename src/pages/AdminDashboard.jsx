import React, { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';
import { supabase } from '../supabaseClient';
import { DUMMY_SUPABASE_DATA } from '../mockSupabase';

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

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    // Replace with your real Supabase client fetch when ready
    // const { data, error } = await supabase.from('products').select('*');
    const data = DUMMY_SUPABASE_DATA.products; // Dummy data for display
    setProducts(data);
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
        "price": parseValue(row.price, 'numeric'), // NUMERIC(10, 2)
        "surcharge": parseValue(row.surcharge, 'numeric'), // NUMERIC(10, 2)
        "visible": parseValue(row.visible, 'boolean'), // BOOLEAN
        "discountMode": parseValue(row.discountMode, 'text'),
        "discountValue": parseValue(row.discountValue, 'numeric'), // NUMERIC(10, 2)
        "inventory": parseValue(row.inventory, 'inventory'), // INTEGER with 'InStock' handling
        "weight": parseValue(row.weight, 'numeric'), // NUMERIC(10, 2)
        "cost": parseValue(row.cost, 'numeric'), // NUMERIC(10, 2)
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
        "customTextCharLimit1": parseValue(row.customTextCharLimit1, 'integer'), // INTEGER
        "customTextMandatory1": parseValue(row.customTextMandatory1, 'boolean'), // BOOLEAN
        "customTextField2": parseValue(row.customTextField2, 'text'),
        "customTextCharLimit2": parseValue(row.customTextCharLimit2, 'integer'), // INTEGER
        "customTextMandatory2": parseValue(row.customTextMandatory2, 'boolean'), // BOOLEAN
        "brand": parseValue(row.brand, 'text'),
      }));

      // --- SUPABASE INSERTION ---
      console.log(`Attempting to upload ${mappedProducts.length} records to Supabase...`);
      // Uncomment the block below to enable real database insertion
      const { error } = await supabase.from('products').insert(mappedProducts);
      if (error) {
        console.error('Error inserting data:', error);
        alert('Error inserting data: invalid input syntax for type integer: "InStock"' + error.message);
      } else {
        alert('Products uploaded successfully! Total: ' + mappedProducts.length);
        fetchProducts(); // Refresh the list of products
      }
      
      setLoading(false);
    };
    reader.readAsBinaryString(fileToUpload);
  };

  return (
    <section className="container mx-auto px-4 py-16">
      <div className="max-w-4xl mx-auto bg-white p-8 md:p-12 rounded-2xl shadow-lg border border-gray-200">
        <h1 className="text-4xl font-extrabold text-center text-gray-900 mb-8">Admin Dashboard</h1>
        <div className="space-y-8">
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
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Current Products</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white rounded-lg shadow-md border border-gray-200">
                <thead>
                  <tr className="bg-gray-200 text-gray-700 uppercase text-sm leading-normal">
                    <th className="py-3 px-6 text-left">Name</th>
                    <th className="py-3 px-6 text-left">Collection</th>
                    <th className="py-3 px-6 text-left">Brand</th>
                    <th className="py-3 px-6 text-left">Price (₹)</th>
                  </tr>
                </thead>
                <tbody className="text-gray-600 text-sm font-light">
                  {products.map(p => (
                    <tr key={p.id} className="border-b border-gray-200 hover:bg-gray-100">
                      <td className="py-3 px-6 text-left whitespace-nowrap">{p.name}</td>
                      <td className="py-3 px-6 text-left">{p.collection}</td>
                      <td className="py-3 px-6 text-left">{p.brand}</td>
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
