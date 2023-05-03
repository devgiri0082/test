import Image from 'next/image';
import Link from 'next/link';
import React, { useState } from 'react';
import { AiOutlineCompass } from 'react-icons/ai';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { useQuery } from '@tanstack/react-query';

interface CardProps {
    user: {
        name: string;
        username: string;
        image: string;
        repoLink: string;
        contributions: number;
    };
}

const fetchUser = async (username: string) => {
    const res = await fetch(`https://api.github.com/users/${username}`);
    if (!res.ok) {
        throw new Error('Network response was not ok');
    }
    return res.json();
};

const Card: React.FC<CardProps> = ({ user }) => {
    const [showPopup, setShowPopup] = useState(false);
    const { isLoading, error, data: userData } = useQuery([user.username], () => fetchUser(user.username));
    const handleCompassClick = () => {
        setShowPopup(true);
    };

    return (
        <div className="w-64 bg-white shadow-lg rounded-lg overflow-hidden">
            <div className="flex items-center justify-between px-5 py-3">
                <div className='flex items-end text-xs gap-2'>
                    <Image
                        height={62}
                        width={62}
                        src={user.image}
                        className='border-4 border-blue-100'
                        alt={`Avatar of ${user.name}`}
                    />
                    <p className="text-gray-500 font-light">@{user.name}</p>
                </div>
                <button
                    title='location'
                    className="text-gray-300"
                    onClick={handleCompassClick}
                >
                    <AiOutlineCompass className='h-8 w-8 text-black' />
                </button>
            </div>
            <div className="px-5 py-3">
                <h3 className="font-bold text-lg">{user.name}</h3>
                <p className="font-light text-gray-500 text-sm">{user.contributions} commits</p>
            </div>
            <div className="px-5 py-3 grid place-content-center">
                <Link href={`/repositories?username=${user.username}`}>
                    <div
                        className="border-blue-500 border-2 rounded-lg text-sm hover:bg-blue-500 hover:text-white  text-blue-500 font-medium py-2 px-4"
                    >
                        VIEW REPOSITORIES
                    </div>
                </Link>
            </div>
        </div>
    );
};

export default Card;