import { setCompanies } from '@/redux/companySlice';
import { COMPANY_API_END_POINT } from '@/utils/constant';
import axios from 'axios';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';

const useGetAllCompanies = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    let isMounted = true; // To prevent state updates on unmounted components.

    const fetchCompanies = async () => {
      try {
        console.log('API called to fetch companies');
        const res = await axios.get(`${COMPANY_API_END_POINT}/get`, { withCredentials: true });

        if (isMounted && res.data.success) {
          dispatch(setCompanies(res.data.companies));
        } else if (isMounted) {
          console.error("Failed to fetch companies: ", res.data.message);
        }
      } catch (error) {
        if (isMounted) {
          console.error("Error fetching companies: ", error.message);
        }
      }
    };

    fetchCompanies();

    return () => {
      isMounted = false; // Cleanup to prevent memory leaks.
    };
  }, [dispatch]); // Ensure the effect runs only when `dispatch` changes.
};

export default useGetAllCompanies;
