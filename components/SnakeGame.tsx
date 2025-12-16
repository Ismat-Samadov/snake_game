'use client';

import { useEffect, useRef, useState, useCallback } from 'react';

type Position = { x: number; y: number };
type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';
type GameState = 'idle' | 'playing' | 'paused' | 'gameOver';

const GRID_SIZE = 20;
const CELL_SIZE = 25;
const INITIAL_SNAKE: Position[] = [{ x: 10, y: 10 }, { x: 10, y: 11 }, { x: 10, y: 12 }];
const INITIAL_DIRECTION: Direction = 'UP';
const GAME_SPEED = 100;

export default function SnakeGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [snake, setSnake] = useState<Position[]>(INITIAL_SNAKE);
  const [food, setFood] = useState<Position>({ x: 5, y: 5 });
  const [direction, setDirection] = useState<Direction>(INITIAL_DIRECTION);
  const [nextDirection, setNextDirection] = useState<Direction>(INITIAL_DIRECTION);
  const [gameState, setGameState] = useState<GameState>('idle');
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const gameLoopRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('snakeHighScore');
    if (saved) setHighScore(parseInt(saved, 10));
  }, []);

  const generateFood = useCallback((currentSnake: Position[]): Position => {
    let newFood: Position;
    do {
      newFood = { x: Math.floor(Math.random() * GRID_SIZE), y: Math.floor(Math.random() * GRID_SIZE) };
    } while (currentSnake.some(s => s.x === newFood.x && s.y === newFood.y));
    return newFood;
  }, []);

  const checkCollision = useCallback((head: Position, body: Position[]): boolean => {
    if (head.x < 0 || head.x >= GRID_SIZE || head.y < 0 || head.y >= GRID_SIZE) return true;
    return body.some(s => s.x === head.x && s.y === head.y);
  }, []);

  useEffect(() => {
    if (gameState !== 'playing') return;

    gameLoopRef.current = setInterval(() => {
      setSnake(prevSnake => {
        const head = { ...prevSnake[0] };

        switch (nextDirection) {
          case 'UP': head.y -= 1; break;
          case 'DOWN': head.y += 1; break;
          case 'LEFT': head.x -= 1; break;
          case 'RIGHT': head.x += 1; break;
        }

        setDirection(nextDirection);

        if (checkCollision(head, prevSnake)) {
          setGameState('gameOver');
          return prevSnake;
        }

        const newSnake = [head, ...prevSnake];

        if (head.x === food.x && head.y === food.y) {
          setScore(prev => {
            const newScore = prev + 10;
            if (newScore > highScore) {
              setHighScore(newScore);
              localStorage.setItem('snakeHighScore', newScore.toString());
            }
            return newScore;
          });
          setFood(generateFood(newSnake));
        } else {
          newSnake.pop();
        }

        return newSnake;
      });
    }, GAME_SPEED);

    return () => {
      if (gameLoopRef.current) clearInterval(gameLoopRef.current);
    };
  }, [gameState, nextDirection, food, checkCollision, generateFood, highScore]);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (gameState === 'idle' && ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
        startGame();
        return;
      }

      if (gameState === 'gameOver' && (e.key === ' ' || e.key === 'Enter')) {
        resetGame();
        return;
      }

      if (e.key === ' ') {
        e.preventDefault();
        togglePause();
        return;
      }

      const dirMap: Record<string, Direction> = {
        'ArrowUp': 'UP', 'w': 'UP', 'W': 'UP',
        'ArrowDown': 'DOWN', 's': 'DOWN', 'S': 'DOWN',
        'ArrowLeft': 'LEFT', 'a': 'LEFT', 'A': 'LEFT',
        'ArrowRight': 'RIGHT', 'd': 'RIGHT', 'D': 'RIGHT',
      };

      const newDir = dirMap[e.key];
      if (newDir) {
        e.preventDefault();
        const opposites: Record<Direction, Direction> = { UP: 'DOWN', DOWN: 'UP', LEFT: 'RIGHT', RIGHT: 'LEFT' };
        if (opposites[direction] !== newDir) setNextDirection(newDir);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [gameState, direction]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear
    ctx.fillStyle = '#1a1a1a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw food - smooth circle
    const foodX = food.x * CELL_SIZE + CELL_SIZE / 2;
    const foodY = food.y * CELL_SIZE + CELL_SIZE / 2;

    ctx.shadowBlur = 20;
    ctx.shadowColor = '#00ff88';
    ctx.fillStyle = '#00ff88';
    ctx.beginPath();
    ctx.arc(foodX, foodY, 8, 0, 2 * Math.PI);
    ctx.fill();
    ctx.shadowBlur = 0;

    // Draw snake - smooth rounded segments
    snake.forEach((segment, i) => {
      const x = segment.x * CELL_SIZE + CELL_SIZE / 2;
      const y = segment.y * CELL_SIZE + CELL_SIZE / 2;
      const radius = i === 0 ? 10 : 9;
      const alpha = 1 - (i / snake.length) * 0.3;

      ctx.fillStyle = i === 0 ? '#ffffff' : `rgba(255, 255, 255, ${alpha})`;
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, 2 * Math.PI);
      ctx.fill();
    });
  }, [snake, food]);

  const startGame = () => setGameState('playing');
  const togglePause = () => setGameState(prev => prev === 'playing' ? 'paused' : 'playing');
  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    setNextDirection(INITIAL_DIRECTION);
    setFood(generateFood(INITIAL_SNAKE));
    setScore(0);
    setGameState('idle');
  };

  const [touchStart, setTouchStart] = useState<Position | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart({ x: e.touches[0].clientX, y: e.touches[0].clientY });
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStart) return;
    const deltaX = e.changedTouches[0].clientX - touchStart.x;
    const deltaY = e.changedTouches[0].clientY - touchStart.y;

    if (Math.abs(deltaX) < 30 && Math.abs(deltaY) < 30) {
      if (gameState === 'idle') startGame();
      else if (gameState === 'playing' || gameState === 'paused') togglePause();
      else if (gameState === 'gameOver') resetGame();
    } else {
      const newDir = Math.abs(deltaX) > Math.abs(deltaY)
        ? (deltaX > 0 ? 'RIGHT' : 'LEFT')
        : (deltaY > 0 ? 'DOWN' : 'UP');

      if (gameState === 'playing') {
        const opposites: Record<Direction, Direction> = { UP: 'DOWN', DOWN: 'UP', LEFT: 'RIGHT', RIGHT: 'LEFT' };
        if (opposites[direction] !== newDir) setNextDirection(newDir);
      }
    }
    setTouchStart(null);
  };

  const handleDirectionClick = (dir: Direction) => {
    if (gameState === 'idle') {
      startGame();
      setNextDirection(dir);
    } else if (gameState === 'playing') {
      const opposites: Record<Direction, Direction> = { UP: 'DOWN', DOWN: 'UP', LEFT: 'RIGHT', RIGHT: 'LEFT' };
      if (opposites[direction] !== dir) setNextDirection(dir);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Header */}
      <div className="mb-8 md:mb-12 text-center">
        <h1 className="text-5xl md:text-6xl font-bold mb-6 md:mb-8 tracking-tight text-white">
          SNAKE
        </h1>

        {/* Score */}
        <div className="flex items-center justify-center gap-8 md:gap-16">
          <div>
            <div className="text-sm text-[#888888] mb-1 uppercase tracking-wider">Score</div>
            <div className="text-4xl md:text-5xl font-bold" style={{ color: '#00ff88' }}>{score}</div>
          </div>
          <div className="w-px h-12 bg-[#333333]" />
          <div>
            <div className="text-sm text-[#888888] mb-1 uppercase tracking-wider">Best</div>
            <div className="text-4xl md:text-5xl font-bold text-white">{highScore}</div>
          </div>
        </div>
      </div>

      {/* Canvas */}
      <div className="relative mx-auto" style={{ width: GRID_SIZE * CELL_SIZE, maxWidth: '100%' }}>
        <canvas
          ref={canvasRef}
          width={GRID_SIZE * CELL_SIZE}
          height={GRID_SIZE * CELL_SIZE}
          className="w-full rounded-2xl shadow-2xl"
          style={{ backgroundColor: '#1a1a1a' }}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        />

        {/* Overlays */}
        {gameState === 'idle' && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/80 rounded-2xl backdrop-blur-sm animate-fadeIn">
            <div className="text-center p-8">
              <p className="text-[#888888] mb-6">Use arrow keys or WASD to play</p>
              <button
                onClick={startGame}
                className="px-8 py-4 rounded-xl font-medium text-lg transition-all duration-200 hover:scale-105 active:scale-95"
                style={{ backgroundColor: '#00ff88', color: '#000000' }}
              >
                Start Game
              </button>
            </div>
          </div>
        )}

        {gameState === 'paused' && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/80 rounded-2xl backdrop-blur-sm animate-fadeIn">
            <div className="text-center">
              <h2 className="text-4xl font-bold text-white mb-2">Paused</h2>
              <p className="text-[#888888]">Press Space to continue</p>
            </div>
          </div>
        )}

        {gameState === 'gameOver' && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/80 rounded-2xl backdrop-blur-sm animate-fadeIn">
            <div className="text-center p-8">
              <h2 className="text-4xl font-bold text-white mb-4">Game Over</h2>
              <p className="text-xl text-[#888888] mb-6">Score: <span className="text-white font-bold">{score}</span></p>
              {score === highScore && score > 0 && (
                <p className="mb-6" style={{ color: '#00ff88' }}>New High Score!</p>
              )}
              <button
                onClick={resetGame}
                className="px-8 py-4 rounded-xl font-medium text-lg transition-all duration-200 hover:scale-105 active:scale-95"
                style={{ backgroundColor: '#00ff88', color: '#000000' }}
              >
                Play Again
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Mobile Controls */}
      <div className="mt-8 md:hidden flex flex-col items-center gap-3">
        <button
          onClick={() => handleDirectionClick('UP')}
          className="w-14 h-14 rounded-xl transition-all active:scale-95"
          style={{ backgroundColor: '#1a1a1a', color: '#00ff88' }}
        >
          <svg className="w-6 h-6 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 15l7-7 7 7" />
          </svg>
        </button>
        <div className="flex gap-3">
          <button
            onClick={() => handleDirectionClick('LEFT')}
            className="w-14 h-14 rounded-xl transition-all active:scale-95"
            style={{ backgroundColor: '#1a1a1a', color: '#00ff88' }}
          >
            <svg className="w-6 h-6 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={() => handleDirectionClick('DOWN')}
            className="w-14 h-14 rounded-xl transition-all active:scale-95"
            style={{ backgroundColor: '#1a1a1a', color: '#00ff88' }}
          >
            <svg className="w-6 h-6 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          <button
            onClick={() => handleDirectionClick('RIGHT')}
            className="w-14 h-14 rounded-xl transition-all active:scale-95"
            style={{ backgroundColor: '#1a1a1a', color: '#00ff88' }}
          >
            <svg className="w-6 h-6 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      {/* Instructions */}
      <p className="text-center text-[#888888] text-sm mt-8">
        Press <span className="text-white">Space</span> to pause
      </p>
    </div>
  );
}
