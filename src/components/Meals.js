import React, { useState, useEffect } from 'react';
import foodsData from '../foods.json';

function Meals() {
  const [selectedMeals, setSelectedMeals] = useState({
    Breakfast: [],
    Lunch: [],
    Dinner: [],
    Snack: []
  });
  const [availableFoods, setAvailableFoods] = useState([]);
  const [dailyCalories, setDailyCalories] = useState(0);

  useEffect(() => {
    setAvailableFoods(foodsData);
  }, []);

  const handleMealSelect = (meal, food) => {
    const updatedMeals = { ...selectedMeals };
    updatedMeals[meal] = [...updatedMeals[meal], food];
    setSelectedMeals(updatedMeals);
  };

  const handleRemoveMeal = (meal, index) => {
    const updatedMeals = { ...selectedMeals };
    updatedMeals[meal].splice(index, 1);
    setSelectedMeals(updatedMeals);
  };

  const handleFoodAddition = (meal, food) => {
    const remainingCalories = dailyCalories - food.calories;
    if (remainingCalories >= 0) {
      setDailyCalories(remainingCalories);
      handleMealSelect(meal, food);
    } else {
      alert("You've exceeded your daily calorie limit!");
    }
  };

  return (
    <div>
      <h1>Choose Meals</h1>
      <p>Select your meals for the day:</p>
      <div>
        <h2>Breakfast</h2>
        {availableFoods.map((food, index) => (
          <div key={index}>
            {food.name} - {food.calories} calories
            <button onClick={() => handleFoodAddition("Breakfast", food)}>Add</button>
          </div>
        ))}
      </div>
      {/* Aynı şekilde diğer öğünler için de yapılabilir */}
    </div>
  );
}

export default Meals;
