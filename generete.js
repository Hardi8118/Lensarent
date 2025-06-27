const fs = require("fs");
const path = require("path");

// Path folder gambar
const imagesFolder = path.join(__dirname, "assets/camera");
const outputFile = path.join(__dirname, "screens/imageMapping.js");

const files = fs.readdirSync(imagesFolder);

// Buat objek mapping
const imageMapping = files.reduce((acc, file) => {
  const fileName = file; // Nama file seperti 'image1.png'
  acc[fileName] = `require('../assets/camera/${fileName}')`;
  return acc;
}, {});

// Buat file output mapping
const outputContent = `
export const images = {
${Object.entries(imageMapping)
  .map(([key, value]) => `  '${key}': ${value}`)
  .join(",\n")}
};
`;

fs.writeFileSync(outputFile, outputContent);

console.log("Image mapping file created at:", outputFile);
