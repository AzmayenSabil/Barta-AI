import React from 'react';
import { Room } from './components/Room';
import { JoinRoom } from './components/JoinRoom';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { useRoomStore } from './store/useRoomStore';

function App() {
  const { currentRoom } = useRoomStore();

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">
        {currentRoom ? <Room /> : <JoinRoom />}
      </main>
      {!currentRoom && <Footer />}
    </div>
  );
}

export default App;