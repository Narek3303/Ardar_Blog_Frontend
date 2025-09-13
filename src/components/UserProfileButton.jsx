import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import AxiosInstance from "../api/axiosInstance";
import LogoutComponent from "./LogoutComponent";



const UserProfileButton = () => {
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isOpen, setIsOpen] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchUserProfile = async () => {
            const token = localStorage.getItem("access_token");
            if (!token) {
                setLoading(false);
                return;
            }

            try {
                const response = await AxiosInstance.get("/users/profile/me/");
                setUserData(response.data);
            } catch (err) {
                console.error("Failed to load profile", err);
                setError("Failed to load profile data");
            } finally {
                setLoading(false);
            }
        };

        fetchUserProfile();
    }, []);

    const toggleDropdown = () => {
        setIsOpen(prev => !prev);
    };

    const closeDropdown = () => {
        setIsOpen(false);
    };

    const getInitials = () => {
        if (!userData) return "U"; // Default to "U" for User
        const firstInitial = userData.first_name?.charAt(0) || "";
        const lastInitial = userData.last_name?.charAt(0) || "";
        return `${firstInitial}${lastInitial}`.toUpperCase() || "U";
    };

    const getUserName = () => {
        if (!userData) return "User";
        return `${userData.first_name || ''} ${userData.last_name || ''}`.trim() || "User";
    };

    const getUserEmail = () => {
        if (!userData) return "";
        return userData.email || userData.user_email || "";
    };

    if (loading) {
        return (
            <div className="profile-button">
                <div className="avatar-placeholder loading"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="profile-button error">
                <div className="avatar-placeholder error">!</div>
            </div>
        );
    }

    return (
        <div className="profile-button-container">
            <button
                className={`profile-button ${isOpen ? 'active' : ''}`}
                onClick={toggleDropdown}
                aria-expanded={isOpen}
                aria-label="User profile menu"
                aria-haspopup="true"
            >
                {userData?.avatar_url ? (
                    <img
                        src={userData.avatar_url}
                        alt="Profile"
                        className="avatar-image"
                        onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.nextElementSibling.style.display = 'flex';
                        }}
                    />
                ) : null}
                <div className={`avatar-placeholder ${userData?.avatar_url ? 'fallback' : ''}`}>
                    {getInitials()}
                </div>
                <span className="profile-name">
                    {getUserName()}
                </span>
                <svg
                    className={`dropdown-icon ${isOpen ? 'open' : ''}`}
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                >
                    <path
                        fillRule="evenodd"
                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                        clipRule="evenodd"
                    />
                </svg>
            </button>

            {isOpen && (
                <div
                    className="profile-dropdown"
                    onMouseLeave={closeDropdown}
                >
                    <div className="dropdown-header">
                        <div className="dropdown-avatar">
                            {userData?.avatar_url ? (
                                <img
                                    src={userData.avatar_url}
                                    alt="Profile"
                                    className="avatar-image"
                                    onError={(e) => {
                                        e.target.style.display = 'none';
                                        e.target.nextElementSibling.style.display = 'flex';
                                    }}
                                />
                            ) : null}
                            <div className={`avatar-placeholder ${userData?.avatar_url ? 'fallback' : ''}`}>
                                {getInitials()}
                            </div>
                        </div>
                        <div className="user-info">
                            <div className="user-name">
                                {getUserName()}
                            </div>
                            <div className="user-email">{getUserEmail()}</div>
                        </div>
                    </div>

                    <div className="dropdown-menu">
                        <Link
                            to="/profile"
                            className="dropdown-item"
                            onClick={closeDropdown}
                            aria-label="Go to profile"
                        >
                            <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                            </svg>
                            My Profile
                        </Link>

                        <Link
                            to="/settings"
                            className="dropdown-item"
                            onClick={closeDropdown}
                            aria-label="Go to settings"
                        >
                            <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                            </svg>
                            Settings
                        </Link>

                        <div className="dropdown-divider"></div>

                        <LogoutComponent onLogout={closeDropdown} />
                    </div>
                </div>
            )}
        </div>
    );
};



