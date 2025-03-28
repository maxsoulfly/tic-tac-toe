# Tic-Tac-Toe Web Project

## Overview

A fully modular, web-based implementation of the classic Tic-Tac-Toe game. Built with HTML, CSS, and vanilla JavaScript, it supports Human vs Human, Human vs AI, and AI vs AI modes, featuring dynamic strategies, board effects, and an evolving AI.

## 🎮 Live Demo

Try it here: [Play Tic-Tac-Toe](https://maxsoulfly.github.io/tic-tac-toe/)

## ✨ Features

-   Human vs Human gameplay
-   Human vs AI and AI vs AI modes
-   Three AI strategies: **Random**, **Greedy**, **Minimax**
-   **Humanlike AI Mode**: switches strategies randomly for unpredictability
-   Randomized first moves for variety
-   Highlighted winning combinations
-   Dynamic console and status updates
-   Hover animations and responsive UI
-   Modular architecture (GameController, AIController, DisplayController, etc.)

## 🧠 AI Strategies

| Strategy    | Description                                                |
| ----------- | ---------------------------------------------------------- |
| `random`    | Selects moves randomly                                     |
| `greedy`    | Prioritizes immediate wins; otherwise, picks randomly      |
| `minimax`   | Uses recursive search for optimal moves (unbeatable)       |
| `humanlike` | Alternates between strategies to mimic human-like behavior |

## 🛠️ Technologies

-   **HTML5**: Semantic structure
-   **CSS3**: Responsive design, transitions, and custom properties
-   **JavaScript**: Modular IIFE structure, DOM manipulation, recursion

## 🕹️ How to Play

1. Click "New Game" to start.
2. Enter player names and enable "AI" for AI-controlled players.
3. Watch AI vs AI mode for automated gameplay.

## 📈 Future Enhancements

-   Difficulty levels: Easy, Normal, Unbeatable
-   Smarter AI with dynamic defense and offense
-   Retro arcade theme with visuals and sound effects
-   Move history with undo/redo functionality
-   Score tracking across sessions

## 🚀 Setup

Clone the repository and open the project in your browser:

```bash
git clone https://github.com/maxsoulfly/tic-tac-toe.git
cd tic-tac-toe
```

Open `index.html` in your browser to play.

## 📄 License

This project is licensed under the [MIT License](LICENSE).

## 🤝 Contributing

Contributions are welcome! Submit pull requests, report bugs, or share ideas for improvements.

## 📬 Contact

For issues or suggestions, open a GitHub issue or leave a message.
