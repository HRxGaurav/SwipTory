import React, { useState, useEffect } from "react";
import ReactDOM from 'react-dom';
import { useNavigate } from 'react-router-dom';
import style from './AddStoryMobileModal.module.css';
import toast from 'react-hot-toast';
import createStory from "../../APIs/createStory";
import getStoryById from "../../APIs/getStoryById";
import editStory from "../../APIs/editStory";


const Slide = ({ slideCount, position, removeSlide, selectedSlide, clickOnSlide }) => {

  return (
    <>
      <div className={style.slideContainer} style={{
        border: selectedSlide === position ? "2px solid #73ABFF" : "none",
      }}>
        <div className={style.slideCountButton} onClick={() => { clickOnSlide(position) }} >{slideCount}</div>
        {(position > 2) && <div className={style.slideCrossButton} onClick={() => { removeSlide(selectedSlide) }}>x</div>}
      </div>
    </>
  )
}


const SlideForm = ({ slide, slideIndex, handleChange }) => {
  return (
    <>
      <div className={style.inputFields}>
        <div className={style.inputDiv}>
        <label className={`${style.heading} ${style.mainInputHeading}`}>Heading :</label><br />
          <input className={style.headingInput} name="heading" placeholder='Your heading' type="text" value={slide.heading} onChange={(e) => handleChange(e, slideIndex)}></input>
        </div>
        <div className={style.descriptionDiv}>
          <label className={style.descriptionTag}>Description :</label><br />
          <textarea className={style.descriptionInput} name="description" placeholder='Story Description' type="text" value={slide.description} onChange={(e) => handleChange(e, slideIndex)}></textarea>
        </div>
        <div className={style.imageDiv}>
          <label className={style.heading}>Image :</label><br />
          <input className={style.headingInput} name="imageUrl" placeholder='Add Image url' type="text" value={slide.imageUrl} onChange={(e) => handleChange(e, slideIndex)}></input>
        </div>
        <div className={style.categoryDiv}>
          <label className={style.heading}>Category :</label><br />
          <select className={style.headingInput} defaultValue="" required name="category" onChange={(e) => handleChange(e, slideIndex)} value={slide.category}>
            <option value="" disabled hidden>Select category</option>
            <option value="food">food</option>
            <option value="health_and_fitness">health and fitness</option>
            <option value="travel">travel</option>
            <option value="movies">movies</option>
            <option value="education">education</option>
          </select>
        </div>
      </div>
    </>
  )
}


