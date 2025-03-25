import React, { useEffect, useState, useCallback } from 'react';
import Navbar from '../shared/Navbar';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import CompaniesTable from './CompaniesTable';
import { useNavigate } from 'react-router-dom';
import useGetAllCompanies from '@/hooks/useGetAllCompanies';
import { useDispatch } from 'react-redux';
import { setSearchCompanyByText } from '@/redux/companySlice';

const Companies = () => {
  // Fetch all companies using the custom hook
  useGetAllCompanies();

  // Local state for the search input
  const [input, setInput] = useState('');

  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Memoize the search dispatch logic
  const handleSearch = useCallback(() => {
    dispatch(setSearchCompanyByText(input));
  }, [dispatch, input]);

  // Trigger search action whenever input changes
  useEffect(() => {
    handleSearch();
  }, [handleSearch]);

  return (
    <div>
      <Navbar />
      <div className="max-w-6xl mx-auto my-10">
        <div className="flex items-center justify-between my-5">
          {/* Input for filtering companies */}
          <Input
            className="w-fit"
            placeholder="Filter by name"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          {/* Button to navigate to the create company page */}
          <Button onClick={() => navigate('/admin/companies/create')}  className="bg-violet-600 text-white w-36 my-4 hover:bg-violet-700 transition duration-300">
            New Company
          </Button>
        </div>
        {/* Table to display the list of companies */}
        <CompaniesTable />
      </div>
    </div>
  );
};

export default Companies;