// CSS Styles
const styles = `
.profile-button-container {
  position: relative;
  display: inline-block;
}

.profile-button {
  display: flex;
  align-items: center;
  gap: 10px;
  background: none;
  border: none;
  padding: 6px 12px;
  border-radius: 50px;
  cursor: pointer;
  transition: all 0.2s ease;
  background-color: rgba(255, 255, 255, 0.1);
  position: relative;
}

.profile-button:hover {
  background-color: rgba(255, 255, 255, 0.2);
}

.profile-button.active {
  background-color: rgba(255, 255, 255, 0.2);
}

.avatar-image {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid rgba(255, 255, 255, 0.3);
}

.avatar-placeholder {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #4299e1, #3182ce);
  color: white;
  font-weight: 600;
  border: 2px solid rgba(255, 255, 255, 0.3);
}

.avatar-placeholder.fallback {
  display: none;
  background: linear-gradient(135deg, #667eea, #764ba2);
}

.avatar-placeholder.loading {
  background: #e2e8f0;
  animation: pulse 1.5s infinite;
}

.avatar-placeholder.error {
  background: #e53e3e;
  animation: none;
}

@keyframes pulse {
  0%, 100% { opacity: 0.6; }
  50% { opacity: 0.3; }
}

.profile-name {
  color: white;
  font-weight: 500;
  font-size: 0.95rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 120px;
}

.dropdown-icon {
  width: 16px;
  height: 16px;
  transition: transform 0.2s ease;
  flex-shrink: 0;
}

.dropdown-icon.open {
  transform: rotate(180deg);
}

.profile-dropdown {
  position: absolute;
  right: 0;
  top: 100%;
  margin-top: 8px;
  width: 280px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  overflow: hidden;
  animation: fadeIn 0.15s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
}

.dropdown-header {
  display: flex;
  align-items: center;
  padding: 16px;
  background: linear-gradient(135deg, #4299e1, #3182ce);
  color: white;
}

.dropdown-avatar {
  position: relative;
}

.dropdown-avatar .avatar-image,
.dropdown-avatar .avatar-placeholder {
  width: 48px;
  height: 48px;
  border-color: rgba(255, 255, 255, 0.5);
}

.dropdown-avatar .avatar-placeholder.fallback {
  display: none;
  background: linear-gradient(135deg, #667eea, #764ba2);
}

.user-info {
  margin-left: 12px;
  overflow: hidden;
}

.user-name {
  font-weight: 600;
  font-size: 1rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.user-email {
  font-size: 0.85rem;
  opacity: 0.9;
  margin-top: 2px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.dropdown-menu {
  padding: 8px 0;
}

.dropdown-item {
  display: flex;
  align-items: center;
  padding: 10px 16px;
  color: #4a5568;
  text-decoration: none;
  transition: all 0.15s ease;
  font-size: 0.95rem;
}

.dropdown-item svg {
  width: 18px;
  height: 18px;
  margin-right: 12px;
  color: #718096;
  flex-shrink: 0;
}

.dropdown-item:hover {
  background: #f7fafc;
  color: #2d3748;
}

.dropdown-item:hover svg {
  color: #4299e1;
}

.dropdown-item.logout {
  color: #e53e3e;
}

.dropdown-item.logout:hover {
  background: #fff5f5;
}

.dropdown-item.logout svg {
  color: #e53e3e;
}

.dropdown-divider {
  height: 1px;
  background: #edf2f7;
  margin: 8px 0;
}

.login-button {
  display: inline-block;
  padding: 8px 16px;
  background: #4299e1;
  color: white;
  border-radius: 6px;
  text-decoration: none;
  font-weight: 500;
  transition: all 0.2s ease;
  white-space: nowrap;
}

.login-button:hover {
  background: #3182ce;
  transform: translateY(-1px);
}

@media (max-width: 768px) {
  .profile-name {
    display: none;
  }
  
  .profile-button {
    padding: 6px;
  }
  
  .profile-dropdown {
    width: 240px;
  }
}
`;

// Inject styles into the document head
const styleSheet = document.createElement("style");
styleSheet.type = "text/css";
styleSheet.innerText = styles;
document.head.appendChild(styleSheet);

export default UserProfileButton;
