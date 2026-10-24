# Donuts for You — Frontend

The React and TypeScript storefront for **Donuts for You**, a full-stack donut shop. Browse the catalog, manage a cart, place orders, and access member or admin features.

**Live site:** [dountstime.netlify.app](https://dountstime.netlify.app/)

**Demo accounts:**
- **Admin:** Username: `admin` · Password: `admin`
- **User:** Username: `sha` · Password: `shasha`

> The API runs on Render and may take a few seconds to respond after a period of inactivity.

## Product demos

### Buying Donuts

![A demo of browsing and buying donuts](./assets/BuyingDemoDonuts.gif)

Users can:
- Browse the donut catalog and view product details, including prices, ingredients, and calories.
- Add and remove donuts from a persistent shopping cart.
- Register for an account, sign in, and sign out.
- Receive an automated email after registering a new account.
- Complete checkout and review order summaries.
- Earn and view rewards points, access coupons, and review purchase history.

### Admin Management

![A demo of an admin updating a donut's price](./assets/AdminDemoDonuts.gif)

Admins can:
- Update donut prices and manage product information.
- Manage the donut catalog through dedicated admin pages.
- Access user management tools to manage registered accounts.
## Built with

React 18, TypeScript, React Router, Axios, Bootstrap, and CSS. The project was bootstrapped with Create React App.

## Run locally

Requirements: Node.js and npm.

```bash
npm install
npm start
```

The development server opens at `http://localhost:3000`. The backend and MySQL database must also be configured and running for API-backed features. See the [backend README](https://github.com/shalevp-1/Donuts_Backend) for setup instructions.

Create a production build with:

```bash
npm run build
```

## Deployment

The frontend is deployed on Netlify. In production, Netlify routes `/api/*` requests to the backend; see the backend README for the API and deployment configuration.
