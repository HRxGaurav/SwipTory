import React, { useContext, useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import FilterCards from '../../components/FilterCards';
import YourStory from '../../components/YourStory';
import Stories from '../../components/Stories';
import LogContext from '../../Utilities/LogContext';
import CategoryContext from '../../Utilities/CategoryContext';
import IsMobileView from '../../Utilities/IsMobileView';

const Homepage = () => {
  const [isUserLoggedin] = useContext(LogContext);
  const [selectedCategory] = useContext(CategoryContext);
  const [forceUpdate, setForceUpdate] = useState(false);

  useEffect(() => {
    // Update forceUpdate whenever isUserLoggedin changes
    setForceUpdate(prevForceUpdate => !prevForceUpdate);
  }, [isUserLoggedin]);

  return (
    <>
      <Navbar />
      <FilterCards />
      {!IsMobileView() && isUserLoggedin && selectedCategory === 'all' && <YourStory />}
      {(selectedCategory === 'all' || selectedCategory === 'food') && ( <Stories key={`${forceUpdate}-food`} category={'food'} title={'food'} /> )}
      {(selectedCategory === 'all' || selectedCategory === 'health_and_fitness') && ( <Stories key={`${forceUpdate}-health_and_fitness`} category={'health_and_fitness'} title={'health and fitness'} /> )}
      {(selectedCategory === 'all' || selectedCategory === 'travel') && ( <Stories key={`${forceUpdate}-travel`} category={'travel'} title={'travel'} /> )}
      {(selectedCategory === 'all' || selectedCategory === 'movies') && ( <Stories key={`${forceUpdate}-movies`} category={'movies'} title={'movies'} /> )}
      {(selectedCategory === 'all' || selectedCategory === 'education') && ( <Stories key={`${forceUpdate}-education`} category={'education'} title={'education'} /> )}
    </>
  );
};

export default Homepage;
