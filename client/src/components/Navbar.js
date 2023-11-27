import React, { useState, useContext, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import navbar from './Navbar.module.css'
import hamburger from '../assets/icons/hamburger.svg'
import userIcon from '../assets/icons/user.png'
import bookmarkIcon from '../assets/icons/bookmark.svg'
import LoginModal from './Models/LoginModal';
import RegisterModal from './Models/RegisterModal';
import AddStoryModel from './Models/AddStoryModel';
import AddStoryMobileModel from './Models/AddStoryMobileModel';
import LogContext from '../Utilities/LogContext';
import LoginModalContext from '../Utilities/LoginModalContext';
import toast from 'react-hot-toast';
import Cookies from 'js-cookie';
import checkLoggedin from '../APIs/checkLoggedin';
import Loader from './Models/Loader'
import IsMobileView from '../Utilities/IsMobileView';
import crossButton from '../assets/icons/crossBlackButton.svg'



const Navbar = () => {

    const [showProfile, setShowProfile] = useState(false);
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [showRegisterModal, setShowRegisterModal] = useState(false);
    const [showStoryPostModal, setShowStoryPostModal] = useState(false);
    const [loading, setLoading] = useState(true)
    const [isUserLoggedin, setIsUserLoggedin] = useContext(LogContext);
    const [loginModal, setLoginModal] = useContext(LoginModalContext);
    const [userName, setUserName] = useState("");
    const navigate = useNavigate();


    useEffect(() => {
        const checkLoggedIn = async () => {
            try {
                const userLoggedIn = await checkLoggedin();

                setIsUserLoggedin(userLoggedIn === 200);
                setUserName(Cookies.get('username'));
                setLoading(false)
            } catch (error) {
                setLoading(false)
                console.error('Error checking user login status:', error);
            }
        };

        checkLoggedIn();
    }, []);

    const logout = () => {
        setIsUserLoggedin(false);
        setShowProfile(false);
        Cookies.remove('token');
        Cookies.remove('username');
        Cookies.remove('id');
        toast.success('Logout Success!')
        navigate('/bookmark')
        navigate('/')
    }
    return (
        <>
            {!IsMobileView() ? <><div className={navbar.main}>
                <div className={navbar.header} onClick={() => (navigate('/'))}>SwipTory</div>

                <div className={navbar.buttons}>

                    {!isUserLoggedin && <><div className={navbar.register} onClick={() => { setShowRegisterModal(!showRegisterModal) }}> Register Now</div>
                        <div className={navbar.login} onClick={() => { setShowLoginModal(!showLoginModal) }}> Sign In </div></>}

                    {isUserLoggedin && <><div className={navbar.bookmark} onClick={() => (navigate('/bookmark'))}> <img src={bookmarkIcon} alt='bookmark' className={navbar.bookmarkIcon} />Bookmarks</div>
                        <div className={navbar.addStory} onClick={() => { setShowStoryPostModal(!showRegisterModal) }}> Add story</div>
                        <div><img src={userIcon} alt='userIcon' className={navbar.userIcon} /></div>
                        <div><img src={hamburger} alt='hamburger' className={navbar.hamburger} onClick={() => (setShowProfile(!showProfile))} /></div></>}


                </div>
            </div>
                {(showLoginModal || loginModal) && <LoginModal closeModalState={setShowLoginModal} />}
                {showRegisterModal && <RegisterModal closeModalState={setShowRegisterModal} />}
                {showStoryPostModal && <AddStoryModel closeModalState={setShowStoryPostModal} buttonName='Post' />}
                {showStoryPostModal && <AddStoryMobileModel closeModalState={setShowStoryPostModal} buttonName='Post' />}

                {showProfile && <div className={navbar.profileDiv}>
                {isUserLoggedin && <div className={navbar.userName}>{userName}</div>}
                {isUserLoggedin && <div className={navbar.logout} onClick={logout}>Logout</div>}
            </div>}
                {loading && <Loader />}</>

// ---------------------------------------------------------------------------mobile View code start-------------------------------------------------------------------------
                :


                <><div className={navbar.mainMobile}>
                    <div className={navbar.headerMobile} onClick={() => (navigate('/'))}>SwipTory</div>

                    <div className={navbar.buttons}>


                        <div><img src={hamburger} alt='hamburger' className={navbar.hamburger} onClick={() => (setShowProfile(!showProfile))} /></div>
                    </div>
                </div>

                {showProfile && <div className={navbar.profileDivMobile}>
                <img src={crossButton} alt='cross' className={navbar.crossButtonRegister} onClick={() => (setShowProfile(!showProfile))}/>
                    {!isUserLoggedin && <><div className={navbar.loginMobileRegister} onClick={() => { setShowLoginModal(!showLoginModal) }}> Login </div>
                        <div className={navbar.registerMobile} onClick={() => { setShowRegisterModal(!showRegisterModal) }}> Register</div></>}



                    {isUserLoggedin && <>
                        <img src={crossButton} alt='cross' className={navbar.crossButton} onClick={() => (setShowProfile(!showProfile))}/>
                        <div style={{ display: 'flex', marginTop:'-42px', alignItems:'start'}}><div><img src={userIcon} alt='userIcon' className={navbar.userIconMobile} /></div>
                            <div className={navbar.userName}>{userName}</div>
                        </div>

                        <div className={navbar.addStoryMobile} onClick={() => { setShowStoryPostModal(!showRegisterModal) }}> Your story</div>
                        <div className={navbar.bookmarkMobile} onClick={() => { setShowStoryPostModal(!showRegisterModal) }}> Add story</div>
                        <div className={navbar.bookmarkMobile} onClick={() => (navigate('/bookmark'))}> <img src={bookmarkIcon} alt='bookmark' className={navbar.bookmarkIcon} />Bookmarks</div>
                        <div className={navbar.logoutMobile} onClick={logout}>Logout</div>
                    </>}
                </div>}


                    {(showLoginModal || loginModal) && <LoginModal closeModalState={setShowLoginModal} closeModalMobileState={setShowProfile} />}
                    {showRegisterModal && <RegisterModal closeModalState={setShowRegisterModal} closeModalMobileState={setShowProfile} />}
                    {showStoryPostModal && <AddStoryModel closeModalState={setShowStoryPostModal} closeModalMobileState={setShowProfile} buttonName='Post' />}
                    {showStoryPostModal && <AddStoryMobileModel closeModalState={setShowStoryPostModal} closeModalMobileState={setShowProfile} buttonName='Post' />}
                    {loading && <Loader />}</>}
        </>
    )
}

export default Navbar