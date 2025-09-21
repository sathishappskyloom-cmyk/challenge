import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { HomePage } from './pages/HomePage';
import { ChallengeViewer } from './components/ChallengeViewer';
import { Challenge } from './types/Challenge';
import { sampleChallenges } from './data/sampleChallenges';
import { useLocalStorage } from './hooks/useLocalStorage';

function App() {
  const [challenges, setChallenges] = useLocalStorage<Challenge[]>('challenges', sampleChallenges);
  const [currentChallenge, setCurrentChallenge] = useState<Challenge | null>(null);

  const handleViewChallenge = (challenge: Challenge) => {
    setCurrentChallenge(challenge);
  };

  const handleBackToHome = () => {
    setCurrentChallenge(null);
  };

  const handleAddChallenge = (challenge: Challenge) => {
    setChallenges(prev => [...prev, challenge]);
  };

  return (
    <Layout>
      {currentChallenge ? (
        <ChallengeViewer
          challenge={currentChallenge}
          onBack={handleBackToHome}
        />
      ) : (
        <HomePage
          challenges={challenges}
          onViewChallenge={handleViewChallenge}
          onAddChallenge={handleAddChallenge}
        />
      )}
    </Layout>
  );
}

export default App;