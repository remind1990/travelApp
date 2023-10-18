import {
  createContext,
  useReducer,
  useEffect,
  useContext,
  useCallback,
} from 'react';
import { useAuth } from './FakeAuthContext';

const BASE_URL = 'https://630a47433249910032839dbc.mockapi.io';
const CitiesContext = createContext();
const initialState = {
  cities: [],
  isLoading: false,
  currentCity: {},
  error: '',
};

function reducer(state, action) {
  switch (action.type) {
    case 'loading':
      return { ...state, isLoading: true };
    case 'cities/loaded':
      return { ...state, isLoading: false, cities: action.payload };

    case 'city/created':
      return {
        ...state,
        isLoading: false,
        cities: action.payload.cities,
        currentCity: action.payload.currentCity,
      };

    case 'city/loaded':
      return {
        ...state,
        isLoading: false,
        currentCity: action.payload,
      };
    case 'city/deleted':
      return {
        ...state,
        isLoading: false,
        cities: state.cities.filter((c) => c.id !== action.payload),
        currentCity: {},
      };
    case 'rejected':
      return { ...state, isLoading: false, error: action.payload };
    default:
      throw new Error('Unknown action type');
  }
}

function CitiesProvider({ children }) {
  const [{ cities, isLoading, currentCity, error }, dispatch] =
    useReducer(reducer, initialState);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;
    async function fetchCities() {
      dispatch({ type: 'loading' });
      try {
        const cities = user.cities;
        dispatch({ type: 'cities/loaded', payload: cities });
      } catch (err) {
        dispatch({
          type: 'rejected',
          payload: 'There was an error loading data...',
        });
      }
    }
    fetchCities();
  }, [user]);

  const getCity = useCallback(
    async function getCity(id) {
      if (Number(id) === currentCity.id) return;
      try {
        dispatch({ type: 'loading' });
        const res = await fetch(`${BASE_URL}/users/${user.id}`);
        const data = await res.json();
        const city = data.cities.find((c) => c.id === Number(id));
        dispatch({ type: 'city/loaded', payload: city });
      } catch (err) {
        dispatch({
          type: 'rejected',
          payload: 'Failed to fetch cities',
        });
      }
    },
    [currentCity.id, user]
  );

  async function createCity(newCity) {
    try {
      dispatch({ type: 'loading' });
      const userWithNewCity = {
        ...user,
        cities: [...cities, newCity],
      };

      const res = await fetch(`${BASE_URL}/users/${user.id}`, {
        method: 'PUT',
        body: JSON.stringify(userWithNewCity),
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (res.ok) {
        const data = await res.json();
        dispatch({
          type: 'city/created',
          payload: {
            cities: data.cities,
            currentCity: newCity,
          },
        });
      }
    } catch (err) {
      dispatch({
        type: 'rejected',
        payload: 'Error creating city',
      });
    }
  }

  async function deleteCity(id) {
    try {
      dispatch({ type: 'loading' });
      const userWithDeletedCity = {
        ...user,
        cities: user.cities.filter((c) => c.id !== Number(id)),
      };
      await fetch(`${BASE_URL}/users/${user.id}`, {
        method: 'PUT',
        body: JSON.stringify(userWithDeletedCity),
        headers: {
          'Content-Type': 'application/json',
        },
      });
      dispatch({ type: 'city/deleted', payload: id });
    } catch (err) {
      dispatch({
        type: 'rejected',
        payload: 'Error deleting city',
      });
    }
  }

  return (
    <CitiesContext.Provider
      value={{
        cities,
        isLoading,
        currentCity,
        error,
        getCity,
        createCity,
        deleteCity,
      }}
    >
      {children}
    </CitiesContext.Provider>
  );
}

function useCities() {
  const context = useContext(CitiesContext);
  if (context === undefined) {
    throw new Error(
      'Trying to use a context not inside CitiesProvider'
    );
  }
  return context;
}

export { CitiesProvider, useCities };
