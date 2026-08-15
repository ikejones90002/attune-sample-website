import React, { useState } from 'react';
import './ProfileSwipe.css';

const profiles = [
  {
    id: 1,
    name: 'Alex Chen',
    age: 28,
    location: 'San Francisco',
    photo: '/image.png',
  },
  {
    id: 2,
    name: 'Jordan Smith',
    age: 32,
    location: 'Los Angeles',
    photo: '/image-2.jpg',
  },
];

const ProfileSwipe: React.FC = () => {
  const [currentProfileIndex, setCurrentProfileIndex] = useState(0);

  const handleLike = () => {
    console.log('Liked:', profiles[currentProfileIndex]);
    nextProfile();
  };

  const handlePass = () => {
    console.log('Passed:', profiles[currentProfileIndex]);
    nextProfile();
  };

  const nextProfile = () => {
    if (currentProfileIndex < profiles.length - 1) {
      setCurrentProfileIndex(prevIndex => prevIndex + 1);
    } else {
      setCurrentProfileIndex(0);
    }
  };

  const profile = profiles[currentProfileIndex];

  return (
    <div className="profile-swipe">
      <div className="profile-card" role="region" aria-label={`Profile of ${profile.name}`}>  
        <img src={profile.photo} alt={`${profile.name}'s profile photo`} />
        <h2>{profile.name}, {profile.age}</h2>
        <p>{profile.location}</p>
      </div>
      <div className="swipe-actions">
        <button onClick={handlePass} aria-label={`Pass on ${profile.name}`}>Pass</button>
        <button onClick={handleLike} aria-label={`Like ${profile.name}`}>Like</button>
      </div>
    </div>
  );
};

export default ProfileSwipe;