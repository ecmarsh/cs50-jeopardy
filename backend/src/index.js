const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');

require('dotenv').config({ path: 'variables.env' });
const createServer = require('./createServer');
const db = require('./db');

const server = createServer();

// Format cookies as Objects
server.express.use(cookieParser());

// Handle cookies w/ JWT
server.express.use((req, res, next) => {
  const { token } = req.cookies;
  //console.log(token);
  if (token) {
    const { userId } = jwt.verify(token, process.env.APP_SECRET);
    // add user id onto request for future requests to access
    req.userId = userId;
  }
  next();
});

// Populate user on each request
server.express.use(async (req, res, next) => {
  if (!req.userId) {
    // Skip if not logged in
    return next();
  }
  const user = await db.query.user(
    {
      where: { id: req.userId },
    },
    '{ id, permissions, email, name }'
  );

  // Pass user with each request
  req.user = user;

  next();
});

const whitelist = [
  process.env.FRONTEND_URL,
  `${process.env.FRONTEND_URL}/`,
  `http://cs50-jeopardy-next.herokuapp.com/`,
  `http://cs50-jeopardy-next.herokuapp.com`,
  `https://cs50-jeopardy-next.herokuapp.com/`,
  `https://cs50-jeopardy-next.herokuapp.com`,
  `cs50-jeopardy-next.herokuapp.com`,
  `cs50-jeopardy-next.herokuapp.com/`,
];

// Server init
server.start(
  {
    cors: {
      // only allow access from our client
      credentials: true,
      origin: whitelist,
    },
  },
  data => {
    console.log(`Server running on port http://localhost:${data.port}`);
  }
);
