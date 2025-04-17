# Favicon Implementation Instructions

## 1. Unzip the favicon package

```bash
# Navigate to where the favicon_io.zip is located and unzip it
cd /path/to/favicon_io.zip
unzip favicon_io.zip -d temp_favicon
```

## 2. Create the necessary directories and move files

```bash
# Create the public directory if it doesn't exist yet
mkdir -p /home/dotmavriq/Code/SveaVida/public

# Move the favicon files to the public directory
mv temp_favicon/favicon.ico /home/dotmavriq/Code/SveaVida/public/
mv temp_favicon/*.png /home/dotmavriq/Code/SveaVida/public/
mv temp_favicon/site.webmanifest /home/dotmavriq/Code/SveaVida/public/

# Remove the temporary directory
rm -rf temp_favicon
```

## 3. Update your index.html file to include the favicon references
```
```
