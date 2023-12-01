import React, { useState, useContext } from 'react';
import CategoryContext from '../Utilities/CategoryContext';
import filterCards from './FilterCards.module.css';
import all from '../assets/images/All.jpg';
import health from '../assets/images/health-fitness.jpg';
import food from '../assets/images/food.jpg';
import travel from '../assets/images/travel.jpg';
import movie from '../assets/images/movie.jpg';
import education from '../assets/images/education.jpg';
import IsMobileView from '../Utilities/IsMobileView';
import FilterCardMobile from './FilterCardMobile';

const Cards = ({ image, text, isSelected, onClick }) => {
  return (
    <>
      <div
        className={`${filterCards.cardDiv} ${isSelected ? filterCards.selected : ''}`}
        onClick={onClick}
      >
        <div className={filterCards.container}>
          <img src={image} alt={text} className={filterCards.image} />
          <div className={filterCards.text}>{text}</div>
        </div>
      </div>
    </>
  );
};

const FilterCards = () => {
  const [selectedCard, setSelectedCard] = useState(null);
  const [selectedCategory, setSelectedCategory] = useContext(CategoryContext);

  const handleCardClick = (index) => {
    setSelectedCard(index);
    setSelectedCategory(CardsData[index].value)
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
      {!IsMobileView() ? <div className={filterCards.main}>
        {CardsData.map((item, index) => (
          <Cards key={index} image={item.img} text={item.name} isSelected={selectedCard === index} onClick={() => handleCardClick(index)} />
        ))}
      </div>

        :

        <FilterCardMobile />
      }
    </>
  );
};

export default FilterCards;
