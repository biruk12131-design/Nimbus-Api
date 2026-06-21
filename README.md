
---

### 📄  Nimbus API (AWS Serverless API)

```markdown
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

src/
├── middleware/
│   ├── auth.ts
│   ├── errorHandler.ts
│   ├── logger.ts
│   ├── rateLimiter.ts
│   └── validate.ts
├── routes/
│   ├── auth.ts
│   └── books.ts
├── models/
│   └── Book.ts
├── data/
│   └── seed.ts
├── swagger/
│   └── openapi.json
├── index.ts
└── serverless.ts


## 🚦 Getting Started
```bash
git clone https://github.com/biruk12131-design/Nimbus-Api
cd nimbus-api
npm install
npm run dev

API runs at http://localhost:3000.

📸 Screenshot

Copilot_20260621_030349

📜 License

MIT License.
