# Git Setup Instructions

Follow these commands to push your project to the feature/refactor branch:

```bash
# Add the remote repository (you only need to do this once)
git remote add origin git@github.com:dotMavriQ/SveaVida.git

# Create a new branch called feature/refactor
git checkout -b feature/refactor

# Add all your files to the staging area
git add .

# Commit your changes with a descriptive message
git commit -m "Initial project setup with React, Leaflet, and multilingual support"

# Push the new branch to the remote repository
git push -u origin feature/refactor
```

After running these commands, your code will be available in the `feature/refactor` branch on GitHub at https://github.com/dotMavriQ/SveaVida

If you want to check the status of your repository at any point, you can use:
```bash
git status
```

And to verify your remote repository is set up correctly:
```bash
git remote -v
```
