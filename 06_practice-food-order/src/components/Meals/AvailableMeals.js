import { useState, useEffect } from 'react';
import Card from '../UI/Card';
import MealItem from './MealItem/MealItem';
import classes from './AvailableMeals.module.css';

const AvailableMeals = () => {
  const [meals, setMeals] = useState([]);
  const [loading, setLoading] = useState(true); // true because with component mounting data is fetched
  const [error, setError] = useState(); // undefined at the beginning

  // DON'T use async directly on useEffect(async() ...) because possible cleanup fn has to be synchronous
  useEffect(() => {
    const fetchMeals = async () => {
      const res = await fetch(
        // .json in URL is Firebase specific
        'https://react-http-ba0a9-default-rtdb.europe-west1.firebasedatabase.app/meals.json'
      );
      if (!res.ok) throw new Error('Something went wrong'); // string will be stored in message prop of error obj
      const data = await res.json();

      // transform received data obj into my wished format
      const fetchedMeals = [];
      for (const key in data) {
        fetchedMeals.push({
          id: key,
          name: data[key].name,
          description: data[key].description,
          price: data[key].price,
        });
      }
      setMeals(fetchedMeals);
    };

    // ERROR Handling: async fn is returning a promise that is rejected in case of throwing error,
    // so it's only working if I use catch method on fetchMeals and handle error inside of it
    fetchMeals().catch((e) => setError(e));

    setLoading(false);
  }, []);

  // return loading info for user
  if (loading) {
    return (
      <section className={classes.loading}>
        <p>Loading...</p>
      </section>
    );
  }

  if (error) {
    return (
      <section className={classes.error}>
        <p>Failed to fetch</p>
      </section>
    );
  }

  const mealsList = meals.map((meal) => (
    <MealItem
      key={meal.id}
      id={meal.id}
      name={meal.name}
      description={meal.description}
      price={meal.price}
    />
  ));

  return (
    <section className={classes.meals}>
      <Card>
        <ul>{mealsList}</ul>
      </Card>
    </section>
  );
};

export default AvailableMeals;