const AddStoryMobileModel = ({ closeModalState, postId, buttonName }) => {

  const [currentSlide, setCurrentSlide] = useState(0);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const initialSlide = {
    heading: "",
    description: "",
    imageUrl: "",
    category: "",
  };

  const [slides, setSlides] = useState([
    initialSlide,
    initialSlide,
    initialSlide,
  ]);

  useEffect(() => {
    setCurrentSlide(currentSlide);
  }, [currentSlide]);

  useEffect(() => {
    if (slides.length > 6) {
      alert("Please remove slides");
    }
    if (slides.length < 3) {
      alert("Please add slides");
    }
  }, [slides]);

  useEffect(() => {
    // Fetch data when the component mounts
    if (postId) {
      getStoryById(postId, (result) => {
        if (result.success) {
          // Set the fetched data in the state
          const fetchedSlides = result.data.story.slides.map((slide) => ({
            heading: slide.heading,
            description: slide.description,
            imageUrl: slide.imageUrl,
            category: slide.category,
          }));
          setSlides(fetchedSlides);
        } else {
          console.error('Failed to fetch story data:', result.message);
        }
      });
    }
  }, [postId]);


  const handleValidate = (name, value) => {
    if (name === "category" && value === "") {
      setError("Please select a category");
    } else if (name === "imageUrl" && value == "") {
      setError("Please add an image url");
    } else if (name === "description" && value == "") {
      setError("Please add a description");
    } else if (name === "heading" && value == "") {
      setError("Please add a heading");
    } else {
      setError("");
    }
  };

  const handleChange = (e, index) => {
    const { name, value } = e.target;

    handleValidate(name, value);

    setSlides((prevSlides) =>
      prevSlides.map((slide, i) =>
        i === index ? { ...slide, [name]: value } : slide
      )
    );
  };


  const handleAddSlide = () => {
    if (slides.length < 6) {
      setSlides((prevSlides) => [...prevSlides, {}]);
      setCurrentSlide(slides.length);
    }
  };

  const handleRemoveSlide = (index) => {
    if (slides && slides.length > 3) {
      setSlides((prevSlides) => prevSlides.filter((_, i) => i !== index));
      handlePrevClick();
    }
  };


  const handlePrevClick = () => {
    setCurrentSlide(currentSlide > 0 ? currentSlide - 1 : 0);
  };

  const handleNextClick = () => {
    setCurrentSlide(
      currentSlide < slides.length - 1 ? currentSlide + 1 : slides.length - 1
    );
  };

  const handleContainerClick = (event) => {
    event.stopPropagation();
  };

  const closeModal = () => {
    closeModalState(false);
  };

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

  const PostStory = async () => {


    try {
      // Check validation in the slides
      const isValid = slides.some((slide, index) => {
        if (
          Object.keys(slide).length === 0 ||
          slide.heading?.trim() === "" ||
          slide.description?.trim() === "" ||
          slide.imageUrl?.trim() === "" ||
          slide.category?.trim() === ""
        ) {
          setError(slide, index);
        }
        return (
          Object.keys(slide).length === 0 ||
          slide.heading?.trim() === "" ||
          slide.description?.trim() === "" ||
          slide.imageUrl?.trim() === "" ||
          slide.category?.trim() === ""
        );
      });

      if (isValid) {
        setError("Please fill out all fields");
        return;
      }

      const result = await createStory(slides);

      if (result.success) {
        closeModalState(false);
        toast.success("Story created successfully");
      } else {
        console.error('Failed to create story:', result.error);
      }
    } catch (error) {
      console.log(error);
      toast.error("Error creating story");
    }
  };

  const UpdatePost = async () => {
    try {
      // Check validation in the slides
      const isValid = slides.some((slide, index) => {
        if (
          Object.keys(slide).length === 0 ||
          slide.heading?.trim() === "" ||
          slide.description?.trim() === "" ||
          slide.imageUrl?.trim() === "" ||
          slide.category?.trim() === ""
        ) {
          setError(slide, index);
        }
        return (
          Object.keys(slide).length === 0 ||
          slide.heading?.trim() === "" ||
          slide.description?.trim() === "" ||
          slide.imageUrl?.trim() === "" ||
          slide.category?.trim() === ""
        );
      });

      if (isValid) {
        setError("Please fill out all fields");
        return;
      }

      const result = await editStory(postId, slides);

      if (result.success) {
        closeModalState(false);
        toast.success("Story updated successfully");
      } else {
        console.error('Failed to update story:', result.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("Error updating story");
    }
  };

  return ReactDOM.createPortal(
    <>
      <div className={style.modalBackground} onClick={closeModal}>
        <div className={style.modalContainer} onClick={handleContainerClick}>
          <div className={style.crossButton} onClick={closeModal}>X</div>
          

          {/* ---------------------------------------------------select slide bar start-------------------------------------------------------------------------------- */}
          <div className={style.slideMain}>
            {slides.map((slide, index, arr) => (
              <Slide slideCount={`Slide ${index + 1}`} position={index} selectedSlide={currentSlide} removeSlide={handleRemoveSlide} clickOnSlide={setCurrentSlide} />
            ))}


            {slides.length < 6 && <div className={style.slideContainer}>
              <div className={style.slideCountButton} onClick={() => { handleAddSlide() }} >Add +</div>

            </div>}
          </div>
          {/* -----------------------------------------------------------------Slide form Start -----------------------------------------------------------------------*/}

          <div >
          <div className={style.mainHeading}>Add story to feed</div>
            {slides.map((slide, slideIndex) => (
              <>
                {slideIndex === currentSlide && (

                  <SlideForm
                    key={slideIndex}
                    slide={slide}
                    slideIndex={slideIndex}
                    handleChange={(e) => handleChange(e, slideIndex)}
                    handleRemoveSlide={() => handleRemoveSlide(slideIndex)}
                  />

                )}
              </>
            ))}

            <div className={style.actions}>
              <div className={style.errorText}>{error}</div>
              <div className={style.buttons}>


                <div className={style.postButton} onClick={buttonName === 'Post' ? PostStory : UpdatePost}>{buttonName}</div>
              </div>
            </div>

            {/* -----------------------------------------------------------------Silde form end -----------------------------------------------------------------------*/}
          </div>
        </div>
      </div>
    </>,
    document.getElementById('portal')
  );
}

export default AddStoryMobileModel;