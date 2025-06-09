# Financial Aid Frontend

This project provides a simple authentication UI built with Next.js and Tailwind CSS.
It connects to a backend API for registration, login and password recovery.

## Setup

Create an `.env` file based on `.env.example` and set the backend URL:

```env
NEXT_PUBLIC_API_URL=http://localhost:8080
```

Install dependencies and start the development server:

```bash
pnpm install
pnpm dev
```

## Testing

Run linting and unit tests with:

```bash
pnpm lint
pnpm test
```

## Deployment

Build the project for production with `pnpm build` and deploy the generated files.
