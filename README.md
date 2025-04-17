# SveaVida - Testing Guide

## Setting Up the Development Environment

### Prerequisites
- Node.js (v14 or later)
- npm or yarn

### Initial Setup
1. Install dependencies:
   ```bash
   npm install
   # or
   yarn
   ```

2. Create a `public` folder for static assets:
   ```bash
   mkdir -p public/images
   ```

3. Copy any pin images and the favicon to the public folder:
   ```bash
   # Example:
   cp path/to/favicon.ico public/
   cp path/to/pin-images/* public/images/
   ```

## Running the Application

Start the development server:
```bash
npm run dev
# or
yarn dev
```

This will start the application on http://localhost:5173 (default Vite port).

## Testing Different Features

### 1. Data Loading
- Check the browser console to verify data is loading from JSON files
- If there are issues, ensure the JSON files are properly formatted and accessible

### 2. Map Functionality
- Verify the map centers on Portugal
- Confirm pins appear at correct coordinates
- Test clicking pins to show details

### 3. Category Filtering
- Toggle category checkboxes and verify pins update accordingly
- Test with multiple categories selected/deselected

### 4. Language Switching
- Switch between languages and verify text updates throughout the application
- Check both UI elements and pin data content

### 5. Responsive Design
- Test the application at various screen sizes
- Use browser developer tools to simulate mobile devices

## Troubleshooting

- **JSON Loading Issues**: Ensure proper CORS configuration if loading from filesystem
- **Map Display Problems**: Check if Leaflet CSS is properly loaded
- **Component Errors**: Look for detailed error messages in browser console
