import { useState } from 'react';
import Signup from './pages/Signup';
import Signin from './pages/Signin';
import Home from './pages/Home';

type Page = 'signup' | 'signin' | 'home';

interface User {
  id: number;
  name: string;
  email: string;
}

export default function App() {
  const [page, setPage] = useState<Page>('signup');
  const [user, setUser] = useState<User | null>(null);

  return (
    <div style={{ maxWidth: 400, margin: 'auto', padding: 20 }}>
      {page === 'signup' && <Signup onSignupSuccess={() => setPage('signin')} />}
      {page === 'signin' && <Signin onSigninSuccess={(u) => { setUser(u); setPage('home'); }} />}
      {page === 'home' && user && <Home user={user} />}
    </div>
  );
}
