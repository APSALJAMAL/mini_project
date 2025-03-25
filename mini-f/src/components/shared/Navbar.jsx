import React from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Button } from '../ui/button';
import { Avatar, AvatarImage } from '../ui/avatar';
import { LogOut } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { USER_API_END_POINT } from '@/utils/constant';
import { setUser } from '@/redux/authSlice';
import { toast } from 'sonner';

const Navbar = () => {
    const { user } = useSelector(store => store.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const logoutHandler = async () => {
        try {
            const res = await axios.get(`${USER_API_END_POINT}/logout`, { withCredentials: true });
            if (res.data.success) {
                dispatch(setUser(null));
                navigate("/");
                toast.success(res.data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response?.data?.message || "Logout failed");
        }
    };

    return (
        <div className='bg-white shadow-md'>
            <div className='flex items-center justify-between mx-auto max-w-7xl h-16 px-4'>
                {/* Logo / Branding */}
                <Link to="/" className="text-xl sm:text-xl font-bold text-gray-900">
                    REPULSO
                </Link>

                {/* Navigation Links */}
                <div className='flex items-center gap-8'>
                    <ul className='flex font-medium items-center gap-5 text-gray-700'>
                        <li><Link to="/">Home</Link></li>
                        <li><Link to="/jobs">Contract</Link></li>
                        <li><Link to="/browse">Browse</Link></li>
                        <li><Link to="/admin/companies">Company</Link></li>
                        <li><Link to="/admin/jobs">Buyer </Link></li>
                        <li><Link to="/profile">Profile</Link></li>
                    </ul>

                    {/* Auth / Profile Section */}
                    {!user ? (
                        <div className='flex items-center gap-2'>
                            <Link to="/login">
                                <Button variant="outline">Login</Button>
                            </Link>
                            <Link to="/signup">
                                <Button className="bg-[#6A38C2] hover:bg-[#5b30a6]">Signup</Button>
                            </Link>
                        </div>
                    ) : (
                        <Popover>
                            <PopoverTrigger asChild>
                                <Avatar className="cursor-pointer">
                                    <AvatarImage src={user?.profile?.profilePhoto} alt="User Profile" />
                                </Avatar>
                            </PopoverTrigger>
                            <PopoverContent className="w-80">
                                <div>
                                    <div className='flex gap-2 space-y-2'>
                                        <Avatar className="cursor-pointer">
                                            <AvatarImage src={user?.profile?.profilePhoto} alt="User Profile" />
                                        </Avatar>
                                        <div>
                                            <h4 className='font-medium'>{user?.fullname}</h4>
                                            <p className='text-sm text-gray-500'>{user?.profile?.bio}</p>
                                        </div>
                                    </div>
                                    <div className='flex flex-col my-2 text-gray-600'>
                                        <div className='flex w-fit items-center gap-2 cursor-pointer'>
                                            <LogOut />
                                            <Button onClick={logoutHandler} variant="link">Logout</Button>
                                        </div>
                                    </div>
                                </div>
                            </PopoverContent>
                        </Popover>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Navbar;
