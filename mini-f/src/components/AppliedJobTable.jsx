import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Badge } from './ui/badge';
import { useSelector } from 'react-redux';

const AppliedJobTable = () => {
    const { allAppliedJobs } = useSelector(store => store.job);
    const { user } = useSelector(store => store.auth);
    const [timeLeft, setTimeLeft] = useState({});

    useEffect(() => {
        const updateCountdown = () => {
            const newTimeLeft = {};
            allAppliedJobs.forEach((appliedJob) => {
                if (appliedJob.status === "accepted") {
                    const createdAt = new Date(appliedJob.createdAt);
                    const daysToComplete = appliedJob.job?.position || 0;
                    const endDate = new Date(createdAt);
                    endDate.setDate(endDate.getDate() + daysToComplete);

                    const now = new Date();
                    const timeDifference = endDate - now;

                    if (timeDifference > 0) {
                        const years = Math.floor(timeDifference / (1000 * 60 * 60 * 24 * 365));
                        const months = Math.floor((timeDifference % (1000 * 60 * 60 * 24 * 365)) / (1000 * 60 * 60 * 24 * 30));
                        const days = Math.floor((timeDifference % (1000 * 60 * 60 * 24 * 30)) / (1000 * 60 * 60 * 24));
                        const hours = Math.floor((timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                        const minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));
                        const seconds = Math.floor((timeDifference % (1000 * 60)) / 1000);

                        newTimeLeft[appliedJob._id] = `${years} y ${months} m ${days} d ${hours} hr ${minutes} min ${seconds} s`;
                    } else {
                        newTimeLeft[appliedJob._id] = "00/00/00 00:00:00";
                    }
                }
            });
            setTimeLeft(newTimeLeft);
        };

        updateCountdown();
        const interval = setInterval(updateCountdown, 1000);
        return () => clearInterval(interval);
    }, [allAppliedJobs]);

    return (
        <div>
            <Table>
                <TableCaption>A list of your applied Contracts</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Title</TableHead>
                        <TableHead>Company Name</TableHead>
                        <TableHead>Contract ID</TableHead>
                        <TableHead>Seller ID</TableHead>
                        <TableHead>Contract Type</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead>Time Left</TableHead>
                        <TableHead className="text-right">Status</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {allAppliedJobs.length <= 0 ? (
                        <span>You haven't applied for any Contract yet.</span>
                    ) : (
                        allAppliedJobs.map((appliedJob) => (
                            <TableRow key={appliedJob._id}>
                                <TableCell>{appliedJob?.createdAt?.split("T")[0]}</TableCell>
                                <TableCell>{appliedJob.job?.title}</TableCell>
                                <TableCell>{appliedJob.job?.company?.name}</TableCell>
                                <TableCell>
                                    <Link to={`/cagg/${appliedJob.job?._id}`} className="text-blue-500 hover:underline">
                                        {appliedJob.job?._id}
                                    </Link>
                                </TableCell>
                                <TableCell>{user?._id}</TableCell>
                                <TableCell>{appliedJob.job?.jobType}</TableCell>
                                <TableCell>₹{appliedJob.job?.salary}</TableCell>
                                <TableCell>{appliedJob.status === "accepted" ? timeLeft[appliedJob._id] || "Loading..." : "-"}</TableCell>
                                <TableCell className="text-right">
                                    <Badge className={`${appliedJob?.status === "rejected" ? 'bg-red-400' : appliedJob.status === 'pending' ? 'bg-gray-400' : 'bg-green-400'}`}>
                                        {appliedJob.status.toUpperCase()}
                                    </Badge>
                                </TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
        </div>
    );
};

export default AppliedJobTable;
