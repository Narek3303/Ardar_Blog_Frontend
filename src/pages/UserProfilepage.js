import React, { useEffect, useState } from "react";
import styled, { keyframes, css } from "styled-components";
import { Edit, Save, X, Trash2, User, Calendar, MapPin, Mail, Phone, Home, Lock, AtSign } from "react-feather";
import AxiosInstance from "../api/axiosInstance";
import { Link } from 'react-router-dom';
import Button from '@mui/material/Button';
import ConfirmModal from '../components/ConfirmModal';

// ======================
// ANIMATIONS
// ======================
const fadeIn = keyframes`
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
`;

const pulse = keyframes`
    0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.4); }
    70% { transform: scale(1.02); box-shadow: 0 0 0 10px rgba(59, 130, 246, 0); }
    100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(59, 130, 246, 0); }
`;

const gradientBG = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

// ======================
// STYLED COMPONENTS
// ======================
const ProfileContainer = styled.div`
    max-width: 900px;
    margin: 2rem auto;
    padding: 2.5rem;
    background: white;
    border-radius: 20px;
    box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1);
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
    color: #1f2937;
    animation: ${fadeIn} 0.6s ease-out;
    position: relative;
    overflow: hidden;

    &::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 8px;
        background: linear-gradient(90deg, #3b82f6, #8b5cf6, #ec4899, #3b82f6);
        background-size: 400% 400%;
        animation: ${gradientBG} 8s ease infinite;
    }
`;

const ProfileHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2rem;
    padding-bottom: 1.5rem;
    border-bottom: 1px solid rgba(0, 0, 0, 0.05);
    position: relative;
