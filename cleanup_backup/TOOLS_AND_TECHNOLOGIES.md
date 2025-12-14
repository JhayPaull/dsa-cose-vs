## Tools and Technologies Used

### Front-end
- **HTML, CSS, JavaScript**: Build the responsive user interface (landing page, dashboard, voting screens).
- **Firebase Web SDK (JavaScript)**: Client-side authentication, Firestore access, and analytics.

### Back-end
- **Node.js (JavaScript runtime)**: Runs the main API server (`backend/server.js`).
- **Express.js (Node.js framework)**: Defines REST APIs for authentication, dashboard, analytics, notifications, and voting.
- **Python / PHP (optional extensions)**: Can be used for data analysis scripts or legacy integrations if needed (e.g., exporting results, batch processing).

### Database and Authentication
- **Firebase Firestore**: Primary data storage for users, elections, candidates, votes, and notifications.
- **Firebase Authentication**: Secure email/password login for voters and administrators.
- **MySQL (optional)**: Can be used for reporting or integration with existing school information systems.

### Development & Design Tools
- **Figma**: UI/UX design prototypes for the web interface (layouts, color schemes, components).
- **Visual Studio Code (VS Code)**: Main IDE for front-end and back-end development.
- **Git & GitHub**: Version control and collaboration.

### Infrastructure & Deployment
- **Docker**: Containerizes the Node.js backend (and optional services like MySQL) for consistent deployment.
- **Firebase Hosting**: Hosts the front-end (HTML/CSS/JS) on `https://dsa-cose-vs.web.app`.
- **Firebase Cloud Functions / Node backend**: Can be deployed to handle server-side logic close to the data.

This stack ensures a modern, scalable, and maintainable e-voting system that can be run locally with Docker and deployed to the cloud using Firebase and Node.js.


