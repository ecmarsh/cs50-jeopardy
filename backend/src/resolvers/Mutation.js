const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { randomBytes } = require('crypto'); // Runs as callback
const util = require('util'); // To promisify randomBytes
const { transport, emailMarkup } = require('../mail');
const { hasPermission, isLoggedIn } = require('../utils');

const Mutations = {
  async createCategory(parent, { name, game, questionsCount = 5 }, ctx, info) {
    const category = await ctx.db.mutation.createCategory(
      {
        data: {
          game: {
            connect: {
              name: game, // Relate category with a game
            },
          },
          name,
        },
      },
      info
    );
    // Fill categories with 5 category question placeholders
    const limit = questionsCount;
    for (let i = 1; i <= limit; i++) {
      const categoryQuestion = await ctx.db.mutation.createCategoryQuestion(
        {
          data: {
            category: {
              connect: { id: category.id },
            },
            game: {
              connect: { name: game },
            },
            difficulty: i,
          },
        },
        info
      );
    }

    return category;
  },
  async createGame(parent, args, ctx, info) {
    // Validate user and permissions
    isLoggedIn(ctx.request.userId);
    hasPermission(ctx.request.user, ['ADMIN']);
    // Normalize game name
    //args.name = args.name.toLowerCase();
    // Create the game
    const game = await ctx.db.mutation.createGame(
      {
        data: {
          user: {
            connect: {
              id: ctx.request.userId,
            },
          },
          ...args,
        },
      },
      info
    );

    // Create teams for game
    for (let i = 1; i <= 2; i++) {
      await ctx.db.mutation.createTeam(
        {
          data: {
            game: {
              connect: {
                name: game.name, // Relate team with a game
              },
            },
            name: 'Team ' + i,
            score: 0,
          },
        },
        info
      );
    }

    // Create categories with category questions
    for (let i = 1; i <= 11; i++) {
      const name = i !== 11 ? `Category ${i}` : `Final Jeopardy`;
      const category = await ctx.db.mutation.createCategory(
        {
          data: {
            game: {
              connect: {
                name: game.name, // Relate category with a game
              },
            },
            name,
          },
        },
        info
      );
      // Fill categories with 5 category question placeholders
      const questionsCount = i !== 11 ? 5 : 1;
      for (let j = 1; j <= questionsCount; j++) {
        const categoryQuestion = await ctx.db.mutation.createCategoryQuestion(
          {
            data: {
              category: {
                connect: { id: category.id },
              },
              game: {
                connect: { name: game.name },
              },
              difficulty: j,
            },
          },
          info
        );
      }
    }

    // Create an empty game config
    const gameConfig = await ctx.db.mutation.createGameConfig({
      data: {
        game: {
          connect: {
            name: game.name,
          },
        },
      },
    });

    // Finally return setup game
    return game;
  },
  async createQuestion(parent, { question, answer, gameName }, ctx, info) {
    isLoggedIn(ctx.request.userId); // Validate login

    const questionMutation = await ctx.db.mutation.createQuestion(
      {
        data: {
          // Relate user and question
          user: {
            connect: {
              id: ctx.request.userId,
            },
          },
          game: {
            connect: {
              name: gameName, // Connect game @unique name
            },
          },
          question,
          answer,
        },
      },
      info
    );

    return questionMutation;
  },
  async createStudyGame(
    parent,
    { game: name, answeredQuestions, score },
    ctx,
    info
  ) {
    isLoggedIn(ctx.request.userId); // Validate login

    const studyGameMutation = await ctx.db.mutation.createStudyGame(
      {
        data: {
          // Connect user & game
          user: {
            connect: {
              id: ctx.request.userId,
            },
          },
          game: {
            connect: { name },
          },
          answeredQuestions: {
            connect: answeredQuestions,
          },
          score,
        },
      },
      info
    );

    return studyGameMutation;
  },
  async createTeam(parent, { name, score, game }, ctx, info) {
    const team = await ctx.db.mutation.createTeam(
      {
        data: {
          game: {
            connect: {
              name: game, // Relate team with a game
            },
          },
          name,
          score,
        },
      },
      info
    );
    return team;
  },
  async deleteGame(parent, args, ctx, info) {
    // Find game to delete
    const where = { name: args.name };
    const game = await ctx.db.query.game(
      { where },
      `{ id categories { id } teams { id } questions { id } user {id} }`
    );
    if (!game) {
      throw new Error(`Something went wrong with deleting that game!`);
    }
    if (game.user.id !== ctx.request.userId) {
      throw new Error(`You must be the game owner to delete this game`);
    }
    // Delete any saved study games
    const deleteStudyGames = await ctx.db.mutation.deleteManyStudyGames({
      where: { game: where },
    });
    // Delete related teams if any
    const deleteTeams = await ctx.db.mutation.deleteManyTeams({
      where: { game: where },
    });
    // Delete loaded questions if any
    const deleteCategoryQuestions = await ctx.db.mutation.deleteManyCategoryQuestions(
      {
        where: { game: where },
      }
    );
    // Delete related categories if any
    const deleteCategories = await ctx.db.mutation.deleteManyCategories({
      where: { game: where },
    });
    // Delete related category questions if any
    const deleteQuestions = await ctx.db.mutation.deleteManyQuestions({
      where: { game: where },
    });
    // Delete any game configs
    const deleteConfigs = await ctx.db.mutation.deleteManyGameConfigs({
      where: { game: where },
    });
    // Finally delete the game
    return ctx.db.mutation.deleteGame({ where }, info);
  },
  async deleteQuestion(parent, args, ctx, info) {
    // Find question to delete
    const where = { id: args.id };
    const question = await ctx.db.query.question(
      { where },
      `{ id categoryQuestions { id } }`
    );
    if (!question) {
      throw new Error(`Can't seem to find that question`);
    }
    // Delete the question
    return ctx.db.mutation.deleteQuestion({ where }, info);
  },
  async deleteStudyGame(parent, { id }, ctx, info) {
    // Validate user exists
    isLoggedIn(ctx.request.userId);
    // Find study game to delete
    const where = { id };
    const studyGame = await ctx.db.query.studyGame(
      { where },
      `{ id user {id} }`
    );
    if (!studyGame) {
      throw new Error(`Something went wrong with deleting saved game`);
    }
    // Ensure deleter is also owner
    if (studyGame.user.id !== ctx.request.userId) {
      throw new Error('You must be the player to delete this game!');
    }
    // Delete it and return mutation payload
    return ctx.db.mutation.deleteStudyGame({ where }, info);
  },
  async publishGame(parent, { game: name, isPublic = true }, ctx, info) {
    // Ensure game name is a match
    const game = await ctx.db.query.game({ where: { name } }, `{ id }`);
    if (!game) {
      throw new Error(`No match for that game name!`);
    }

    // If unpublishing, delete any any study games
    // So any saved review games don't have null pointers
    if (!isPublic) {
      const deleteStudyGames = await ctx.db.mutation.deleteManyStudyGames({
        where: { game: { name } },
      });
    }

    // Update isPublic -> true
    return ctx.db.mutation.updateGame(
      {
        data: { isPublic },
        where: { name },
      },
      info
    );
  },
  removeFromCategory(parent, args, ctx, info) {
    const updates = { ...args };
    delete updates.id; // Keep our original ID
    return ctx.db.mutation.updateCategoryQuestion({
      data: {
        question: {
          disconnect: true,
        },
      },
      where: {
        id: args.id,
      },
      info,
    });
  },
  async resetGame(parent, { name }, ctx, info) {
    // Validate user and permissions
    isLoggedIn(ctx.request.userId);
    hasPermission(ctx.request.user, ['ADMIN']);
    // Find game to delete
    const where = { name };
    const game = await ctx.db.query.game(
      { where },
      `{ id user {id} categories{id} categoryQuestions{id} teams{id, score} }`
    );
    if (!game) {
      throw new Error(`Something went wrong with resetting the game`);
    }
    if (game.user.id !== ctx.request.userId) {
      throw new Error(`You must be the game owner to reset.`);
    }
    // Reset game team scores to 0
    await ctx.db.mutation.updateManyTeams(
      {
        data: { score: 0 },
        where: { game: where },
      },
      info
    );
    // Reset all of the questions on the board to unanswered
    await ctx.db.mutation.updateManyCategoryQuestions(
      {
        data: { answered: false },
        where: { game: where },
      },
      info
    );
    // Game was successfully reset
    const successMessage = `Successfully reset game "${name}"`;
    return ctx.db.query.game({ where }, info);
  },
  async requestReset(parent, args, ctx, info) {
    // Validate user email
    const user = await ctx.db.query.user({ where: { email: args.email } });
    if (!user) {
      throw new Error(`No user found for email ${args.email}`);
    }

    // Set the reset token and expiry
    const randomBytesPromisified = util.promisify(randomBytes);
    const resetToken = (await randomBytesPromisified(20)).toString('hex'); // Turn returned buffer into hex string
    const resetTokenExpiry = Date.now() * 3600000; // 1 hr
    const res = await ctx.db.mutation.updateUser({
      where: { email: args.email },
      data: { ...args, resetToken, resetTokenExpiry },
    });
    // Email the reset link with reset token param
    const resetLink =
      process.env.FRONTEND_URL + `/reset?resetToken=` + resetToken;
    const mailRes = await transport.sendMail({
      from: `cs50jeopardyadmin@harvard.edu`,
      to: user.email,
      subject: `CS50 Jeopardy Password Reset Request`,
      html: emailMarkup(
        `Reset your password at <a href="${resetLink}">THIS LINK</a>`
      ),
    });

    // Return a sucess message
    const message = `Success! Check your email for a link!`;
    return { message };
  },
  async resetPassword(parent, args, ctx, info) {
    // Ensure confirmation and password match
    if (args.password !== args.confirmPassword) {
      throw new Error('Confirmation password must match');
    }
    // Validate the reset token and expiry
    const [user] = await ctx.db.query.users({
      where: {
        resetToken: args.resetToken, // match
        resetTokenExpiry_gte: Date.now() - 3600000, // time
      },
    });
    // Hash the password
    const password = await bcrypt.hash(args.password, 10);
    // Save new password to the user, then remove the reset token
    const updatedUser = await ctx.db.mutation.updateUser({
      where: { email: user.email },
      data: {
        password,
        resetToken: null,
        resetTokenExpiry: null,
      },
    });
    if (!updatedUser) {
      throw new Error('Something went wrong with reset');
    }
    // Generate the JSON Web Token
    const token = jwt.sign(
      {
        userId: updatedUser.id,
      },
      process.env.APP_SECRET
    );
    // Set the cookie
    ctx.response.cookie('token', token, {
      httpOnly: true, // don't allow javascript to access cookies
      maxAge: 1000 * 60 * 60 * 24 * 365, // 1 year
    });
    // Return the user
    return user;
  },
  async signin(parent, { email, password }, ctx, info) {
    // Ensure there is a user associated with the email
    const user = await ctx.db.query.user({ where: { email } });
    if (!user) {
      throw new Error(`No user found for email ${email}`);
    }
    // Validate user password
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      throw new Error(`Password incorrect`);
    }
    // Generate JSON Web Token
    const token = jwt.sign({ userId: user.id }, process.env.APP_SECRET);
    // 4. Set cookie with that token
    ctx.response.cookie('token', token, {
      httpOnly: true, // Don't allow javascript to access cookies
      maxAge: 1000 * 60 * 60 * 24 * 365, // 1 year
    });
    // Return the user
    return user;
  },
  signout(parent, args, ctx, info) {
    ctx.response.clearCookie('token');
    return { message: 'Successful sign out!' };
  },
  async signup(parent, args, ctx, info) {
    // Normalize email to lowercase
    args.email = args.email.toLowerCase();
    // Hash the password
    const password = await bcrypt.hash(args.password, 10);
    // Define and store permissions level
    const set = args.access === 'moderator' ? ['ADMIN', 'USER'] : ['USER'];
    delete args.access;
    // Create the user in database
    const user = await ctx.db.mutation.createUser(
      {
        data: {
          ...args,
          password, // Override password with hashed password
          permissions: { set }, // Set initial access with basic user permissions
        },
      },
      info
    );

    // Create the token
    const token = jwt.sign({ userId: user.id }, process.env.APP_SECRET);
    // Assign a JSON Web token as cookie
    ctx.response.cookie('token', token, {
      httpOnly: true, // Forbid Javascript access to cookies
      maxAge: 1000 * 60 * 60 * 24 * 365, // = 1 Year
    });
    // Return the user
    return user;
  },
  updateCategoryQuestion(parent, args, ctx, info) {
    const updates = { ...args };
    delete updates.id; // Keep our original ID
    return ctx.db.mutation.updateCategoryQuestion({
      data: {
        question: {
          connect: { id: args.questionId },
        },
      },
      where: {
        id: args.id,
      },
      info,
    });
  },
  updateCategory(parent, args, ctx, info) {
    const updates = { ...args };
    delete updates.id; // Keep our original ID
    return ctx.db.mutation.updateCategory(
      {
        data: updates,
        where: {
          id: args.id,
        },
      },
      info
    );
  },
  updateGameConfig(parent, args, ctx, info) {
    const updates = { ...args };
    delete updates.id; // Keep our original ID
    return ctx.db.mutation.updateGameConfig(
      {
        data: updates,
        where: {
          id: args.id,
        },
      },
      info
    );
  },
  async updateDoubleJeopardy(
    parent,
    { gameName, hasDoubleJeopardy },
    ctx,
    info
  ) {
    // Clears any previously set double jeopardy questions
    const clearDoubleJeopardy = async () => {
      // Get any double jeopardy questions
      const doubleJeopardyQuestions = await ctx.db.query.categoryQuestions(
        {
          where: {
            game: { name: gameName },
            isDouble: true,
          },
        },
        `{ id }`
      );
      // Reset those questions to false
      if (doubleJeopardyQuestions.length) {
        for (let question of doubleJeopardyQuestions) {
          ctx.db.mutation.updateCategoryQuestion(
            {
              data: { isDouble: false },
              where: { id: question.id },
            },
            info
          );
        }
      }
      return;
    };
    // If double jeopardy questions enabled
    // Set random double price in each round
    if (hasDoubleJeopardy) {
      // Reset all questions to not double
      const res = await clearDoubleJeopardy();
      // Choose a random index
      const questionsInRound = 24; // starting from 0
      function chooseRandom() {
        return Math.ceil(Math.random() * questionsInRound);
      }
      // Store single round and double round index
      let indexes = [chooseRandom(), chooseRandom() + questionsInRound];

      // Generate random indexes until 3 unique
      while (indexes.length < 3) {
        indexes.push(chooseRandom() + questionsInRound);
        indexes = [...new Set(indexes)];
      }

      // Get arrays of category questions in each round
      const allQuestions = await ctx.db.query.categoryQuestions(
        {
          where: {
            game: { name: gameName },
          },
        },
        `{ id }`
      );
      // Set question in each round to double
      let updatedQuestions = [];
      indexes.forEach(i => {
        const updatedQuestion = ctx.db.mutation.updateCategoryQuestion(
          {
            data: { isDouble: true },
            where: { id: allQuestions[i].id },
          },
          `{ id category { id } }`
        );
        updatedQuestions.push(updatedQuestion);
      });
      return updatedQuestions;
    } else {
      // Just clear out any double jeopardy questions
      await clearDoubleJeopardy();
      return [];
    }
  },
  async updatePermissions(parent, args, ctx, info) {
    // Ensure user logged in
    isLoggedIn(ctx.request.userId);
    // Get the current user
    const currentUser = await ctx.db.query.user(
      {
        where: {
          id: ctx.request.userId,
        },
      },
      info
    );
    // Can current user update
    hasPermission(currentUser, ['ADMIN', 'PERMISSIONUPDATE']);
    // OK, update target users permissions
    return ctx.db.mutation.updateUser(
      {
        data: {
          permissions: {
            set: args.permissions,
          },
        },
        where: {
          id: args.userId,
        },
      },
      info
    );
  },
  updateQuestion(parent, args, ctx, info) {
    // Store copy of updates
    const updates = { ...args };
    // Remove the ID from the updates
    delete updates.id;
    // Invoke update method
    return ctx.db.mutation.updateQuestion(
      {
        data: updates,
        where: {
          id: args.id,
        },
      },
      info
    );
  },
  updateTeam(parent, args, ctx, info) {
    const updates = { ...args };
    delete updates.id; // Keep our original ID
    return ctx.db.mutation.updateTeam(
      {
        data: updates,
        where: {
          id: args.id,
        },
      },
      info
    );
  },
  updateTeamScore(parent, { id, score }, ctx, info) {
    return ctx.db.mutation.updateTeam(
      {
        data: { score },
        where: { id },
      },
      info
    );
  },
  updateAnsweredQuestion(parent, { id, answered = false }, ctx, info) {
    return ctx.db.mutation.updateCategoryQuestion(
      {
        data: { answered },
        where: { id },
      },
      info
    );
  },
};

module.exports = Mutations;
