import express from 'express';
import TelegramBot from 'node-telegram-bot-api';
import { config } from 'dotenv';
import { GameStateManager } from '../game/managers/GameStateManager';
import { PatternController } from '../game/controllers/PatternController';
import { ButtonController } from '../game/controllers/ButtonController';
import { RewardSystem } from '../game/utils/rewardSystem';
import path from 'path';
import { fileURLToPath } from 'url';

config(); // Load environment variables

const app = express();
const port = process.env.PORT || 3000;

// Telegram Bot setup
const botToken = process.env.TELEGRAM_BOT_TOKEN;

if (!botToken) {
  console.error('Telegram bot token is not set. Please set the TELEGRAM_BOT_TOKEN environment variable.');
  process.exit(1);
}

const bot = new TelegramBot(botToken, { polling: true });

bot.on('error', (error) => {
  console.error('Telegram Bot Error:', error);
});

bot.on('polling_error', (error) => {
  console.error('Telegram Polling Error:', error);
});

bot.getMe().then((botInfo) => {
  console.log('Bot connected successfully:', botInfo.username);
}).catch((error) => {
  console.error('Failed to connect bot:', error);
});

app.use(express.json());

// Initialize game state manager (you'll need to implement these classes)
const rewardSystem = new RewardSystem();
const patternController = new PatternController('novice');
const buttonController = new ButtonController(rewardSystem);
const gameStateManager = new GameStateManager(patternController, buttonController);

// Serve static files from the React app
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const buildPath = path.join(__dirname, '../../dist');
app.use(express.static(buildPath));

// API health check endpoint
app.get('/api/health', async (req, res) => {
  try {
    const botInfo = await bot.getMe();
    res.json({
      status: 'ok',
      game: 'solsays',
      telegram: {
        connected: true,
        botInfo,
        botToken: botToken ? '✓ Set' : '✗ Missing'
      }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Failed to connect to Telegram',
      error: error.message
    });
  }
});

// Endpoint to start a new game
app.post('/api/game/start', (req, res) => {
  const { difficulty } = req.body;
  gameStateManager.reset();
  const newPattern = patternController.generateNewPattern(1);
  res.json({ success: true, pattern: newPattern });
});

// Endpoint to get the current game state
app.get('/api/game/state', (req, res) => {
  const gameState = gameStateManager.getGameState();
  res.json(gameState);
});

// Endpoint to handle player input
app.post('/api/game/input', (req, res) => {
  const { input } = req.body;
  gameStateManager.handleInput(input);
  const gameState = gameStateManager.getGameState();

  if (gameState.levelFailed) {
    res.json({ success: false, message: 'Level failed', state: gameState });
  } else if (gameState.levelCompleted) {
    res.json({ success: true, message: 'Level completed', state: gameState });
  } else {
    res.json({ success: true, state: gameState });
  }
});

bot.onText(/\/start/, (msg) => {
  bot.sendGame(msg.chat.id, 'solsays');
});

bot.on('callback_query', (query) => {
  if (query.game_short_name === 'solsays') {
    bot.answerCallbackQuery(query.id, {
      url: `${process.env.REPL_PUB_URL}?userId=${query.from.id}`,
    });
  }
});

app.post('/api/score', async (req, res) => {
  const { userId, score } = req.body;
  try {
    await bot.setGameScore(userId, score, { force: true });
    res.json({ success: true });
  } catch (error) {
    console.error('Error updating score:', error);
    res.status(500).json({ error: 'Failed to update score' });
  }
});

// The "catchall" handler: for any request that doesn't
// match one above, send back React's index.html file.
app.get('*', (req, res) => {
  res.sendFile(path.join(buildPath, 'index.html'));
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
