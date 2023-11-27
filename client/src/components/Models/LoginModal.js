import React, { useState, useEffect, useContext } from "react";
import ReactDOM from 'react-dom';
import Cookies from 'js-cookie';
import loginApi from "../../APIs/logInAPI";
import style from './LoginModal.module.css';
import openEye from '../../assets/icons/eye.png';
import closedEye from '../../assets/icons/closed-eyes.png';
import toast from "react-hot-toast";
import LogContext from '../../Utilities/LogContext.js'
import LoginModalContext from "../../Utilities/LoginModalContext.js";
import IsMobileView from '../../Utilities/IsMobileView.js'

const EyeIcons = ({ isPasswordVisible, togglePasswordVisibility }) => {
    return (
        <>
        {!IsMobileView() ? <div className={style.eyeIcons}>
            {isPasswordVisible ? (
                <img src={openEye} alt="Open Eye" className={style.openEye} onClick={togglePasswordVisibility} />
            ) : (
                <img src={closedEye} alt="Closed Eye" className={style.closeEye} onClick={togglePasswordVisibility} />
            )}
        </div>

        :


        <div className={style.eyeIconsMobile}>
            {isPasswordVisible ? (
                <img src={openEye} alt="Open Eye" className={style.openEye} onClick={togglePasswordVisibility} />
            ) : (
                <img src={closedEye} alt="Closed Eye" className={style.closeEye} onClick={togglePasswordVisibility} />
            )}
        </div>}

        </>
    );
};

function LoginModal({ closeModalState, closeModalMobileState}) {
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [formData, setFormData] = useState({ username: '', password: '' });
    const [showError, setShowError] = useState();
    const [isUserLoggedin , setIsUserLoggedin] = useContext(LogContext);
    const [loginModal, setLoginModal] = useContext(LoginModalContext);

    const handleContainerClick = (event) => {
        event.stopPropagation();
    };

    const closeModal = () => {
        closeModalState(false);
        setLoginModal(false);
        // closeModalMobileState(false)
    };

    const togglePasswordVisibility = () => {
        setIsPasswordVisible((prev) => !prev);
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

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const loginButton = async () => {
        const { username, password } = formData;
        setShowError()
        if(!username && !password){
            setShowError("Please fill all input");
            return;
        }
        const result = await loginApi(username, password);
    
        if (result.success) {
            setIsUserLoggedin(true);
            closeModal();
            toast.success("Login successfully")
          Cookies.set('token', result.data.token, { expires: 7 });
          Cookies.set('username', result.data.username, { expires: 7 });
          Cookies.set('id', result.data.id, { expires: 7 });
        } else {
          setShowError("Please enter valid username");
        }
      };


    return ReactDOM.createPortal(
        <>
            {!IsMobileView() ? <div className={style.modalBackground} onClick={closeModal}>
                <div className={style.modalContainer} onClick={handleContainerClick}>
                    <div className={style.crossButton} onClick={closeModal}>X</div>
                    <div className={style.heading}>Login to SwipTory</div>
                    <div className={style.inputFields}>
                        <div className={style.inputDiv}>
                            <label className={style.username}>UserName</label>
                            <input className={style.usernameInput} type="name" name="username" placeholder='Enter username' value={formData.username} onChange={handleChange}></input>
                        </div>

                        <div className={style.passwordDiv}>
                            <label className={style.password}>Password</label>
                            <input className={style.passwordInput} type={isPasswordVisible ? "text" : "password"} name="password" placeholder='Enter password' value={formData.password}  onChange={handleChange}  autoComplete='off'/>
                            <EyeIcons
                                isPasswordVisible={isPasswordVisible}
                                togglePasswordVisibility={togglePasswordVisibility}
                            />
                        </div>
                        {showError && <div className={style.invalidDetails}>{showError}</div>}
                        {showError &&<div className={style.invalidDetails}>{showError}</div>}
                    </div>
                    {<div className={style.loginButton} onClick={loginButton} >Login</div>}
                </div>
            </div>

            :


            <div className={style.modalBackground} onClick={closeModal}>
                <div className={style.modalContainerMobile} onClick={handleContainerClick}>
                    <div className={style.crossButtonMobile} onClick={closeModal}>X</div>
                    <div className={style.headingMobile}>Login to SwipTory</div>
                    <div className={style.inputFields}>
                        <div className={style.inputDiv}>
                            <label className={style.usernameMobile}>UserName</label>
                            <input className={style.usernameInputMobile} type="name" name="username" placeholder='Enter username' value={formData.username} onChange={handleChange}></input>
                        </div>

                        <div className={style.passwordDiv}>
                            <label className={style.passwordMobile}>Password</label>
                            <input className={style.passwordInputMobile} type={isPasswordVisible ? "text" : "password"} name="password" placeholder='Enter password' value={formData.password}  onChange={handleChange}  autoComplete='off'/>
                            <EyeIcons
                                isPasswordVisible={isPasswordVisible}
                                togglePasswordVisibility={togglePasswordVisibility}
                            />
                        </div>
                        {showError && <div className={style.invalidDetails}>{showError}</div>}
                        {showError &&<div className={style.invalidDetails}>{showError}</div>}
                    </div>
                    {<div className={style.loginButtonMobile} onClick={loginButton} >Login</div>}
                </div>
            </div>}
        </>,
        document.getElementById('portal')
    );
}

export default LoginModal;
