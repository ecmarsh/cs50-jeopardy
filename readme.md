# CS50x Final Project

## ![cs50 jeopardy icon](.github/icon.png) CS50 Jeopardy!

Website: **[https://cs50-jeopardy-next.herokuapp.com](https://cs50-jeopardy-next.herokuapp.com 'CS50 Jeopardy Homepage')**

Project Submission: [https://youtu.be/K6k2R3Vz8-0](https://youtu.be/K6k2R3Vz8-0)

Source: [github.com/ethan-marsh/cs50-jeopardy](https://github.com/ethan-marsh/cs50-jeopardy)

## Motivation

Watching DM shuffle through papers to find questions on a time crunch in front of all the parents in a **CS class**! 😂

![david finding questions](.github/motivation.gif)

## Summary

Collaborative study web app game based on the [CS50 2018 implementation of 'Jeopardy!'](https://www.youtube.com/watch?v=BSKKX2Z3dzc&list=PLhQjrBD2T382eX9-tF75Wa4lmlC7sxNDH&index=10&t=2517s) in final lecture.

## Account Types

**Basic**: Suggest questions for games and play published games.

**Moderator**: Basic access plus create your own games.

## Moderator Features

### Game Creation Flow

- Create an account, choosing moderator as the access type.

- Create a new game, and give your game a unique name. It may take a minute to set up and load.

- After the game's been setup, you'll be redirected to edit your category names. You can always leave the defaults or change these later.

- All active games will be open for question suggestions by any user with an account.

  - If you're requesting submissions, you'll want to let them know the name you gave your game.
  - You are, of course, able to contribute your own questions to the game too!

- Once you've received enough questions, it's time to load up the categories!

  - You'll choose 25 questions for Single Jeopardy, same for Double Jeopardy, and just one for Final Jeopardy. Feel free to use the same question more than once if needed.
  - To **add questions to a category, just drag and drop** the question from the list to where you want it. Changes are automatically saved.

- After all of your questions are filled, you're ready to launch your game!

### Moderator Game Configuration Options

**Team Names**: Give each team a custom name and save the changes. _Note: Try not to prefix the name with "Team ..." as some prompts already add this prefix._

**Daily Double**: Enabling this option will choose **one random question** in the first round will be chosen for the Daily Double. **Two random questions** will be chosen in Double Jeopardy. Questions are randomized each time you reset the game. Teams can wager anywhere from minimum round price to their current score or the maximum round price (\$1,000 in Single Jeopardy, \$2,000 in Double), whichever is greater.

**Round Timers**: If this option is enabled with set times, during single and double jeopardy, they'll be a countdown indicator of minutes remaining. When the time is complete, a notification will show, but won't affect the game in progress. In Final Jeopardy, a countdown will start when requested and automatically close the question when the time is up.

### Playing Your Own Game

The game play flow for this application was built assuming a setup similar to the one in CS50x2018 Final Lecture with two teams and a moderator.

- The moderator (with the computer) controls the game flow:

  - Select the chosen available question on the board.

  - Choose which team 'raised their hand first' or by another method.

  - The question will appear. Wait for their answer.

  - Reveal the answer, select whether they were right or wrong, and their score will update accordingly. The previously answering team will be indicated on the scoreboard.

Continue this long as you'd like or until all questions are answered. To manually skip to the next round, **game controls** are in the toolbar on the **bottom left**, facing the screen. Here you can also try the alternate theme, reset the game, or exit out of the game.

The toolbar on the **righthand** side is for **sound effects**. Autoplay is by default disabled, but can be turned on.

- **Final Jeopardy** (Round 3):
  - The final round flow assumes the same layout as in lecture, with a writing utencil and paper.
  - Both teams place their wagers, inputted by the moderator. (team's encouraged not to look at the other team's wager).
  - Even with negative scores, each team will be able to participate, but will have a maximum wager of \$1,000. Otherwise, maximum wager is their current score. Wagers do not need to be multiples of $100 for this round (e.g \$999 is allowed).
  - Once wagers are submitted, the question will show (and countdown will start if enabled).
  - After the round is finished, follow the game prompts walking through the same process of each team showing their answer and moderator choosing correctness.
  - The team with the higher score wins!

### Publish Your Game

- If you'd like to make your game available for other users to play in "Study Mode", you can do so for the launch screen.

- This will not change any of your game play features, but will lock you out from changing the game's questions.

- If you do need to make a change, you can always unpublish the game.
  - _NOTE: if a user has played your game when you decide to unpublish it, it will remove that game from their "study games" ( don't want any `null` pointers to changed or deleted questions_ 😉 _)_

## User Features

Create an account, leaving "Basic" selected for the access type.

### Contributing Questions

See your question on the big screen!

- Select the game you'd like to contribute your question to, type your question and answer, then submit.

- You'll be taken to a confirmation screen with the option to edit your question if needed.

### Playing Published Games

Play any published games to review and see how high you can score!

- Game play flow in "study mode" is for one player:
  - Select a value to reveal the question, then try your best to answer it.
  - Reveal the answer and select if you were right or wrong.
  - **Note:** Questions marked as incorrect will be saved for your to review later.

The bottom-left control toolbar allows you to toggle the theme, change rounds, save and finish the game, or reset the game without saving.

The bottom-right control bar contains sound effects. Autoplaying sounds is disabled by default.

### Review Missed Questions

If you've played and saved a game, you'll see your score and any questions marked as _incorrect_ will appear here for you to review again.

---

## CS50x2018 Sample Game

A sample game has been published with the same categories and played questions in lecture.

If you've created an account, select _"CS50x2018"_ from the [study games options](https://cs50-jeopardy-next.herokuapp.com/study) to give it a shot!

---

### Thanks again @CS50 ! It's been fun 🤙
