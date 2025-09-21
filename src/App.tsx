import { useState } from "react";
import { Layout } from "./components/Layout";
import { HomePage } from "./pages/HomePage";
import { ChallengeViewer } from "./components/ChallengeViewer";
import { Challenge } from "./types/Challenge";
import { myChallenge } from "./data/sampleChallenges";

function App() {
  const [currentChallenge, setCurrentChallenge] = useState<Challenge | null>(
    null
  );

  const handleViewChallenge = (challenge: Challenge) => {
    setCurrentChallenge(challenge);
  };

  const handleBackToHome = () => {
    setCurrentChallenge(null);
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
          challenges={myChallenge}
          onViewChallenge={handleViewChallenge}
        />
      )}
    </Layout>
  );
}

export default App;
