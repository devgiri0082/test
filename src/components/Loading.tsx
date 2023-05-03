import React from 'react';

const LoadingSpinner: React.FC = () => {
    return (
        <div className="bg-gray-100 shadow rounded-md p-4 w-screen mx-auto">
            <div className="animate-pulse flex space-x-4  ">
                <div className="flex-1 space-y-4 py-1 grid place-items-center  ">
                    <div className="h-4  bg-blue-400 rounded w-3/4"></div>
                </div>
            </div>
        </div>
    );
};

export default LoadingSpinner;