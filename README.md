
  # Design CareerForge AI App

  This is a code bundle for Design CareerForge AI App. The original project is available at https://www.figma.com/design/pFfoHwXVQY2SyQb4gGkGab/Design-CareerForge-AI-App.

  ## Running the code

  Run `npm i` to install the dependencies.

  Run `npm run dev` to start both the frontend development server and the backend Express server concurrently.

  ## Password reset delivery

  Copy `.env.example` to `.env`, then configure Resend for email recovery and/or Twilio for SMS recovery. Restart the development server after changing `.env`. The reset endpoint reports a configuration error when no delivery provider is available.
  
