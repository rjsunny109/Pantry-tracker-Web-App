# Pantry Manager

Pantry Manager is a modern, user-friendly web application designed to help you keep track of your pantry inventory. Built with React and Firebase, this app offers a seamless experience for managing your food items, tracking expiration dates, and maintaining optimal stock levels.

## Features

- Add Items: Easily add new items to your pantry inventory
- Update Quantities: Quickly update item quantities as you use or restock
- Expiration Tracking: Keep track of expiration dates to reduce food waste
- Categories: Organize your pantry items into customizable categories
- Search Functionality: Quickly find items in your inventory
- User Authentication: Secure login to protect your pantry data

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- npm or yarn

### Installation

1. Clone the repository:
   - git clone https://github.com/rjsunny109/Pantry-tracker-Web-App.git
2. Navigate to the project directory:
   - cd Pantry-tracker-Web-App
3. Install dependencies:
   - npm install
or if you're using yarn:
  - yarn install

4. Set up your Firebase configuration:
Create a `.env.local` file in the root directory and add your Firebase config:
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id

5. Start the development server:
- npm rundev
or with yarn:
- yarn dev
6. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Deployment

This project is set up to be easily deployed on Vercel. Follow these steps:

1. Push your code to a GitHub repository.
2. Go to [Vercel](https://vercel.com) and sign up or log in.
3. Click "New Project" and import your GitHub repository.
4. Configure your environment variables in the Vercel dashboard.
5. Deploy!

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License.

## Acknowledgments

- Thanks to all contributors who have helped shape Pantry Manager.
- Special thanks to the React and Firebase communities for their excellent documentation and support.
