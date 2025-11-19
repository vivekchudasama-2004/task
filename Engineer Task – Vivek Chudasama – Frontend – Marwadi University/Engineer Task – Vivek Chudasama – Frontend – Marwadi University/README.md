# Purchase Order Entry Application

A React-based Purchase Order (PO) management form that handles complex data validation, dynamic form sections, and state management. It supports both Individual and Group PO types with specific business logic constraints.

---

Table of contents
- Features
- Demo
- Technologies
- Project structure
- Installation and running locally
- Usage guide
- Validation & business rules
- UX / UI notes
- Customization
- Troubleshooting
- Contributing
- License

---

## Features

- Dynamic form fields
    - Job Titles: Filtered based on the selected Client
    - Talent lists loaded dynamically based on selected Job / REQ
    - "Add Another REQ" button for Group PO types to add multiple REQ sections
- Robust validation
    - Individual PO: exactly one talent must be selected
    - Group PO: at least two talents must be selected
    - Budget: numeric input limited to 5 digits
    - Dates: End Date must be strictly after Start Date
    - Required fields are validated and show contextual errors
- UX / UI
    - Responsive layout using CSS Grid and Flexbox
    - Read-only summary view appears after successful submission
- Built with React (functional components + hooks) and plain CSS (no Bootstrap/Tailwind)

---

## Demo

This repository provides a local dev experience. To see a live demo, run the app locally (instructions below). Optionally deploy to GitHub Pages, Vercel, or Netlify.

---

## Technologies

- React (functional components)
- JavaScript (ES6+)
- CSS3 (styles.css)
- Optional: Node.js and Create React App (for bootstrapping)

---

## Project structure

src/
- App.jsx        # Main application logic & UI components (or src/App.js)
- styles.css     # Styles for the form and layout
- index.js       # React entry point
- components/    # (optional) Suggested place for form subcomponents
- utils/         # (optional) validation helpers and constants

---

## Installation and running locally

1. Ensure Node.js (>= 14) and npm are installed.

2. Bootstrap the app (if not already created):

npx create-react-app purchase-order-app
cd purchase-order-app

3. Replace `src/App.jsx` (or `src/App.js`) with the provided App component code and add `src/styles.css` with the provided styles.

4. Ensure the top of your App component imports the stylesheet:

import './styles.css';

5. Install dependencies and run:

npm install
npm start

6. Open http://localhost:3000 in your browser.

---

## Usage guide

1. Client selection
    - Start by selecting a Client. This unlocks Job Title options filtered for that Client.

2. Job / REQ
    - Select a Job Title (REQ). Talent suggestions and available roles will update based on this selection.

3. PO Type
    - Choose "Individual" or "Group".
        - Individual: Only a single talent selection allowed.
        - Group: Can add multiple talents and use "Add Another REQ" to add more REQ sections.

4. Talent allocation
    - Check the box beside a Talent to enable fields for Contract Duration and Bill Rate for that Talent.

5. Budget & Dates
    - Budget accepts only numeric values up to 5 digits.
    - Enter Start Date and End Date — End Date must be after Start Date.

6. Submission
    - Click "Submit Order". The form will validate all fields and show inline errors.
    - On success, a read-only summary view of the submission is shown.

---

## Validation & business rules (summary)

- Required fields: Client, Job/REQ, PO Type, Budget, Start Date, End Date (and at least one Talent where applicable).
- Budget: integer, 1–5 digits (0–99999).
- Dates:
    - Start Date: required
    - End Date: must be strictly after Start Date
- Talent selection:
    - Individual PO: exactly 1 talent must be selected. If more than one is selected, validation fails.
    - Group PO: must have at least 2 talents selected across the PO (if a single REQ has fewer than 2, allow adding REQs).
- Contract Duration and Bill Rate:
    - Only editable when talent checkbox is selected.
    - Bill Rate should be a valid positive number (you can tighten validation to accept decimals or integer-only).
- Add Another REQ:
    - Only visible/enabled for Group PO types.

---

## UX / Accessibility notes

- Responsive design uses CSS Grid and Flexbox; test on multiple screen sizes.
- Keyboard navigation: ensure focus states and logical tab order for form controls.
- Error messages should be readable by screen readers (use aria-live regions where appropriate).
- Consider color contrast for validation states and labels.

---

## Customization

- Styling
    - Edit `src/styles.css` to change colors, spacing, and layout.
- Data sources
    - Replace hard-coded client/job/talent lists with API calls or Redux state as needed.
- Validation rules
    - Centralize validation logic into `utils/validation.js` for easier testing and changes.

---

## Troubleshooting

- Form not loading job titles after client selection:
    - Check the client -> job mapping logic. Ensure keys match (e.g., client IDs).
- Validation prevents submission with correct values:
    - Inspect the browser console for messages; confirm the validation functions are getting the right datum types (Date objects vs strings).
- CSS not applying:
    - Ensure `import './styles.css';` exists at the top of `App.jsx` / `App.js`.

---

## Testing

- Manual testing:
    - Validate all combinations: Individual vs Group; adding REQs; budgets at boundary values (99999 and 100000).
- Automated testing:
    - Add Jest + React Testing Library tests for:
        - Validation functions
        - Form behavior for Individual vs Group flows
        - Date constraints and budget limits

---
