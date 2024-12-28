import React, { useEffect, useRef } from 'react';
import Phaser from 'phaser';
import { gameConfig } from './game/config';

function App() {
  const gameRef = useRef<Phaser.Game | null>(null);

  useEffect(() => {
    // Add a check for an existing game instance
    if (!gameRef.current) {
      gameRef.current = new Phaser.Game(gameConfig);
    }

    return () => {
      if (gameRef.current) {
        gameRef.current.destroy(true);
        gameRef.current = null; // Reset the reference after destroying
      }
    };
  }, []);

  return (
    <div className="w-full h-screen bg-black">
      <div id="game-container" className="w-full h-full" />
    </div>
  );
}

export default App;
