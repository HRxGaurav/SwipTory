import React, { useState, useEffect,useContext } from 'react'
import style from './Stories.module.css'
import editButton from '../assets/icons/editButton.svg'
import fetchStoriesByCategory from '../APIs/fetchStoriesByCategory'
import LogContext from '../Utilities/LogContext'
import AddStoryModel from './Models/AddStoryModel'
import AddStoryMobileModel from './Models/AddStoryMobileModel'
import ViewStoryModal from './Models/ViewStoryModal'
import Loader from './Models/Loader';
import IsMobileView from '../Utilities/IsMobileView'

const StoryCards = ({ id, imageUrl, heading, description, isEditable, rawData }) => {
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
            {!IsMobileView() ? <div key={id} className={style.cardDiv}>
                <div className={style.container}>
                    <div
                    onClick={openViewStoryModal}
                        className={style.cardImage}
                        style={{
                            backgroundImage: `linear-gradient(0deg, #000 20%, rgba(0, 0, 0, 0.00) 50%),
                                      linear-gradient(180deg, #000 1%, rgba(0, 0, 0, 0.00) 20%), 
                                      url(${imageUrl})`
                        }}
                    >
                        <div className={style.typo}>
                            <div className={style.heading}>{heading}</div>
                            <div className={style.description}>{description}</div>
                        </div>
                        {isEditable && <div className={style.editButton} onClick={(event) => openEditModal(event)}><span><img src={editButton} alt='editButton' /></span>Edit</div>}
                    </div>
                </div>
            </div>

            :
            
            <div key={id} className={style.cardDivMobile}>
                <div className={style.container}>
                    <div
                    onClick={openViewStoryModal}
                        className={style.cardImage}
                        style={{
                            backgroundImage: `linear-gradient(0deg, #000 20%, rgba(0, 0, 0, 0.00) 50%),
                                      linear-gradient(180deg, #000 1%, rgba(0, 0, 0, 0.00) 20%), 
                                      url(${imageUrl})`
                        }}
                    >
                        <div className={style.typo}>
                            <div className={style.heading}>{heading}</div>
                            <div className={style.description}>{description}</div>
                        </div>
                        {isEditable && <div className={style.editButton} onClick={(event) => openEditModal(event)}><span><img src={editButton} alt='editButton' /></span>Edit</div>}
                    </div>
                </div>
            </div>}
            {showEditModal && ( <AddStoryModel closeModalState={() => setShowEditModal(false)} postId={id} buttonName='Update'/> )}           
            {showEditModal && ( <AddStoryMobileModel closeModalState={() => setShowEditModal(false)} postId={id} buttonName='Update'/> )}            
            {showViewStoryModal && ( <ViewStoryModal closeModalState={() => setViewStoryModal(false)} postId={id} rawData={rawData}/> )}
        </>
    )
}

const Stories = ({category, title}) => {
    const [stories, setStories] = useState([]);
    const [isUserLoggedin] = useContext(LogContext);
    const [remainStoriesCount, setRemainStoriesCount] = useState(0);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Fetch initial stories when the component mounts
        fetchInitialStories();
    }, [isUserLoggedin]);

    

    const fetchInitialStories = async () => {
        const { success, data } = await fetchStoriesByCategory(category, page);

        if (success) {
            setLoading(false);
            setStories(data?.stories);
            setRemainStoriesCount(data?.remainStoriesCount);
            setPage(page + 1);
        } else {
            setLoading(false);
            console.error('Failed to fetch initial stories:', data?.error);
        }
    };

    const handleSeeMoreClick = async () => {
        setLoading(true)
        const { success, data } = await fetchStoriesByCategory(category, page);

        if (success) {
            setLoading(false)
            setStories((prevStories) => [...prevStories, ...data.stories]);
            setRemainStoriesCount(data.remainStoriesCount);
            setPage(page + 1);
        } else {
            setLoading(false)
            console.error('Failed to fetch more stories:', data?.error);
        }
    };

    return (
        <> 
            {loading ? <Loader/> : <><div className={style.yourStory}>{`Top Stories About ${title} `}</div>
                {stories.length<1 && <div className={style.nodata}>No stories Available</div>}
                <div className={style.main}>
                    {stories.map((story) => (
                        <StoryCards id={story._id} key={story._id}  imageUrl={story.slides[0].imageUrl} heading={story.slides[0].heading} description={story.slides[0].description} isEditable={story.isEditable} rawData={story} />
                    ))}
                </div>
                {remainStoriesCount > 0 && (
                    <div className={style.seeMoreButton} onClick={handleSeeMoreClick}>
                        See more
                    </div>
                )}</>}
        </>
    );
};

export default Stories;