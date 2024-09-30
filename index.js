import fetch from 'node-fetch';
import xlsx from 'xlsx'
// Keywords and Brands
const searchTerms = [
  'liver king',
  'ancestral supplements',
  'heart of the canine',
  'heart and soil',
  'the fittest',
  'god brew'
];

const infringementBrands = [
  'Pure Encapsulations',
  'PURE HEALTH RESEARCH',
  '1 Body',
  'Gaia Herbs',
  'Wholesome Wellness',
  'Hepagard',
  'THORNE',
  'Double Wood Supplements',
  'LES Labs',
  'Perfect Supplements',
  'Rejuvica Health',
  'Clean Nutraceuticals',
  'Jigsaw Health',
  'Dr. Berg Nutritionals',
  'Integrative Therapeutics',
  'Nature Made',
  'SASCHA FITNESS',
  'Paleovalley',
  'Carlyle',
  'RLC Labs',
  'ForestLeaf',
  'ZHOU',
  'Wellpath'
];

// Function to fetch product data
async function fetchProductData(keyword) {
  const url = `https://axesso-axesso-amazon-data-service-v1.p.rapidapi.com/amz/amazon-search-by-keyword-asin?domainCode=com&keyword=${encodeURIComponent(keyword)}&page=1&excludeSponsored=false&sortBy=relevanceblender&withCache=true`;

  const options = {
      method: 'GET',
      headers: {
          'x-rapidapi-key': 'c542ba90c7mshaa7bec63170ae45p1d7772jsn1701fe6229d0', // Replace with your API key
          'x-rapidapi-host': 'axesso-axesso-amazon-data-service-v1.p.rapidapi.com'
      }
  };

  try {
      const response = await fetch(url, options);
      const result = await response.json(); // Assuming the response is in JSON format
      return result.data || []; // Adjust according to the API response structure
  } catch (error) {
      console.error(`Error fetching data for "${keyword}":`, error);
      return [];
  }
}

// Function to create spreadsheet
async function createSpreadsheet() {
  const productsData = [];

  // Fetch data for each search term
  for (const term of searchTerms) {
      const products = await fetchProductData(term);
      products.forEach(product => {
          productsData.push({
              productName: product.title || 'N/A',
              productDescription: product.description || 'N/A',
              companyName: product.manufacturer || 'N/A',
              companyAddress: product.companyAddress || 'N/A', // Adjust if available
              productLink: product.productUrl || 'N/A', // Replace with actual URL field
              infringementLink: `URL for possible infringement for ${term}` // Placeholder
          });
      });
  }

  // Fetch infringement data for specified brands
  for (const brand of infringementBrands) {
      const products = await fetchProductData(brand);
      products.forEach(product => {
          productsData.push({
              productName: product.title || 'N/A',
              productDescription: product.description || 'N/A',
              companyName: product.manufacturer || 'N/A',
              companyAddress: product.companyAddress || 'N/A', // Adjust if available
              productLink: product.productUrl || 'N/A', // Replace with actual URL field
              infringementLink: `URL for possible infringement for ${brand}` // Placeholder
          });
      });
  }

  // Create a new workbook and add the data
  const wb = xlsx.utils.book_new();
  const ws = xlsx.utils.json_to_sheet(productsData);
  xlsx.utils.book_append_sheet(wb, ws, 'Product Data');

  // Save the workbook to a file
  xlsx.writeFile(wb, 'product_data.xlsx');
}

// Execute the main function to create the spreadsheet
createSpreadsheet();