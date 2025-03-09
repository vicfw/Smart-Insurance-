# Smart Insurance Application Portal

## Introduction
This is a Next.js-based Smart Insurance Application Portal that allows users to apply for different types of insurance dynamically. The form structures are fetched from an API, making the system fully dynamic. Users can submit applications and manage them in a customizable list view.

## Features
### ✅ Smart Dynamic Forms
- Fetches form structures from an API (no hardcoded forms).
- Implements conditional fields based on user input.
- Supports nested sections (e.g., Address, Vehicle Details).
- Dynamically fetches options for fields (e.g., states based on selected country).
- Validates form data before submission.

### ✅ Customizable List View
- Displays submitted applications in a dynamic table.
- Allows users to select which columns to display.
- Supports sorting, searching, and pagination.

### ✅ API Integration
- Fetches dynamic form structures from `/api/insurance/forms`.
- Submits forms via `/api/insurance/forms/submit`.
- Retrieves submitted applications from `/api/insurance/forms/submissions`.

## Tech Stack
- **Next.js 14** - React framework for SSR and API routes.
- **TanStack Query** - Efficient data fetching and caching.
- **Next-Intl** - Internationalization for multi-language support.
- **Tailwind CSS** - For styling and responsiveness.
- **React Hook Form** - Form handling and validation.

## Installation & Setup
### Prerequisites
- Node.js (>= 16)
- npm or yarn

### Steps
1. Clone the repository:
   ```sh
   git clone https://github.com/yourusername/smart-insurance-portal.git
   cd smart-insurance-portal
   ```
2. Install dependencies:
   ```sh
   npm install  # or yarn install
   ```
3. Run the development server:
   ```sh
   npm run dev  # or yarn dev
   ```
5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## API Endpoints
| Method | Endpoint | Description |
|--------|---------|-------------|
| GET | `/api/insurance/forms` | Fetches dynamic form structure |
| POST | `/api/insurance/forms/submit` | Submits a completed form |
| GET | `/api/insurance/forms/submissions` | Fetches submitted applications |

## Assumptions
- The API provides a well-structured JSON response for forms and submissions.
- The form structure can change dynamically, and the UI adapts accordingly.
- Users can filter and sort applications based on API capabilities.

## Bonus Features Implemented
- ✅ Localization support with **Next-Intl**
- ✅ Dark Mode toggle using **Tailwind CSS**
- ✅ Autosave draft before form submission

## Deployment
This application can be deployed on **Vercel**:
1. Install Vercel CLI:
   ```sh
   npm install -g vercel
   ```
2. Deploy the project:
   ```sh
   vercel
   ```

## Testing
Unit tests are written using **Jest** and **React Testing Library**.
Run tests with:
```sh
npm run test  # or yarn test
```

## License
This project is licensed under the MIT License.

## Author
Developed by Farid Bigham(https://github.com/vicfw).

