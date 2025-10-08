import { useEffect, useState } from 'react';
import Login from '@/components/pages/Login';
import Chat from '@/components/pages/Chat';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    if (localStorage.getItem('token')) {
      setIsLoggedIn(true);
    }
  }, []);

  return (
    <div className='mx-auto h-svh max-w-lg content-center p-6'>
      {isLoggedIn ? (
        <Chat setIsLoggedIn={setIsLoggedIn} />
      ) : (
        <Login setIsLoggedIn={setIsLoggedIn} />
      )}
    </div>
  );
}

export default App;
