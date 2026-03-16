#!/bin/bash

# Ensure we are on main and up to date
git checkout main
git pull origin main

FEATURES=(
  "footer-component"
  "header-component"
  "sidebar-component"
  "theme-toggler"
  "language-switcher"
  "user-profile"
  "settings-page"
  "about-page"
  "contact-form"
  "error-page"
)

DESCRIPTIONS=(
  "Add a footer component to the application"
  "Add a header component for navigation"
  "Add a sidebar component for quick links"
  "Implement a theme toggler for dark/light mode"
  "Add a language switcher for internationalization"
  "Create a user profile component"
  "Add a settings page for user preferences"
  "Create an about page with company info"
  "Add a contact form for user inquiries"
  "Create a custom 404 error page"
)

for i in "${!FEATURES[@]}"; do
  FEATURE="${FEATURES[$i]}"
  DESC="${DESCRIPTIONS[$i]}"
  BRANCH="feature/$FEATURE"
  
  echo "Creating branch $BRANCH..."
  git checkout -b "$BRANCH" main
  
  # Make a change
  mkdir -p "src/components/$FEATURE"
  echo "export const ${FEATURE//-/} = () => <div>$DESC</div>;" > "src/components/$FEATURE/index.tsx"
  
  # Commit and push
  git add .
  git commit -m "feat: $DESC"
  git push -u origin "$BRANCH"
  
  # Create PR
  gh pr create --title "feat: $DESC" --body "## Summary
This PR implements the ticket: $DESC.

## Test plan
- Verify the component renders correctly.
"
  
  # Go back to main
  git checkout main
done

echo "Done creating 10 PRs."
