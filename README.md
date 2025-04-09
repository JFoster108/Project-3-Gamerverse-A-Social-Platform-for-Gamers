# Gamerverse
## A Social Platform for Gamers
![Gamerverse Banner](./assets/gamerverse-banner.png)
Gamerverse is a comprehensive social platform dedicated to connecting gamers across different platforms, helping them track their gaming journeys, and building a community where gaming experiences can be shared. Whether you're a casual mobile gamer, a dedicated console player, or a hardcore PC enthusiast, Gamerverse provides the tools to catalog your games, share your gaming moments, and connect with fellow gamers.
## Features
### User Profiles and Authentication
Gamerverse offers secure user authentication with personalized profiles that showcase your gaming identity:
- **Custom Profiles**: Upload an avatar, write a personalized bio, and customize your profile appearance
- **Gaming Platform Integration**: Connect your Nintendo, PlayStation, Xbox, and Steam accounts by adding your friend codes
- **Privacy Controls**: Toggle profile visibility between public and private modes
- **Secure Authentication**: JWT-based authentication system keeps your account secure
### Game Library Management
Keep track of your entire gaming collection in one place:
- **Game Status Tracking**: Categorize games as:
  - :video_game: Now Playing - Games you're currently enjoying
  - :white_check_mark: Completed - Games you've finished
  - :hourglass_flowing_sand: On Hold - Games you've paused but plan to return to
  - :x: Dropped - Games you've decided not to finish
  - :star2: Want to Play - Your gaming wishlist
- **RAWG API Integration**: Search through a database of over 500,000 games
- **Custom Game Collection**: Filter and sort your library by platform, completion status, genre, and more
- **Game Statistics**: View stats about your gaming habits and preferences
### Community and Social Features
Connect with other gamers and share your experiences:
- **Community Feed**: Browse posts from other gamers, filtered by games you're interested in
- **Rich Content Creation**: Share text updates, screenshots, and gaming achievements
- **Game Tagging**: Tag specific games in your posts to help others find content about games they're interested in
- **Interactive Engagement**: Like, comment on, and share other users' gaming experiences
- **Popular Tags**: Find trending gaming topics and popular discussions
### Beautiful Design with Dark Mode
Gamerverse features a gaming-inspired user interface that's easy on the eyes:
- **Dark Mode by Default**: Optimized for gaming aesthetics with dark themes that reduce eye strain
- **Light Mode Option**: Toggle to light mode if preferred
- **Responsive Design**: Fully functional on desktop, tablet, and mobile devices
- **Modern UI Elements**: Gradient backgrounds, card-based content, and interactive components
- **Smooth Animations**: Subtle transitions and animations enhance the user experience
## Getting Started
### Prerequisites
Before running Gamerverse, make sure you have the following installed:
- Node.js (v14 or higher)
- npm (v6 or higher)
- MongoDB (either a local instance or a MongoDB Atlas account)
- A RAWG API key (get one for free at https://rawg.io/apidocs)
### Installation and Setup
1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/gamerverse.git
   cd gamerverse
   ```
2. **Set up environment variables**
   For the client (frontend):
   ```bash
   cd client
   # Create a .env file with the following content
   VITE_API_URL=http://localhost:5000
   VITE_RAWG_API_KEY=your_rawg_api_key_here
   ```
   For the server (backend):
   ```bash
   cd server
   # Create a .env file with the following content
   PORT=5000
   MONGODB_URI=your_mongodb_uri_here
   JWT_SECRET=your_jwt_secret_here
   RAWG_API_KEY=your_rawg_api_key_here
   ```
3. **Install dependencies**
   For the client:
   ```bash
   cd client
   npm install
   ```
   For the server:
   ```bash
   cd server
   npm install
   ```
4. **Start the development servers**
   In the client directory:
   ```bash
   npm run dev
   ```
   In the server directory (in a separate terminal):
   ```bash
   npm run dev
   ```
5. **Access the application**
   Open your browser and navigate to `http://localhost:3000` to see Gamerverse in action!
## Using Gamerverse
### Creating Your Account
1. Click the "Sign Up" button in the header
2. Fill in your desired username, email, and password
3. Submit the form to create your account
4. You'll be automatically logged in and directed to your new profile
### Setting Up Your Profile
1. Navigate to your profile page
2. Click the "Edit Profile" button
3. Add a bio that tells the community about your gaming preferences
4. Add your friend codes for different gaming platforms
5. List your favorite games to showcase your gaming taste
6. Toggle profile visibility if you prefer a private profile
7. Save your changes
### Building Your Game Library
1. Click on "Game Library" in the navigation
2. Use the "Add Game" button to search for games
3. When you find a game, select it and choose the appropriate status
4. Your game will appear in your collection with the selected status
5. You can filter your library by game status, platform, or search for specific titles
6. Update a game's status as you progress (e.g., from "Want to Play" to "Now Playing" to "Completed")
### Creating Posts
1. From the home page, click the "Create Post" button
2. Write about your gaming experience
3. Optionally add an image of your gameplay or achievement
4. Tag relevant games to help others find your content
5. Submit your post to share it with the community
### Interacting with the Community
1. Browse the home feed to see posts from other gamers
2. Filter posts by game tags that interest you
3. Like posts that you enjoy
4. Leave comments to engage in discussions
5. Follow other gamers to see their updates more prominently in your feed
### Customizing Your Experience
1. Toggle between dark and light mode using the theme switch in the header
2. Adjust your notification preferences in your profile settings
3. Customize your feed to focus on specific gaming platforms or genres
## Technical Details
### Frontend Technologies
- **React**: Component-based UI library for building interactive interfaces
- **TypeScript**: Adds static typing to JavaScript for better developer experience
- **Vite**: Fast, modern build tool that significantly improves development experience
- **Tailwind CSS**: Utility-first CSS framework for rapid UI development
- **Context API**: State management for theme, authentication, and other global states
- **React Router**: Declarative routing for single-page application navigation
### Backend Technologies
- **Node.js**: JavaScript runtime for building the server
- **Express**: Web framework for Node.js
- **GraphQL**: Query language for APIs, providing efficient data fetching
- **MongoDB**: NoSQL database for storing user data, posts, and game collections
- **Mongoose**: MongoDB object modeling for Node.js
- **JWT**: JSON Web Tokens for secure authentication
### API Integrations
- **RAWG API**: Comprehensive video game database with information on over 500,000 games
- Potential future integrations with PlayStation Network, Xbox Live, and Steam APIs
## Support and Feedback
For support, questions, or feedback, please:
- Create an issue in the GitHub repository
- Contact the development team at mwelc64@yahoo.com or Omario2005x@gmail.com

## Roadmap
Upcoming features planned for Gamerverse:
- **Friends System**: Add friends and see their activity
- **Achievements**: Track in-game achievements across platforms
- **Groups**: Create and join gaming groups based on shared interests
- **Events**: Organize and join gaming sessions and tournaments
- **Direct Messaging**: Communicate privately with other users
- **Mobile App**: Native mobile applications for iOS and Android
## License
Gamerverse is licensed under the MIT License. See the LICENSE file for more information.

rawg.iorawg.io
Explore RAWG Video Games Database API • RAWG
RAWG.IO ♛ Keep all games in one profile :heavy_check_mark: See what friends are playing, and find your next great game. (106 kB)
