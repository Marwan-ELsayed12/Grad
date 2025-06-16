import React, { useState, useEffect } from 'react';
import { userService } from '../api/userService';
import { dataService } from '../api/dataService';
import { toast } from 'react-toastify';

const ExampleComponent = () => {
    const [userProfile, setUserProfile] = useState(null);
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(false);

    // Fetch user profile
    const fetchUserProfile = async () => {
        try {
            setLoading(true);
            const profile = await userService.getProfile();
            setUserProfile(profile);
        } catch (error) {
            toast.error('Failed to fetch user profile');
            console.error('Error fetching profile:', error);
        } finally {
            setLoading(false);
        }
    };

    // Fetch items
    const fetchItems = async () => {
        try {
            setLoading(true);
            const data = await dataService.getAllItems();
            setItems(data);
        } catch (error) {
            toast.error('Failed to fetch items');
            console.error('Error fetching items:', error);
        } finally {
            setLoading(false);
        }
    };

    // Update user profile
    const handleUpdateProfile = async (profileData) => {
        try {
            setLoading(true);
            const updatedProfile = await userService.updateProfile(profileData);
            setUserProfile(updatedProfile);
            toast.success('Profile updated successfully');
        } catch (error) {
            toast.error('Failed to update profile');
            console.error('Error updating profile:', error);
        } finally {
            setLoading(false);
        }
    };

    // Create new item
    const handleCreateItem = async (itemData) => {
        try {
            setLoading(true);
            const newItem = await dataService.createItem(itemData);
            setItems(prevItems => [...prevItems, newItem]);
            toast.success('Item created successfully');
        } catch (error) {
            toast.error('Failed to create item');
            console.error('Error creating item:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUserProfile();
        fetchItems();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <h2>User Profile</h2>
            {userProfile && (
                <div>
                    <p>Name: {userProfile.name}</p>
                    <p>Email: {userProfile.email}</p>
                    {/* Add more profile information as needed */}
                </div>
            )}

            <h2>Items</h2>
            <div>
                {items.map(item => (
                    <div key={item.id}>
                        <h3>{item.name}</h3>
                        <p>{item.description}</p>
                        {/* Add more item information as needed */}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ExampleComponent; 