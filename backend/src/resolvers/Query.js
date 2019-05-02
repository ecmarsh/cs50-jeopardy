const { forwardTo } = require('prisma-binding');
const { hasPermission, isLoggedIn } = require('../utils');

const Query = {
  category: forwardTo('db'),
  categoryQuestion: forwardTo('db'),
  categoryQuestions: forwardTo('db'),
  categoryQuestionsConnection: forwardTo('db'),
  categories: forwardTo('db'),
  categoriesConnection: forwardTo('db'),
  games: forwardTo('db'),
  question: forwardTo('db'),
  questions: forwardTo('db'),
  questionsConnection: forwardTo('db'),
  studyGame: forwardTo('db'),
  teams: forwardTo('db'),
  me(parent, args, ctx, info) {
    // Check for current user ID
    if (!ctx.request.userId) {
      return null;
    }
    // If there's a user, return the user
    return ctx.db.query.user(
      {
        where: { id: ctx.request.userId },
      },
      info
    );
  },
  async users(parent, args, ctx, info) {
    // Ensure user is logged in
    isLoggedIn(ctx.request.userId);
    // Ensure user has permissions to edit permissions
    hasPermission(ctx.request.user, ['ADMIN', 'PERMISSIONUPDATE']);
    // Return the users
    return ctx.db.query.users({}, info);
  },
  async game(parent, args, ctx, info) {
    // Ensure user is logged in
    isLoggedIn(ctx.request.userId);
    // Ensure user is the creator of the game
    const gameInfo = await ctx.db.query.game(
      { where: { name: args.name } },
      `{ user { id } isPublic }`
    );
    if (gameInfo.user.id !== ctx.request.userId && !gameInfo.isPublic) {
      throw new Error('You must be the game owner to do this');
    }
    // Return the game information
    return ctx.db.query.game(
      {
        where: { name: args.name },
      },
      info
    );
  },
  async myGames(parent, args, ctx, info) {
    // Ensure user is logged in and permissions
    isLoggedIn(ctx.request.userId);
    hasPermission(ctx.request.user, ['USER']);
    // Return all of the users
    return ctx.db.query.games(
      { where: { user: { id: ctx.request.userId } } },
      info
    );
  },
  async studyGames(parent, args, ctx, info) {
    // Ensure user is logged in and permissions
    isLoggedIn(ctx.request.userId);
    hasPermission(ctx.request.user, ['USER']);
    // Return all of the users
    return ctx.db.query.studyGames(
      { where: { user: { id: ctx.request.userId } } },
      info
    );
  },
};

module.exports = Query;
