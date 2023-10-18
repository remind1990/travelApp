/* eslint-disable react/prop-types */
import CityItem from './CityItem';
import styles from './CityList.module.css';
import Spinner from './Spinner';
import Message from './Message';
import { useCities } from '../contexts/CitiesContext';

const sortByDate = (a, b) => {
  const dateA = new Date(a.date);
  const dateB = new Date(b.date);
  return dateA - dateB;
};

export default function CityList() {
  const { cities, isLoading } = useCities();
  if (isLoading) return <Spinner />;
  if (cities.length === 0)
    return (
      <Message message="Add your first city by clicking on the city on the map" />
    );

  return (
    <ul className={styles.cityList}>
      {cities.sort(sortByDate).map((city, index) => (
        <CityItem key={index} city={city} />
      ))}
    </ul>
  );
}
