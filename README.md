# ApplyWise AI

**Know how well you match a job before applying.**

ApplyWise AI is a full-stack SaaS capstone project that helps students and job seekers compare their skills with job descriptions, identify missing skills, and receive actionable improvement recommendations.

## Live Application

https://applywise-ai-gamma.vercel.app/

## Features

- Job-to-skills matching with percentage scores
- Matching and missing skill identification
- Personalized skill improvement recommendations
- Supabase email authentication
- Save, view, and delete previous analyses
- Optional Anthropic AI integration with a working rule-based fallback
- Stripe sandbox checkout for ApplyWise Pro
- Server-side Stripe checkout session verification
- Responsive interface

## Tech Stack

- Frontend: Next.js, React, Tailwind CSS
- Backend: Next.js API Routes
- Database: Supabase PostgreSQL
- Authentication: Supabase Auth
- AI: Optional Anthropic API and deterministic skill matching
- Payments: Stripe Checkout (test mode)
- Deployment: Vercel

## Getting Started

Install dependencies:

    npm install

Create a `.env.local` file with:

    NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
    NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your_supabase_publishable_key
    STRIPE_SECRET_KEY=your_stripe_test_secret_key
    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_test_publishable_key

Optional AI configuration:

    ANTHROPIC_API_KEY=your_optional_api_key
    ANTHROPIC_MODEL=your_supported_model

Run the development server:

    npm run dev

Open http://localhost:3000

## How Matching Works

1. The user enters their existing skills.
2. The user pastes a job description.
3. ApplyWise identifies supported skills using normalized skill aliases.
4. It calculates a skill-overlap percentage.
5. It highlights matching and missing skills.
6. It provides improvement recommendations.

The match percentage represents identified skill overlap, not a prediction of hiring success.

When a valid Anthropic API key is configured, the backend can request AI-enhanced recommendations. Otherwise, it automatically uses the rule-based recommendation engine.

## Database and Authentication

Supabase handles authentication and stores job analyses.

Row Level Security policies restrict users to accessing their own saved analyses.

## Payment Integration

Stripe Checkout is implemented in sandbox mode.

- Demo product: ApplyWise Pro
- Test price: MYR 9.90
- Payment type: One-time test checkout
- Payment verification: Server-side Stripe session retrieval

No real payments or premium entitlements are enabled.

## Testing

The deployed application has been manually tested for:

- Job analysis
- User signup and login
- Saving and viewing analyses
- Stripe sandbox checkout

## Project Context

Built as Project 5 of the Finlatics AI Full Stack Development Program.
