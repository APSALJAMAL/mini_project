import React, { useEffect, useState } from 'react';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Label } from './ui/label';
import { useDispatch } from 'react-redux';
import { setSearchedQuery } from '@/redux/jobSlice';

const fitlerData = [
  {
    fitlerType: "Location",
    array: ["Delhi NCR", "Bangalore", "Hyderabad", "Pune", "Mumbai"],
  },
  {
    fitlerType: "Contract",
    array: ["Lease Agreement",
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
"Profit-Sharing Agreement",],
  },
  {
    fitlerType: "Price",
    array: ["0 - 40 k", "42 k - 1 lakh", "1 lakh - 5 lakhs"],
  },
];

const FilterCard = () => {
  const [selectedValue, setSelectedValue] = useState('');
  const dispatch = useDispatch();

  const changeHandler = (value) => {
    setSelectedValue(value);
  };

  useEffect(() => {
    dispatch(setSearchedQuery(selectedValue));
  }, [selectedValue, dispatch]);

  return (
    <div className="w-full bg-white p-3 rounded-md">
      <h1 className="font-bold text-lg">Filter Contract</h1>
      <hr className="mt-3" />
      <RadioGroup value={selectedValue} onValueChange={changeHandler}>
        {fitlerData.map((data, index) => (
          <div key={`filter-${index}`}>
            <h1 className="font-bold text-lg">{data.fitlerType}</h1>
            {data.array.map((item, idx) => {
              const itemId = `id${index}-${idx}`;
              return (
                <div className="flex items-center space-x-2 my-2" key={`item-${index}-${idx}`}>
                  <RadioGroupItem value={item} id={itemId} />
                  <Label htmlFor={itemId}>{item}</Label>
                </div>
              );
            })}
          </div>
        ))}
      </RadioGroup>
    </div>
  );
};

export default FilterCard;
