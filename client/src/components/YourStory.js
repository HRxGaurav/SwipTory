import React, { useState, useEffect } from 'react';
import fetchMyStories from '../APIs/fetchMyStories';
import yourStory from './YourStory.module.css';
import editButton from '../assets/icons/editButton.svg'
import AddStoryModel from './Models/AddStoryModel';
import AddStoryMobileModel from './Models/AddStoryMobileModel';
import ViewStoryModal from './Models/ViewStoryModal';
import IsMobileView from '../Utilities/IsMobileView'
import {NoData} from './BookmarkCards'

const StoryCards = ({id, imageUrl,heading, description, isEditable, rawData} ) => {
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewStoryModal, setViewStoryModal] = useState(false);

    const openEditModal = (event) => {
      // Prevent the click event from propagating up to the parent element
      event.stopPropagation();
    
      setShowEditModal((prev) => !prev);
      setViewStoryModal(false);
    };

    const openViewStoryModal = ()=>{
      setViewStoryModal(true);
    }


    return (
      
        <>
            {!IsMobileView() ? <div key={id} className={yourStory.cardDiv}>
              <div className={yourStory.container}>
                <div
                  onClick={openViewStoryModal}
                  className={yourStory.cardImage}
                  style={{
                    backgroundImage: `linear-gradient(0deg, #000 20%, rgba(0, 0, 0, 0.00) 50%),
                                      linear-gradient(180deg, #000 1%, rgba(0, 0, 0, 0.00) 20%), 
                                      url(${imageUrl})`
                  }}
                >
                  <div className={yourStory.typo}>
                    <div className={yourStory.heading}>{heading}</div>
                    <div className={yourStory.description}>{description}</div>
                  </div>
                  {isEditable && <div className={yourStory.editButton} onClick={(event) => openEditModal(event)}><span><img src={editButton} alt='editButton' /></span>Edit</div>}
                </div>
              </div>
            </div>

            :

            <div key={id} className={yourStory.cardDivMobile}>
              <div className={yourStory.container}>
                <div
                  onClick={openViewStoryModal}
                  className={yourStory.cardImage}
                  style={{
                    backgroundImage: `linear-gradient(0deg, #000 20%, rgba(0, 0, 0, 0.00) 50%),
                                      linear-gradient(180deg, #000 1%, rgba(0, 0, 0, 0.00) 20%), 
                                      url(${imageUrl})`
                  }}
                >
                  <div className={yourStory.typo}>
                    <div className={yourStory.heading}>{heading}</div>
                    <div className={yourStory.description}>{description}</div>
                  </div>
                  {isEditable && <div className={yourStory.editButton} onClick={(event) => openEditModal(event)}><span><img src={editButton} alt='editButton' /></span>Edit</div>}
                </div>
              </div>
            </div>}
            {showEditModal && ( <AddStoryModel closeModalState={() => setShowEditModal(false)} postId={id} buttonName='Update'/> )}
            {showEditModal && ( <AddStoryMobileModel closeModalState={() => setShowEditModal(false)} postId={id} buttonName='Update'/> )}
            {showViewStoryModal && ( <ViewStoryModal closeModalState={() => setViewStoryModal(false)} postId={id} rawData={rawData} /> )}
            
        </>
    )
}

const YourStory = () => {
  const [stories, setStories] = useState([]);
  const [remainStoriesCount, setRemainStoriesCount] = useState(0);
  const [page, setPage] = useState(1);

  useEffect(() => {
    // Fetch initial stories when the component mounts
    fetchInitialStories();
  }, []);

  const fetchInitialStories = async () => {
    const { success, data } = await fetchMyStories( page);

    if (success) {
      setStories(data?.stories);
      setRemainStoriesCount(data?.remainStoriesCount);
      setPage(page + 1);
    } else {
      console.error('Failed to fetch initial stories:', data?.error);
    }
  };

  const handleSeeMoreClick = async () => {
    const { success, data } = await fetchMyStories( page);

    if (success) {
      setStories((prevStories) => [...prevStories, ...data.stories]);
      setRemainStoriesCount(data.remainStoriesCount);
      setPage(page + 1);
    } else {
      console.error('Failed to fetch more stories:', data?.error);
    }
  };

  return (
    <>
      { stories.length>0 ? <><div className={yourStory.yourStory} >Your Stories</div>

        <div className={yourStory.main}>       
          {stories.map((story, index) => (
            <StoryCards key={story._id} id={story._id} imageUrl={story.slides[0].imageUrl} heading={story.slides[0].heading} description={story.slides[0].description} isEditable={story.isEditable} rawData={story}/>
          ))}
        </div>
        {remainStoriesCount > 0 && (
          <div className={yourStory.seeMoreButton} onClick={handleSeeMoreClick}>
            See more
          </div>
        )}</>
        
        :<NoData  className={yourStory.noData}topHeading='You have no stories!'/>}
    </>
  );
};

export default YourStory;
export { StoryCards };
