import React, { useState } from 'react';

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="bg-gray-800 p-8 rounded-lg">
          <h1 className="text-white text-2xl mb-4">ACI - Login</h1>
          <button 
            onClick={() => setIsLoggedIn(true)}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Entrar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <h1 className="text-3xl mb-4">ACI Dashboard</h1>
      <p>Aplicação funcionando!</p>
      <button 
        onClick={() => setIsLoggedIn(false)}
        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 mt-4"
      >
        Sair
      </button>
    </div>
  );
};

export default App;