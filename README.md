# Nimbus API

![Node.js](https://img.shields.io/badge/Node.js-20-green?logo=node.js)
![Express](https://img.shields.io/badge/Express-4-lightgrey?logo=express)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)
![AWS Lambda](https://img.shields.io/badge/AWS_Lambda-ready-orange?logo=amazon-aws)
![JWT](https://img.shields.io/badge/JWT-auth-black?logo=json-web-tokens)
![Swagger](https://img.shields.io/badge/Swagger-docs-brightgreen?logo=swagger)

A cloud‑native, serverless‑ready REST API for a digital bookstore. Built with Node.js, Express, and TypeScript, featuring JWT authentication, role‑based access, advanced filtering, pagination, ETag support, HATEOAS links, Swagger documentation, and comprehensive middleware.

## 🚀 Live Demo
[https://nimbus-api-z723.onrender.com/](https://nimbus-api-z723.onrender.com/) (Base URL)

## 📚 API Documentation
Interactive Swagger UI: [https://nimbus-api.onrender.com/api-docs](https://nimbus-api.onrender.com/api-docs)

## ✨ Features
- **JWT Authentication** – Register, Login, Protected Routes.
- **Role‑Based Access** – Admin vs Regular users.
- **Book CRUD** – Full create, read, update, delete with Zod validation.
- **Advanced Querying** – Filter, search, sort, and paginate.
- **HATEOAS Links** – Pagination includes next, prev, first, last links.
- **Conditional Requests** – ETag support for caching.
- **Response Compression** – gzip compression.
- **Rate Limiting** – 100 requests per 15 min, with headers.
- **Request Tracing** – Unique X‑Request‑ID per request.
- **Webhook Simulation** – POST /api/v1/webhooks/book-published.
- **Order Processing** – Mock order creation and listing.
- **Admin Metrics** – Aggregate statistics endpoint.
- **Health Check** – GET /health with uptime.
- **Gzip Compression** – All responses over 1KB compressed.
- **ETag Support** – 304 Not Modified for efficient caching.
- **Swagger Docs** – Interactive API documentation.
- **Logging & Error Handling** – Consistent JSON errors, response time logging.

## 🛠 Tech Stack
- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript (strict)
- **Authentication**: jsonwebtoken, bcryptjs
- **Validation**: Zod
- **Documentation**: swagger-ui-express, openapi.json
- **Serverless**: serverless-http (AWS Lambda ready)
- **Deployment**: Render

## 📁 Project Structure


```
Freelancer-pro-hub/
├── src/
│   ├── components/               # Reusable components
│   │   ├── ui/                   # Base UI components
│   │   │   ├── button.tsx        # Styled button component
│   │   │   ├── card.tsx          # Card container component
│   │   │   ├── input.tsx         # Form input component
│   │   │   ├── modal.tsx         # Modal dialog component
│   │   │   └── skeleton.tsx      # Loading skeleton component
│   │   ├── charts/               # Chart components
│   │   │   ├── MonthlyEarningsChart.tsx  # Line chart for earnings
│   │   │   └── WeeklyHoursChart.tsx      # Bar chart for hours
│   │   ├── dashboard/            # Dashboard-specific components
│   │   │   ├── StatsDisplay.tsx  # KPI cards display
│   │   │   └── RecentActivity.tsx # Activity feed
│   │   ├── Header.tsx            # Top navigation header
│   │   ├── Layout.tsx            # Main layout wrapper
│   │   └── Sidebar.tsx           # Navigation sidebar
│   ├── pages/                    # Page components
│   │   ├── Dashboard.tsx         # Main dashboard view
│   │   ├── Clients.tsx           # Client management page
│   │   ├── Projects.tsx          # Project tracking page
│   │   ├── Invoices.tsx          # Invoice management page
│   │   ├── TimeTracking.tsx      # Time tracking page
│   │   └── Settings.tsx          # Settings/profile page
│   ├── contexts/                 # React Context providers
│   │   ├── ThemeContext.tsx      # Dark/light mode context
│   │   ├── ToastContext.tsx      # Toast notification context
│   │   └── DataStoreContext.tsx  # Global data management context
│   ├── lib/                      # Utility functions & helpers
│   │   ├── mockData.ts           # Static mock data for all features
│   │   ├── csvUtils.ts           # CSV export utilities
│   │   ├── pdfUtils.ts           # PDF export utilities
│   │   └── utils.ts              # General utility functions
│   ├── App.tsx                   # Main app component
│   ├── main.tsx                  # Application entry point
│   └── index.css                 # Global styles
├── public/                       # Static assets
├── .env.example                  # Environment variables template
├── index.html                    # HTML entry point
├── package.json                  # Dependencies & scripts
├── tsconfig.json                 # TypeScript configuration
├── vite.config.ts                # Vite configuration
└── metadata.json                 # Project metadata
```


## 🚦 Getting Started
```bash
git clone https://github.com/birukdev12-senior/nimbus-api.git
cd nimbus-api
npm install
npm run dev


📸 Screenshot

![nimbus api](https://copilot.microsoft.com/th/id/BCO.24e74dee-7b17-416f-b28c-cf0124ed9056.png).

📜 License

MIT License.


