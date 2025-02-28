Pokémon Next.js App

Overview

This is a Pokémon Pokedex application built with Next.js that allows users to browse Pokémon, view their details, and navigate seamlessly between pages while preserving state.

Features

List all Pokémon with pagination.

View detailed information about a selected Pokémon, including stats, abilities, and evolution chain.

Seamless navigation with page state retention (returns to the correct page after viewing details).

Responsive UI using Tailwind CSS.

Installation & Setup

Prerequisites

Make sure you have the following installed:

Node.js (v16 or later)

npm or yarn

Steps

Clone the repository

git clone https://github.com/your-username/pokemon-nextjs.git
cd pokemon-nextjs

Install dependencies

npm install

Run the development server

npm run dev

Open the application
Open your browser and go to:

http://localhost:3000

Navigation Guide

Home (Pokédex) Page

The homepage displays a list of Pokémon with pagination.

Click on a Pokémon to view its detailed information.

Pagination allows users to navigate through pages of Pokémon.

Pokémon Detail Page

Displays image, stats, abilities, and evolution chain.

Click on an evolved form to view its details.

Click Back to Pokédex to return to the last visited page.

Preserving Navigation State

When selecting a Pokémon from a paginated list (e.g., Page 4), the Back to Pokédex button returns to the correct page instead of restarting from Page 1.

Deployment

To deploy the app on Vercel:

Install Vercel CLI (if not installed):

npm install -g vercel

Run the deployment command:

vercel

Follow the on-screen instructions to deploy.

Technologies Used

Next.js (React Framework)

Tailwind CSS (Styling)

PokéAPI (Data Fetching)

Vercel (Deployment)

Contributions

Feel free to fork this project and submit pull requests for improvements or new features!
