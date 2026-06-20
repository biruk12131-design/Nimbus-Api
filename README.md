<div align="center">
  <svg width="200" height="200" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="cloudGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#8ba4f9" />
        <stop offset="100%" stop-color="#4a6cf7" />
      </linearGradient>
      <linearGradient id="boltGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#fbd043" />
        <stop offset="100%" stop-color="#f59e0b" />
      </linearGradient>
    </defs>
    <!-- Cloud base -->
    <path d="M 60 110 A 30 30 0 0 1 60 50 A 40 40 0 0 1 130 40 A 35 35 0 0 1 160 100 A 30 30 0 0 1 140 150 L 50 150 A 30 30 0 0 1 60 110 Z" fill="url(#cloudGrad)" opacity="0.9"/>
    <!-- Lightning Bolt -->
    <path d="M 120 45 L 80 110 L 105 110 L 90 175 L 140 100 L 110 100 Z" fill="url(#boltGrad)" stroke="#fff" stroke-width="2"/>
  </svg>
</div>

# Nimbus API

![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![AWS Lambda](https://img.shields.io/badge/AWS_Lambda-FF9900?style=for-the-badge&logo=awslambda&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=JSON%20web%20tokens&logoColor=white)
![Swagger](https://img.shields.io/badge/Swagger-85EA2D?style=for-the-badge&logo=swagger&logoColor=black)

Cloud-native bookstore API built with Node.js, Express, and TypeScript. Features JWT auth, role-based access, advanced querying, HATEOAS pagination, ETags, webhook simulation, Swagger docs, and in-memory data. Ready for serverless deployment.

## Live URL
[Placeholder for live Render URL]

## Getting Started

1. Set up `.env` from `.env.example`
2. `npm run dev` to start locally on port 3000
3. View docs at `/api-docs`
