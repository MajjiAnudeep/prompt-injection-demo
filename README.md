# Prompt Injection Demo

A hands-on demonstration of prompt injection attacks and mitigations in an AI-integrated application, built with Spring Boot, React, and Google Gemini via Spring AI.

## What is Prompt Injection?

Modern applications increasingly use AI models to automate decisions such as ticket triage, content classification, and data extraction. When user-supplied content is passed to an AI model without proper safeguards, it becomes possible to manipulate the model's behaviour through carefully crafted input. This is prompt injection.

It is not a niche research concern. It is listed in the OWASP Top 10 for LLM Applications and is relevant to any application that integrates AI with user-supplied content. The name is deliberate: it is conceptually the same class of problem as SQL injection, except it targets the AI's instruction pipeline rather than a database query.

## What the App Does

The application simulates an AI-assisted bug ticket triage system. Bug reports are submitted via a form and automatically classified by the AI into a severity level and a responsible team.

It has four tabs:

| Tab | What it shows |
|---|---|
| Chat Integration | A basic Spring AI and Gemini chat integration with conversation memory |
| Vulnerable Triage | Bug ticket submission with no guardrails — injected instructions succeed |
| Guarded Triage | The same triage system hardened with four layers of defence |
| Ticket History | All submitted tickets with filtering, sorting, and deletion |

For the full walkthrough including attack examples, guardrail explanations, and bypass attempts, see the [backend README](./prompt-injection/README.md).

## Repository Structure

```
prompt-injection-demo/
├── prompt-injection/       # Spring Boot backend — all AI logic, guardrails, and data
└── prompt-injection-ui/    # React frontend — visual interface only
```

The backend is where all the meaningful logic lives. The frontend is a visual layer to make the demo accessible without needing API tools like curl or Postman.

## Tech Stack

| Layer | Technology |
|---|---|
| Backend | Java 17, Spring Boot 3, Spring AI |
| AI Model | Google Gemini |
| Database | PostgreSQL |
| Frontend | React 18, Vite, Material UI |

## Prerequisites

Before running anything, make sure you have the following installed:

**Java 17**
```bash
java -version
```
The output should show version 17 or higher. If not, download it from [adoptium.net](https://adoptium.net).

**Node.js 18 or higher**
```bash
node -version
```
If not installed, download it from [nodejs.org](https://nodejs.org).

**PostgreSQL**
A running PostgreSQL instance is required. The application will create its own tables on first run via JPA. You just need an existing database and a user with access to it.

**Gemini API Key**
Get a free API key from [Google AI Studio](https://aistudio.google.com/app/apikey).

## Running the Application

### Step 1 — Start the backend

Navigate to the backend directory:
```bash
cd prompt-injection
```

Set the required environment variables. The application will not start without these.

On Linux or Mac:
```bash
export DB_HOST=jdbc:postgresql://localhost:5432/your_database
export DB_USERNAME=your_db_user
export DB_PASSWORD=your_db_password
export GEMINI_API_KEY=your_gemini_api_key
```

On Windows:
```cmd
set DB_HOST=jdbc:postgresql://localhost:5432/your_database
set DB_USERNAME=your_db_user
set DB_PASSWORD=your_db_password
set GEMINI_API_KEY=your_gemini_api_key
```

Start the application:

On Linux or Mac:
```bash
./gradlew bootRun
```

On Windows:
```cmd
gradlew.bat bootRun
```

The backend starts on `http://localhost:8081`. Wait until you see the Spring Boot startup log before moving to the next step.

### Step 2 — Start the frontend

Open a new terminal window and navigate to the frontend directory:
```bash
cd prompt-injection-ui
```

Install dependencies (only needed on first run or after pulling changes):
```bash
npm install
```

Start the development server:
```bash
npm run dev
```

The frontend starts on `http://localhost:3000`.

### Step 3 — Open the app

Go to `http://localhost:3000` in your browser. Enter any name on the login screen to begin. The name is used as your session identifier and as the reporter name on submitted tickets. There is no real authentication.

## Project Documentation

| File | Description |
|---|---|
| [prompt-injection/README.md](./prompt-injection/README.md) | Full guide covering concepts, the demo walkthrough, guardrail details, and bypass examples |
| [prompt-injection-ui/README.md](./prompt-injection-ui/README.md) | Frontend setup and structure |

## Important Note on This Demo

This application is intentionally minimal. It does not include resilience patterns, rate limiting, fallback behaviour, API key rotation, or observability. These are standard requirements for a production AI integration but are stripped out here to keep the focus on the injection concepts.

*Intended for educational use. Built with Spring Boot, React, and Gemini via Spring AI.*