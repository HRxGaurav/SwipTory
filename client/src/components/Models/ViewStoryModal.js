import React, { useState, useEffect, useContext } from "react";
import ReactDOM from 'react-dom';
import style from './ViewStoryModal.module.css';
import toast from "react-hot-toast";
import LogContext from '../../Utilities/LogContext.js'
import LoginModalContext from '../../Utilities/LoginModalContext.js'
import likeWhiteButton from '../../assets/icons/likeWhiteButton.svg';
import likeRedButton from '../../assets/icons/likeRedButton.svg';
import nextSlideButton from '../../assets/icons/nextSlideButton.svg';
import prevSlideButton from '../../assets/icons/prevSlideButton.svg';
import shareIcon from '../../assets/icons/shareIcon.svg';
import bookmark from '../../assets/icons/bookmark.svg';
import bookmarkBlueButton from '../../assets/icons/bookmarkBlueButton.svg';
import crossButton from '../../assets/icons/crossButton.svg';
import Cookies from "js-cookie";
import IsMobileView from '../../Utilities/IsMobileView.js'


const ViewStoryModal = ({ closeModalState, rawData }) => {

   
    const [currentStoryIndex, setCurrentStoryIndex] = useState(0);
    const [likeState, setLikeState] = useState([]);
    const [bookmarkState, setbookmarkState] = useState([]);
    const [progress, setProgress] = useState(0);
    const [isUserLoggedin] = useContext(LogContext);
    const [loginModal, setLoginModal] = useContext(LoginModalContext);
    const duration = 50000;
    const { bookmarks, slides, _id, addedBy, likes}=rawData
    const length = slides.length;

    const closeModal = () => {
        closeModalState(false);
    };

    useEffect(() => {
        setbookmarkState(bookmarks)
        setLikeState(likes);
    }, []);

     // Stop scrolling when modal is open
     useEffect(() => {
        const body = document.body;

        if (closeModalState) {
            body.style.overflow = 'hidden';
        } else {
            body.style.overflow = 'auto';
        }

        return () => {
            body.style.overflow = 'auto';
        };
    }, [closeModalState]);


  
    useEffect(() => {
        let intervalId;

        const startAnimation = () => {
            const increment = (100 / (duration / 1000)); 

            intervalId = setInterval(() => {
                setProgress((prevProgress) => {
                    if (prevProgress >= 100) {
                        clearInterval(intervalId);
                        if (currentStoryIndex < length - 1) {
                            nextSlide(); 
                            return 0; 
                        }else{

                            return 100; 
                        }
                    }
                    return prevProgress + increment;
                });
            }, 100);
        };

        startAnimation();

        return () => clearInterval(intervalId);
    }, [currentStoryIndex]);


    const nextSlide = () => {
        if (currentStoryIndex < length - 1) {
            setCurrentStoryIndex(currentStoryIndex + 1)
            setProgress(0);
        }
    };

    const prevSlide = () => {
        if (currentStoryIndex > 0) {
            setCurrentStoryIndex(currentStoryIndex - 1)
            setProgress(0);
        }
    };

    const Share = ()=>{
        navigator.clipboard.writeText(`${window.location.href}view_story/${_id}`)
            .then(() => {
                toast.success('Link copied to clipboard')
            })
            .catch(err => {
                console.error('Unable to copy text to clipboard', err);
            });
    }

    const toggleInteraction = async (interactionType) => {
        if (!isUserLoggedin) {
            setLoginModal(true);
            closeModal();
          return;
        }
    
        try {
          const storyId = _id;
          const response = await fetch(`${process.env.REACT_APP_BACKEND}/update_likes_bookmark`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: Cookies.get('token'),
            },
            body: JSON.stringify({ interactionType, storyId }),
          });
    
          if (response.ok) {
            const updatedStory = await response.json();
            setLikeState(updatedStory.story.likes);
            setbookmarkState(updatedStory.story.bookmarks);
          } else {
            // Handle errors if any
            console.error('Toggle Interaction request failed');
          }
        } catch (error) {
          console.error('Error during Toggle Interaction request:', error);
        }
      };
    
      const Like = () => {
        toggleInteraction('likes');
      };
    
      const Bookmark = () => {
        toggleInteraction('bookmarks');
      };




    return ReactDOM.createPortal(
        <>
        
            {!IsMobileView() ? <div className={style.modalBackground} >
                <img src={prevSlideButton} alt='prevSlideButton' style={{marginRight:"140px"}}  onClick={prevSlide} className={style.slideButton}/>
                <div className={style.modalContainer} >

                    <div className={style.progressBarFlex}>

                        {slides.map((_, index) => (
                            <div
                                key={index}
                                style={{
                                    flex: '1',
                                    height: '4px',
                                    background: `linear-gradient(to right, #fff ${index === currentStoryIndex ? progress : index > currentStoryIndex ? 0 : 100
                                        }%, rgba(217, 217, 217, 0.50) ${0}%)`,
                                }}
                            />
                        ))}

                    </div>
                    <div className={style.image} style={{
                        backgroundImage: `linear-gradient(0deg, #000 20%, rgba(0, 0, 0, 0.00) 40%),
                                      linear-gradient(180deg, #000 14%, rgba(0, 0, 0, 0.00) 30%), 
                                      url(${slides[currentStoryIndex].imageUrl})`,
                    }} />

                    <div onClick={closeModal}><img src={crossButton} alt="crossButton" className={style.crossButton} /></div>
                    <img onClick={Share} src={shareIcon} alt="shareIcon" className={style.shareIcon}/>

                    <div className={style.heading}>{slides[currentStoryIndex].heading}</div>
                    <div className={style.para}>{slides[currentStoryIndex].description}</div>
                    <img onClick={Bookmark} src={bookmarkState.includes(addedBy) ? bookmarkBlueButton : bookmark} alt="bookmark" className={style.bookmark}/>
                    <img onClick={Like} src={likeState.includes(addedBy) ? likeRedButton : likeWhiteButton} alt="likeWhiteButton" className={style.likeButton}/>
                    <div className={style.likeCount}> {likeState.length}</div>
                </div>
                        <img src={nextSlideButton} alt='nextSlideButton' style={{marginLeft:"140px"}} onClick={nextSlide} className={style.slideButton}/>
            </div>

            :


            <div className={style.modalBackgroundMobile} >
                <div src={prevSlideButton} alt='prevSlideButton'   onClick={prevSlide} className={style.nextSlide}></div>
                <div className={style.modalContainerMobile} >

                    <div className={style.progressBarFlex}>

                        {slides.map((_, index) => (
                            <div
                                key={index}
                                style={{
                                    flex: '1',
                                    height: '4px',
                                    background: `linear-gradient(to right, #fff ${index === currentStoryIndex ? progress : index > currentStoryIndex ? 0 : 100
                                        }%, rgba(217, 217, 217, 0.50) ${0}%)`,
                                }}
                            />
                        ))}

                    </div>
                    <div className={style.imageMobile} style={{
                        backgroundImage: `linear-gradient(0deg, #000 20%, rgba(0, 0, 0, 0.00) 40%),
                                      linear-gradient(180deg, #000 14%, rgba(0, 0, 0, 0.00) 30%), 
                                      url(${slides[currentStoryIndex].imageUrl})`,
                    }} />

                    <div onClick={closeModal}><img src={crossButton} alt="crossButton" className={style.crossButton} /></div>
                    <img onClick={Share} src={shareIcon} alt="shareIcon" className={style.shareIcon}/>

                    <div className={style.typoDiv}><div className={style.headingMobile}>{slides[currentStoryIndex].heading}</div>
                    <div className={style.paraMobile}>{slides[currentStoryIndex].description}</div></div>
                    <img onClick={Bookmark} src={bookmarkState.includes(addedBy) ? bookmarkBlueButton : bookmark} alt="bookmark" className={style.bookmark}/>
                    <img onClick={Like} src={likeState.includes(addedBy) ? likeRedButton : likeWhiteButton} alt="likeWhiteButton" className={style.likeButton}/>
                    <div className={style.likeCount}> {likeState.length}</div>
                </div>
                        <div src={nextSlideButton} alt='nextSlideButton' className={style.nextSlide} onClick={nextSlide} > </div>
            </div>}

        </>,
        document.getElementById('portal')
    );
}

export default ViewStoryModal;