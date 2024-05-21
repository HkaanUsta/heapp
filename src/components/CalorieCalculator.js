import React, { useState } from 'react';
import foodsData from '../foods.json';
import '../App.css'; // CSS dosyasını dahil ediyoruz

function CalorieAndMealTracker() {
  const [age, setAge] = useState('');
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [gender, setGender] = useState('male');
  const [activityLevel, setActivityLevel] = useState('light');
  const [selectedMeals, setSelectedMeals] = useState({
    Kahvaltı: [],
    Öğlen: [],
    Akşam: [],
    Ara: []
  });
  const [dailyCalories, setDailyCalories] = useState(null);
  const [formData, setFormData] = useState({
    age: '',
    weight: '',
    height: '',
    gender: 'male',
    activityLevel: 'light'
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { age, weight, height, gender, activityLevel } = formData;
    const bmr = calculateBMR(age, weight, height, gender);
    const calories = calculateDailyCalories(bmr, activityLevel);
    setDailyCalories(calories);
  };

  const calculateBMR = (age, weight, height, gender) => {
    let bmr;
    if (gender === 'male') {
      bmr = 88.362 + (13.397 * weight) + (4.799 * height) - (5.677 * age);
    } else {
      bmr = 447.593 + (9.247 * weight) + (3.098 * height) - (4.330 * age);
    }
    return bmr;
  };

  const calculateDailyCalories = (bmr, activityLevel) => {
    let dailyCalories;
    switch (activityLevel) {
      case 'light':
        dailyCalories = bmr * 1.2;
        break;
      case 'moderate':
        dailyCalories = bmr * 1.55;
        break;
      case 'high':
        dailyCalories = bmr * 1.725;
        break;
      default:
        dailyCalories = bmr * 1.2; 
    }
    return dailyCalories;
  };

  const handleMealSelect = (meal, food) => {
    const updatedMeals = { ...selectedMeals };
    const mealIndex = updatedMeals[meal].findIndex(f => f.name === food.name);
    if (mealIndex === -1) {
      updatedMeals[meal] = [...updatedMeals[meal], { ...food, quantity: 1 }];
    } else {
      updatedMeals[meal][mealIndex].quantity += 1;
    }
    setSelectedMeals(updatedMeals);
  };

  const handleRemoveMeal = (meal, index) => {
    const removedMeal = selectedMeals[meal][index];
    const updatedMeals = { ...selectedMeals };
    const updatedCalories = dailyCalories + removedMeal.calories;

    if (removedMeal.quantity > 1) {
      updatedMeals[meal][index].quantity -= 1;
    } else {
      updatedMeals[meal].splice(index, 1);
    }
    setSelectedMeals(updatedMeals);
    setDailyCalories(updatedCalories);
  };

  const handleFoodAddition = (meal, food) => {
    const remainingCalories = dailyCalories - food.calories;
    if(dailyCalories == null) {
      alert("Lütfen önce hesaplamayı yapınız.");
    } else if (remainingCalories >= 0) {
      setDailyCalories(remainingCalories);
      handleMealSelect(meal, food);
    } else {
      setDailyCalories(remainingCalories);
      handleMealSelect(meal, food);
      alert("Günlük kalori limitinizi aştınız!");
    }
  };

  return (
    <div className='container'>
      <div>
        <h2>Kalori Hesaplayıcı</h2>
        <form className='form-group' onSubmit={handleSubmit}>
          <label>
            Yaş:
            <input type="number" name="age" value={formData.age} onChange={handleChange} />
          </label>
          <label>
            Kilo (kg):
            <input type="number" name="weight" value={formData.weight} onChange={handleChange} />
          </label>
          <label>
            Boy (cm):
            <input type="number" name="height" value={formData.height} onChange={handleChange} />
          </label>
          <label>
            Cinsiyet:
            <select name="gender" value={formData.gender} onChange={handleChange}>
              <option value="male">Erkek</option>
              <option value="female">Kadın</option>
            </select>
          </label>
          <label>
            Spor:
            <select name="activityLevel" value={formData.activityLevel} onChange={handleChange}>
              <option value="light">Az</option>
              <option value="moderate">Orta</option>
              <option value="high">Çok</option>
            </select>
          </label>
          <button type="submit">Hesapla</button>
        </form>
      </div>
      <div className='meal-selection'>
        <h2>Yiyecek Seç</h2>
        <div className='meals-container'>
          {Object.keys(selectedMeals).map((meal, index) => (
            <div className='meals-column' key={index}>
              <h3>{meal}</h3>
              {foodsData.map((food, index) => (
                <div key={index}>
                  {food.name} - {food.calories} Kalori
                  <button className='addButton' onClick={() => handleFoodAddition(meal, food)}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-plus" viewBox="0 0 16 16">
                      <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4"/>
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
      <div>
        <ul className='meal-list'>
          {Object.keys(selectedMeals).map(meal => (
            <li className='meal-item' key={meal}>
              <h3>{meal}</h3>
              <ul>
                {selectedMeals[meal].map((food, index) => (
                  <li key={index}>
                    {food.name} - {food.calories} Kalori (x{food.quantity})
                    <button onClick={() => handleRemoveMeal(meal, index)}>Kaldır</button>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </div>
      {dailyCalories && (
        <div className='footer'>
          <p>Günlük alman gereken kalori: {dailyCalories.toFixed(2)} Kalori</p>
        </div>
      )}
    </div>
  );
}

export default CalorieAndMealTracker;
