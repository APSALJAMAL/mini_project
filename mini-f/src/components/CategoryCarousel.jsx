import React from 'react';
import { Button } from './ui/button';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setSearchedQuery } from '@/redux/jobSlice';

const category = [
    "Lease Agreement",
"Rental Contract",
"Tenancy Agreement",
"Lease Contract",
"Rental Lease",
"Property Lease",
"Lease Deed",
"Rental Agreement",
"Housing Agreement",
"Lease Terms",
"Tenant Agreement",
"Commercial Lease",
"Residential Lease",
"Lease Obligation",
"Lease Arrangement",
"Royalty Agreement",
"License Agreement",
"Royalty Contract",
"Intellectual Property Agreement",
"Revenue-Sharing Agreement",
"Licensing Contract",
"Copyright Agreement",
"Patent License Agreement",
"Music Royalty Agreement",
"Publishing Agreement",
"Trademark License Agreement",
"Royalty Payment Agreement",
"Franchise Agreement",
"Usage Rights Agreement",
"Profit-Sharing Agreement",
];

const CategoryCarousel = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const searchJobHandler = (query) => {
        dispatch(setSearchedQuery(query));
        navigate("/browse");
    };

    return (
        <div className="carousel-container overflow-hidden  mx-auto my-20">
            <div className="carousel-track flex whitespace-nowrap animate-scroll">
                {[...category, ...category].map((cat, index) => ( // Duplicate items for smooth loop
                    <div key={index} className="carousel-item flex-shrink-0 px-4">
                        <Button onClick={() => searchJobHandler(cat)} variant="outline" className="rounded-full">
                            {cat}
                        </Button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CategoryCarousel;