`;

const ProfileTitle = styled.h2`
    font-size: 2rem;
    font-weight: 800;
    margin: 0;
    color: #111827;
    position: relative;
    display: inline-block;
    background: linear-gradient(90deg, #3b82f6, #8b5cf6);
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
    letter-spacing: -0.5px;
`;

const AvatarContainer = styled.div`
    position: relative;
    transition: all 0.3s ease;

    &:hover {
        transform: translateY(-5px);
    }
`;

const AvatarImage = styled.div`
    width: 120px;
    height: 120px;
    border-radius: 50%;
    overflow: hidden;
    border: 4px solid white;
    box-shadow: 0 15px 30px rgba(0, 0, 0, 0.15);
    background: linear-gradient(135deg, #3b82f6, #8b5cf6);
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-size: 2.5rem;
    font-weight: 600;
    transition: all 0.3s ease;
    position: relative;

    &::after {
        content: '';
        position: absolute;
        inset: 0;
        border-radius: 50%;
        background: linear-gradient(135deg, rgba(255,255,255,0.3), transparent);
    }

    img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        position: relative;
        z-index: 1;
    }
`;

const ProfileDetails = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 1.5rem;
    margin-top: 2rem;
`;

const DetailItem = styled.div`
    display: flex;
    flex-direction: column;
    padding: 1.5rem;
    background: #f9fafb;
    border-radius: 12px;
    transition: all 0.3s ease;
    border-left: 4px solid #3b82f6;
    position: relative;
    overflow: hidden;

    &::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: linear-gradient(135deg, rgba(59, 130, 246, 0.05), transparent);
        opacity: 0;
        transition: opacity 0.3s ease;
    }

    &:hover {
        transform: translateY(-5px);
        box-shadow: 0 10px 20px rgba(0, 0, 0, 0.05);

        &::before {
            opacity: 1;
        }
    }
`;

const DetailLabel = styled.span`
    font-weight: 600;
    color: #6b7280;
    font-size: 0.85rem;
    margin-bottom: 0.75rem;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    display: flex;
    align-items: center;
    gap: 8px;

    svg {
        width: 16px;
        height: 16px;
        color: #3b82f6;
    }
`;

const DetailValue = styled.span`
    font-size: 1.1rem;
    color: #1f2937;
    font-weight: 500;
    line-height: 1.6;
`;

const ProfileActions = styled.div`
    grid-column: 1 / -1;
    display: flex;
    gap: 1rem;
    margin-top: 2rem;
    flex-wrap: wrap;
`;

const ActionButton = styled.button`
    padding: 0.875rem 1.75rem;
    border: none;
    border-radius: 10px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    gap: 10px;
    will-change: transform;
    font-size: 0.95rem;
    letter-spacing: 0.5px;

    svg {
        width: 18px;
        height: 18px;
    }

    &:hover {
        transform: translateY(-3px);
        box-shadow: 0 8px 15px rgba(0, 0, 0, 0.1);
    }

    &:active {
        transform: translateY(0);
    }
`;

const EditButton = styled(ActionButton)`
    background: linear-gradient(135deg, #3b82f6, #2563eb);
    color: white;
    box-shadow: 0 4px 6px rgba(59, 130, 246, 0.2);

    &:hover {
        background: linear-gradient(135deg, #2563eb, #1d4ed8);
        box-shadow: 0 8px 15px rgba(59, 130, 246, 0.3);
    }
`;

const DeactivateButton = styled(ActionButton)`
    background: transparent;
    color: #ef4444;
    border: 1px solid rgba(239, 68, 68, 0.3);
    transition: all 0.3s ease;

    &:hover {
        background: rgba(239, 68, 68, 0.05);
        border-color: rgba(239, 68, 68, 0.5);
        box-shadow: 0 8px 15px rgba(239, 68, 68, 0.1);
    }
`;

const ProfileForm = styled.form`
    display: flex;
    flex-direction: column;
    gap: 1.75rem;
    margin-top: 1.5rem;
`;

const FormRow = styled.div`
    display: flex;
    gap: 1.75rem;

    @media (max-width: 768px) {
        flex-direction: column;
        gap: 1rem;
    }
`;

const FormGroup = styled.div`
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
`;

const FormLabel = styled.label`
    font-weight: 600;
    color: #6b7280;
    font-size: 0.9rem;
    display: flex;
    align-items: center;
    gap: 8px;

    svg {
        width: 16px;
        height: 16px;
        color: #3b82f6;
    }
`;

const FormInput = styled.input`
    padding: 1rem 1.25rem;
    border: 1px solid #e5e7eb;
    border-radius: 10px;
    font-size: 1rem;
    transition: all 0.3s ease;
    background: #f9fafb;
    font-family: 'Inter', sans-serif;
    box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.05);

    &:focus {
        outline: none;
        border-color: #3b82f6;
        box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.2);
        background: white;
    }

    &::placeholder {
        color: #9ca3af;
        opacity: 0.7;
    }
`;

const FileUpload = styled.div`
    display: flex;
    align-items: center;
    gap: 1.5rem;
    margin-top: 0.5rem;
`;

const FileUploadLabel = styled.label`
    padding: 0.875rem 1.75rem;
    background: linear-gradient(135deg, #f9fafb, #f3f4f6);
    color: #4b5563;
    border-radius: 10px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    display: inline-flex;
    align-items: center;
    gap: 10px;
    border: 1px solid #e5e7eb;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);

    &:hover {
        background: linear-gradient(135deg, #f3f4f6, #e5e7eb);
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    }

    svg {
        width: 16px;
        height: 16px;
    }
`;

const FileUploadInput = styled.input`
    display: none;
`;

const ImagePreviewNotice = styled.span`
    font-size: 0.9rem;
    color: #10b981;
    font-weight: 600;
    display: flex;
    align-items: center;
    gap: 6px;

    &::before {
        content: '✓';
        color: #10b981;
        font-weight: bold;
    }
`;

const FormActions = styled.div`
    display: flex;
    gap: 1rem;
    margin-top: 2rem;
    padding-top: 2rem;
    border-top: 1px solid rgba(0, 0, 0, 0.05);
    flex-wrap: wrap;
`;

const SaveButton = styled(ActionButton)`
    background: linear-gradient(135deg, #10b981, #059669);
    color: white;
    box-shadow: 0 4px 6px rgba(16, 185, 129, 0.2);

    &:hover {
        background: linear-gradient(135deg, #059669, #047857);
        box-shadow: 0 8px 15px rgba(16, 185, 129, 0.3);
    }
`;

const CancelButton = styled(ActionButton)`
    background: transparent;
    color: #6b7280;
    border: 1px solid #e5e7eb;
    transition: all 0.3s ease;

    &:hover {
        background: #f9fafb;
        border-color: #d1d5db;
        box-shadow: 0 8px 15px rgba(0, 0, 0, 0.05);
    }
`;

const LoadingContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 300px;
    text-align: center;
    padding: 2rem;
`;

const Spinner = styled.div`
    width: 60px;
    height: 60px;
    border: 5px solid rgba(59, 130, 246, 0.2);
    border-top: 5px solid #3b82f6;
    border-radius: 50%;
    animation: ${pulse} 1.5s ease-in-out infinite;
    margin-bottom: 1.5rem;
`;

const StatusContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 300px;
    text-align: center;
    padding: 2rem;
`;

const StatusIcon = styled.div`
    font-size: 3.5rem;
    margin-bottom: 1.5rem;
    color: ${({ $error }) => ($error ? '#ef4444' : '#6b7280')};
    animation: ${pulse} 2s ease infinite;
`;

const StatusTitle = styled.h2`
    color: #1f2937;
    margin-bottom: 1rem;
    font-weight: 800;
    font-size: 1.8rem;
    background: ${({ $error }) => ($error ? 'linear-gradient(90deg, #ef4444, #dc2626)' : 'linear-gradient(90deg, #6b7280, #4b5563)')};
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
`;

const StatusMessage = styled.p`
    color: #6b7280;
    max-width: 400px;
    line-height: 1.6;
    font-size: 1.1rem;
`;

const ActionButtonsContainer = styled.div`
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  margin-top: 1.5rem;
`;

const GradientButton = styled(Button)`
  && {
    background: linear-gradient(135deg, #8b5cf6, #7c3aed);
    color: white;
    padding: 0.75rem 1.5rem;
    border-radius: 10px;
    font-weight: 600;
    text-transform: none;
    box-shadow: 0 4px 6px rgba(139, 92, 246, 0.2);
    transition: all 0.3s ease;
    letter-spacing: 0.5px;
    font-family: 'Inter', sans-serif;
    
    &:hover {
      background: linear-gradient(135deg, #7c3aed, #6d28d9);
      box-shadow: 0 8px 15px rgba(139, 92, 246, 0.3);
      transform: translateY(-2px);
    }
    
    &:active {
      transform: translateY(0);
    }
    
    svg {
      margin-right: 8px;
      width: 18px;
      height: 18px;
    }
  }
`;

// ======================
// COMPONENT
// ======================
const UserProfile = () => {
    const [profile, setProfile] = useState(null);
    const [editing, setEditing] = useState(false);
    const [formData, setFormData] = useState({});
    const [loading, setLoading] = useState(true);
    const [deactivated, setDeactivated] = useState(false);
    const [previewImage, setPreviewImage] = useState(null);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await AxiosInstance.get("/users/profile/me/");
                setProfile(response.data);
                setFormData(response.data);
                setLoading(false);
            } catch (err) {
                console.error("Failed to load profile", err);
                setLoading(false);
            }
        };

        fetchProfile();
    }, []);

    const handleUpdate = async (e) => {
        e.preventDefault();

        try {
            const data = new FormData();
            for (let key in formData) {
                if (formData[key] !== null && formData[key] !== undefined) {
                    data.append(key, formData[key]);
                }
            }

            const response = await AxiosInstance.put("/users/profile/me/", data, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            setProfile(response.data);
            setEditing(false);
            setPreviewImage(null);
            alert("Profile updated successfully!");
        } catch (err) {
            console.error("Update failed", err);
            alert("Update failed. Please try again.");
        }
    };

    const handleDeactivate = async () => {
        if (window.confirm("Are you sure you want to deactivate your account? This action cannot be undone.")) {
            try {
                await AxiosInstance.post("/users/profile/deactivate/");
                setDeactivated(true);
                alert("Account deactivated successfully.");
            } catch (err) {
                console.error("Deactivation failed", err);
                alert("Could not deactivate account. Please try again.");
            }
        }
    };

    const handleChange = (e) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData(prev => ({
                ...prev,
                avatar: file
            }));

            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewImage(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    if (loading) return (
        <LoadingContainer>
            <Spinner />
            <StatusMessage>Loading your profile...</StatusMessage>
        </LoadingContainer>
    );

    if (!profile) return (
        <StatusContainer>
            <StatusIcon $error>⚠️</StatusIcon>
            <StatusTitle $error>Profile Not Found</StatusTitle>
            <StatusMessage>We couldn't load your profile information.</StatusMessage>
        </StatusContainer>
    );

    if (deactivated) return (
        <StatusContainer>
            <StatusIcon>👋</StatusIcon>
            <StatusTitle>Account Deactivated</StatusTitle>
            <StatusMessage>Your account has been successfully deactivated.</StatusMessage>
            <StatusMessage>We're sorry to see you go.</StatusMessage>
        </StatusContainer>
    );

    return (
        <ProfileContainer>
            <ProfileHeader>
                <ProfileTitle>User Profile</ProfileTitle>
                <AvatarContainer>
                    {previewImage || profile.avatar_url ? (
                        <AvatarImage>
                            <img
                                src={previewImage || profile.avatar_url}
                                alt="Profile"
                            />
                        </AvatarImage>
                    ) : (
                        <AvatarImage>
                            {profile.first_name?.charAt(0)}{profile.last_name?.charAt(0)}
                        </AvatarImage>
                    )}
                </AvatarContainer>
            </ProfileHeader>

            {!editing ? (
                <>
                    <ProfileDetails>
                        <DetailItem>
                            <DetailLabel><User size={16} /> First Name</DetailLabel>
                            <DetailValue>{profile.first_name || 'Not specified'}</DetailValue>
                        </DetailItem>
                        <DetailItem>
                            <DetailLabel><User size={16} /> Last Name</DetailLabel>
                            <DetailValue>{profile.last_name || 'Not specified'}</DetailValue>
                        </DetailItem>
                        <DetailItem>
                            <DetailLabel><Mail size={16} /> Email</DetailLabel>
                            <DetailValue>{profile.user_email}</DetailValue>
                        </DetailItem>
                        <DetailItem>
                            <DetailLabel><Phone size={16} /> Phone</DetailLabel>
                            <DetailValue>{profile.phone_number || 'Not specified'}</DetailValue>
                        </DetailItem>
                        <DetailItem>
                            <DetailLabel><MapPin size={16} /> Postal Code</DetailLabel>
                            <DetailValue>{profile.postal_code || 'Not specified'}</DetailValue>
                        </DetailItem>
                        <DetailItem>
                            <DetailLabel><Calendar size={16} /> Birth Date</DetailLabel>
                            <DetailValue>
                                {profile.birth_date ? new Date(profile.birth_date).toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                }) : 'Not specified'}
                            </DetailValue>
                        </DetailItem>
                        <DetailItem>
                            <DetailLabel><MapPin size={16} /> Country</DetailLabel>
                            <DetailValue>{profile.country || 'Not specified'}</DetailValue>
                        </DetailItem>
                        <DetailItem>
                            <DetailLabel><MapPin size={16} /> City</DetailLabel>
                            <DetailValue>{profile.city || 'Not specified'}</DetailValue>
                        </DetailItem>
                        <DetailItem>
                            <DetailLabel><Home size={16} /> Address</DetailLabel>
                            <DetailValue>{profile.address || 'Not specified'}</DetailValue>
                        </DetailItem>
                        <DetailItem>
                            <DetailLabel><Calendar size={16} /> Member Since</DetailLabel>
                            <DetailValue>
                                {new Date(profile.created_at).toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                })}
                            </DetailValue>
                        </DetailItem>
                    </ProfileDetails>

                    <ProfileActions>
                        <EditButton onClick={() => setEditing(true)}>
                            <Edit size={16} />
                            Edit Profile
                        </EditButton>
                        <DeactivateButton onClick={handleDeactivate}>
                            <Trash2 size={16} />
                            Deactivate Account
                        </DeactivateButton>
                    </ProfileActions>
                </>
            ) : (
                <ProfileForm onSubmit={handleUpdate}>
                    <FormRow>
                        <FormGroup>
                            <FormLabel><User size={16} /> First Name</FormLabel>
                            <FormInput
                                name="first_name"
                                value={formData.first_name || ""}
                                onChange={handleChange}
                                placeholder="Enter your first name"
                            />
                        </FormGroup>
                        <FormGroup>
                            <FormLabel><User size={16} /> Last Name</FormLabel>
                            <FormInput
                                name="last_name"
                                value={formData.last_name || ""}
                                onChange={handleChange}
                                placeholder="Enter your last name"
                            />
                        </FormGroup>
                    </FormRow>

                    <FormGroup>
                        <FormLabel>Profile Picture</FormLabel>
                        <FileUpload>
                            <FileUploadLabel>
                                <Edit size={16} />
                                Choose a file
                                <FileUploadInput
                                    type="file"
                                    name="avatar"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                />
                            </FileUploadLabel>
                            {previewImage && (
                                <ImagePreviewNotice>Image selected</ImagePreviewNotice>
                            )}
                        </FileUpload>
                    </FormGroup>

                    <FormRow>
                        <FormGroup>
                            <FormLabel><Phone size={16} /> Phone Number</FormLabel>
                            <FormInput
                                name="phone_number"
                                value={formData.phone_number || ""}
                                onChange={handleChange}
                                placeholder="Enter your phone number"
                            />
                        </FormGroup>
                        <FormGroup>
                            <FormLabel><MapPin size={16} /> Postal Code</FormLabel>
                            <FormInput
                                name="postal_code"
                                value={formData.postal_code || ""}
                                onChange={handleChange}
                                placeholder="Enter your postal code"
                            />
                        </FormGroup>
                    </FormRow>

                    <FormRow>
                        <FormGroup>
                            <FormLabel><Calendar size={16} /> Birth Date</FormLabel>
                            <FormInput
                                type="date"
                                name="birth_date"
                                value={formData.birth_date || ""}
                                onChange={handleChange}
                            />
                        </FormGroup>
                        <FormGroup>
                            <FormLabel><MapPin size={16} /> Country</FormLabel>
                            <FormInput
                                name="country"
                                value={formData.country || ""}
                                onChange={handleChange}
                                placeholder="Enter your country"
                            />
                        </FormGroup>
                    </FormRow>

                    <FormRow>
                        <FormGroup>
                            <FormLabel><MapPin size={16} /> City</FormLabel>
                            <FormInput
                                name="city"
                                value={formData.city || ""}
                                onChange={handleChange}
                                placeholder="Enter your city"
                            />
                        </FormGroup>
                        <FormGroup>
                            <FormLabel><Home size={16} /> Address</FormLabel>
                            <FormInput
                                name="address"
                                value={formData.address || ""}
                                onChange={handleChange}
                                placeholder="Enter your address"
                            />
                        </FormGroup>
                    </FormRow>

                    <FormActions>
                        <SaveButton type="submit">
                            <Save size={16} />
                            Save Changes
                        </SaveButton>
                        <CancelButton
                            type="button"
                            onClick={() => {
                                setEditing(false);
                                setPreviewImage(null);
                            }}
                        >
                            <X size={16} />
                            Cancel
                        </CancelButton>

                        <ActionButtonsContainer>
                            <GradientButton
                                variant="contained"
                                component={Link}
                                to="/change-password"
                                startIcon={<Lock size={16} />}
                            >
                                Change Password
                            </GradientButton>

                            <GradientButton
                                variant="contained"
                                component={Link}
                                to="/change-email"
                                startIcon={<AtSign size={16} />}
                            >
                                Change Email
                            </GradientButton>
                        </ActionButtonsContainer>
                    </FormActions>
                </ProfileForm>
            )}
        </ProfileContainer>
    );
};

export default UserProfile;