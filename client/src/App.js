import './App.css';
import { useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import Homepage from './pages/Homepage/Homepage';
import Bookmark from './pages/Bookmark/Bookmark';
import { Toaster } from 'react-hot-toast';
import LogContext from './Utilities/LogContext';
import CategoryContext from './Utilities/CategoryContext'
import IsMobileView from './Utilities/IsMobileView';
import LoginModalContext from './Utilities/LoginModalContext';
import ViewStoryModalViaLink from './components/Models/ViewStoryModalViaLink';

function App() {
  const [isUserLoggedin, setIsUserLoggedin] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [loginModal, setLoginModal] = useState(false);
  // console.log(IsMobileView());
  return (

    <>
      <LogContext.Provider value={[isUserLoggedin, setIsUserLoggedin]}>
        <CategoryContext.Provider value={[selectedCategory, setSelectedCategory]}>
        <LoginModalContext.Provider value={[loginModal, setLoginModal]}>
          <Routes>
            <Route path="/" element={<Homepage />} />
            <Route path="/bookmark" element={<Bookmark />} />
            <Route path="/view_story/:id" element={<ViewStoryModalViaLink/>} />
            {/* <Route path="/login" element={<Login />} />  */}
            {/* <Route path="/register" element={<Register />} /> */}
            {/* <Route path="/job_description/:id" element={<JobDescription />} />  */}
            {/* <Route path="*" element={<ErrorPage />} /> */}
          </Routes>
          <Toaster position="top-center" toastOptions={{ style: { width: "300px ", fontSize: "30px" } }} />
          </LoginModalContext.Provider>
        </CategoryContext.Provider>
      </LogContext.Provider>
    </>
  );
}

export default App;
