import React from 'react'
import { AppString } from '../config/const'
import './welcome.css';

const WelcomeBox = () => {
    let currentUser = {
        id: localStorage.getItem(AppString.ID),
        avatar: localStorage.getItem(AppString.PHOTO_URL),
        nickname: localStorage.getItem(AppString.NICKNAME),
    }
    return (
        <div className="viewWelcomeBoard">
            <span className="textTitleWelcome">{`Welcome, ${
                currentUser.nickname
                }`}</span>
            <img
                className="avatarWelcome"
                src={currentUser.avatar}
                alt="icon avatar"
            />
            <span className="textDesciptionWelcome">
                Let's start talking. Great things might happen.
        </span>
        </div>
    )
}

export default WelcomeBox
