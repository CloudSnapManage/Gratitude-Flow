# GratitudeFlow

GratitudeFlow is a beautifully designed, modern web application that helps you cultivate a positive mindset by making daily gratitude journaling a simple and delightful habit. Reflect on your day, celebrate small wins, and build a timeline of your positive moments.

![GratitudeFlow Screenshot](https://storage.googleapis.com/studiopaas-assets/studio/bafybeig5v5b6fypr7rprkifm4v7qacgclpyryz6pv7nrlgcnwzyyho4zkm/gratitudeflow_hero.png)

## ✨ Features

- **Daily Journaling:** A clean, focused writing experience to jot down what you're grateful for.
- **Dynamic Prompts:** Choose from a list of thoughtful, predefined prompts or write your own custom question to inspire your reflection.
- **Interactive Timeline:** Browse your past entries in a beautifully organized, collapsible timeline.
- **Edit & Delete:** Easily manage your journal entries. You have full control to edit your reflections or delete entries.
- **Word Count:** Keep track of your writing with a live word count.
- **Local-First Data Storage:** All your data is stored securely in your browser's local storage. You own your data.
- **Import/Export:** Download your entire journal as a JSON file for backup, or import your data on a new device.
- **Profile Customization:** Personalize your experience by setting your username and a profile avatar.
- **Responsive Design:** A seamless experience across all your devices, from desktop to mobile.

## 🚀 Tech Stack

This project is built with a modern, robust, and scalable tech stack:

- **Framework:** [Next.js](https://nextjs.org/) (App Router)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **UI:** [React](https://reactjs.org/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **Component Library:** [ShadCN UI](https://ui.shadcn.com/)
- **Icons:** [Lucide React](https://lucide.dev/)
- **AI (Optional):** [Genkit](https://firebase.google.com/docs/genkit) for potential future generative AI features.

## 🏁 Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

- Node.js (v18 or later recommended)
- npm or yarn

### Installation

1.  Clone the repository to your local machine:
    ```sh
    git clone https://github.com/your-username/gratitudeflow.git
    ```
2.  Navigate to the project directory:
    ```sh
    cd gratitudeflow
    ```
3.  Install NPM packages:
    ```sh
    npm install
    ```

### Running the Application

To start the development server, run the following command:

```sh
npm run dev
```

Open [http://localhost:9002](http://localhost:9002) with your browser to see the result. You can start editing the main page by modifying `src/app/(app)/home/page.tsx`.

## 📂 Project Structure

The project follows the standard Next.js App Router structure with some logical organization for maintainability:

-   `src/app/`: Contains all the routes, layouts, and pages.
    -   `src/app/(app)`: Authenticated/main application routes.
    -   `src/app/(auth)`: Login and signup routes.
-   `src/components/`: Shared and reusable React components.
    -   `src/components/ui`: UI components from ShadCN.
    -   `src/components/auth`: Authentication-related components.
    -   `src/components/layout`: Layout components like the header.
-   `src/lib/`: Utility functions, Firebase configuration, and constants.
-   `src/hooks/`: Custom React hooks (e.g., `use-toast`).
-   `src/ai/`: Configuration and flows for Genkit (for AI functionality).

## 💾 Data Management

Your privacy is paramount. All journal entries are stored directly in your browser's **local storage**. This means your data stays on your device and is not sent to any server.

-   **Export:** You can back up your data at any time from the **Settings** page. This will generate a `gratitudeflow-backup.json` file.
-   **Import:** You can restore your journal from a backup file on the same page. **Note:** Importing will overwrite any existing entries in your browser.
