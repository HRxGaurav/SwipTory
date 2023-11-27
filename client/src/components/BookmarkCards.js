import React, {useEffect, useState} from 'react'
import { useNavigate } from 'react-router-dom';
import bookmarkCards from './BookmarkCards.module.css';
import noDataImage from '../assets/icons/Curiosity.png'
import yourStory from './YourStory.module.css';
import ViewStoryModal from './Models/ViewStoryModal';
import editButton from '../assets/icons/editButton.svg'
import AddStoryModel from './Models/AddStoryModel';
import AddStoryMobileModel from './Models/AddStoryMobileModel';
import fetchBookmarkedStories from '../APIs/fetchBookmarkedStories';
import IsMobileView from '../Utilities/IsMobileView'




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


const NoData = () => {
    const navigate = useNavigate();
  return (
    <>
       <div className={bookmarkCards.noCardMain}>
       <div className={bookmarkCards.text}>You have no bookmarks!</div>
        <img src={noDataImage} alt='no Bookmark' className={bookmarkCards.icon} />
        <div className={bookmarkCards.home} onClick={()=>(navigate('/'))}> Back to Home</div>
        </div>
    </>
  )
}


const BookmarkCards = () => {
  const [stories, setStories] = useState([]);
  const [remainStoriesCount, setRemainStoriesCount] = useState(0);
  const [page, setPage] = useState(1);


  useEffect(() => {
    // Fetch initial stories when the component mounts
    fetchInitialStories();
  }, []);

  const fetchInitialStories = async () => {
    try {
      const { success, data } = await fetchBookmarkedStories(page);
  
      if (success) {
        console.log(data);
        setStories(data?.stories);
        setRemainStoriesCount(data?.remainStoriesCount);
        setPage(page + 1);
      } else {
        console.error('Failed to fetch initial stories:', data?.error);
      }
    } catch (error) {
      console.error('Error during API call:', error);
    }
  };
  
  const handleSeeMoreClick = async () => {
    const { success, data } = await fetchBookmarkedStories( page);

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
      { stories.length>0 ? <><div className={yourStory.bookmarkHeading}>Your Bookmarks</div>
      
        <div className={yourStory.main}>        
          {stories.map((story) => (
            <StoryCards key={story._id} id={story._id} imageUrl={story.slides[0].imageUrl} heading={story.slides[0].heading} description={story.slides[0].description} isEditable={story.isEditable} rawData={story}/>
          ))}
        </div>
        {remainStoriesCount > 0 && (
          <div className={yourStory.seeMoreButton} onClick={handleSeeMoreClick}>
            See more
          </div>
        )}</> : <NoData/>}
    </>
  );
};

export default BookmarkCards