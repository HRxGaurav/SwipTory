import React, { useContext } from 'react';
import Navbar from '../../components/Navbar';
import FilterCards from '../../components/FilterCards';
import YourStory from '../../components/YourStory';
import Stories from '../../components/Stories';
import LogContext from '../../Utilities/LogContext';
import CategoryContext from '../../Utilities/CategoryContext';

const Homepage = () => {
  const [isUserLoggedin] = useContext(LogContext);
  const [selectedCategory] = useContext(CategoryContext);

  return (
    <>
      <Navbar />
      <FilterCards />
      {isUserLoggedin && selectedCategory === 'all' && <YourStory />}
      {(selectedCategory === 'all' || selectedCategory === 'food') && (<Stories category={'food'} title={'food'} />)}
      {(selectedCategory === 'all' || selectedCategory === 'health_and_fitness') && (<Stories category={'health_and_fitness'} title={'health and fitness'} />)}
      {(selectedCategory === 'all' || selectedCategory === 'travel') && (<Stories category={'travel'} title={'travel'} />)}
      {(selectedCategory === 'all' || selectedCategory === 'movies') && (<Stories category={'movies'} title={'movies'} />)}
      {(selectedCategory === 'all' || selectedCategory === 'education') && (<Stories category={'education'} title={'education'} />)}
      
    </>
  );
};

export default Homepage;