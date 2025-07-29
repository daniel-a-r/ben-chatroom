import { useEffect, useState } from 'react';
import Login from '@/components/Login';
import Chat from '@/components/Chat';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    if (localStorage.getItem('token')) {
      setIsLoggedIn(true);
    }
  }, []);

  return (
    <div className='mx-auto grid h-full max-w-lg'>
      {isLoggedIn ? (
        <Chat setIsLoggedIn={setIsLoggedIn} />
      ) : (
        <Login setIsLoggedIn={setIsLoggedIn} />
      )}
    </div>
  );
}

export default App;
