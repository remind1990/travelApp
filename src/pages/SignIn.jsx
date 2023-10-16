import { useState, useEffect } from 'react';
import styles from './Login.module.css';
import PageNav from '../components/PageNav';
import Button from '../components/Button';
import { useAuth } from '../contexts/FakeAuthContext';
import { useNavigate } from 'react-router-dom';

const randomNum1 = Math.floor(Math.random() * 100);
const initialState = {
  name: '',
  email: '',
  password: '',
  avatar: `https://i.pravatar.cc/100?u=${randomNum1}`,
  cities: [],
};

export default function SignIn() {
  const [userData, setUserData] = useState(initialState);
  const [error, setError] = useState({});
  const { createNewUser, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!userData.name || !userData.email || !userData.password) {
      throw new Error('Fields miss information');
    }
    createNewUser(userData);
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    let newError = { ...error };

    if (name === 'password' && value.length < 8) {
      newError.password = 'Password is too short';
    } else {
      newError.password = '';
    }
    if (name === 'name' && value.length < 4) {
      newError.name = 'Name is too short';
    } else {
      newError.name = '';
    }
    setError(newError);
    setUserData((userData) => {
      return { ...userData, [name]: value };
    });
  };

  useEffect(() => {
    if (isAuthenticated) navigate('/app', { replace: true });
  }, [isAuthenticated]);

  return (
    <main className={styles.login}>
      <PageNav />
      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.row}>
          <label htmlFor="name">Enter your name</label>
          <input
            type="text"
            id="name"
            name="name"
            required
            onChange={handleInputChange}
            value={userData.name}
          />
          {error?.name && (
            <span style={{ color: 'red' }}>{error.name}</span>
          )}
        </div>
        <div className={styles.row}>
          <label htmlFor="email">Email address</label>
          <input
            type="email"
            id="email"
            name="email"
            required
            onChange={handleInputChange}
            value={userData.email}
          />
        </div>

        <div className={styles.row}>
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            required
            onChange={handleInputChange}
            value={userData.password}
          />
          {error?.password && (
            <span style={{ color: 'red' }}>{error.password}</span>
          )}
        </div>

        <div>
          <Button type="primary">Sing In</Button>
        </div>
      </form>
    </main>
  );
}
