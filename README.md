# Chirp Play

Welcome to Chirp Play, a platform where users can share videos and thoughts (chirps), interact with content, and connect with others.

## Table of Contents
- [Introduction](#introduction)
- [Features](#features)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Running the Application](#running-the-application)
- [Usage](#usage)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)

## Introduction

Chirp Play is a Next.js based web application designed to facilitate sharing, interaction, and engagement around videos and user-generated content called "chirps". Users can register, login, upload videos, like, comment, and much more.

## Features

- **User Authentication:**
  - Register and login securely.
  - Manage user profiles.

- **Content Sharing:**
  - Upload videos and chirps (text thoughts).
  - Like and comment on videos and chirps.
  - View liked videos and watch history.

- **Search and Discovery:**
  - Search for videos and chirps.
  - Explore trending content.

- **Interaction:**
  - Like videos and chirps.
  - Comment on videos and chirps.
  - Like comments on videos.

## Getting Started

To get a local copy up and running follow these simple steps.

### Prerequisites

- Node.js and npm installed on your machine.
- MongoDB installed locally or access to a MongoDB instance.

### Installation

Clone the repository:

```bash
git clone https://github.com/itisRamzan/chirp-play.git
```
Install dependencies:
    
```bash
cd chirp-play
npm install
```

### Running the Application
Create a `.env` file in the root directory and add the following environment variables:

```bash
DB_HOST=
DB_NAME=
SESSION_SECRET=
JWT_SECRET=
NEXT_PUBLIC_CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=
RESEND_API_KEY=
```
Run the development server:

```bash
yarn run dev
```

## Usage
- Navigate to http://localhost:3000 in your browser.
- Register an account or log in if you already have one.
- Start exploring and interacting with videos and chirps.

## Contributing
`Contributions are welcome!` Please fork the repository and create a pull request for any enhancements or bug fixes.

## License
Distributed under the MIT License. See `LICENSE` for more information.

## Contact
`Mohd Ramzan Shareef` - [@itisRamzan](mailto:mail.ramzanshareef@gmail.com)