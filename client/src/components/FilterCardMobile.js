import React, { useState, useContext} from 'react';
import CategoryContext from '../Utilities/CategoryContext';
import style from './FilterCardMobile.module.css';
import all from '../assets/images/All.jpg';
import health from '../assets/images/health-fitness.jpg';
import food from '../assets/images/food.jpg';
import travel from '../assets/images/travel.jpg';
import movie from '../assets/images/movie.jpg';
import education from '../assets/images/education.jpg';

const Cards = ({ image, text, isSelected, onClick }) => {
  return (
    <>
      <div
        className={`${style.cardDiv} ${isSelected ? style.selected : ''}`}
        onClick={onClick}
      >
        <div className={style.container}>
          <img src={image} alt={text} className={style.image} />
          <div className={style.text}>{text}</div>
        </div>
      </div>
    </>
  );
};

const FilterCardMobile = () => {
  const [selectedCard, setSelectedCard] = useState(null);
  const [selectedCategory, setSelectedCategory] = useContext(CategoryContext);

  const handleCardClick = (index) => {
    setSelectedCard(index);
    setSelectedCategory(CardsData[index].value)
    console.log(selectedCategory);
  };


  const CardsData = [
    { name: 'All', value: "all", img: all },
    { name: 'Food', value: "food", img: food },
    { name: 'Health and fitness', value: "health_and_fitness", img: health },
    { name: 'Travel', value: "travel", img: travel },
    { name: 'Movies', value: "movies", img: movie },
    { name: 'Education', value: "education", img: education },
  ];

  return (
    <>
    <div className={style.main}>
      {CardsData.map((item, index) => (
        <Cards key={index} image={item.img} text={item.name} isSelected={selectedCard === index} onClick={() => handleCardClick(index)} />
      ))}
    </div>
    </>
  );
};

export default FilterCardMobile;
