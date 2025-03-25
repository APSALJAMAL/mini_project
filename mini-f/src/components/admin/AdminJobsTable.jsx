import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Edit2, Eye, MoreHorizontal } from "lucide-react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const AdminJobsTable = () => {
  const { allAdminJobs, searchJobByText } = useSelector((store) => store.job);
  const { user } = useSelector((store) => store.auth);
  const [filterJobs, setFilterJobs] = useState(allAdminJobs);
  const navigate = useNavigate();

  useEffect(() => {
    const filteredJobs = allAdminJobs.filter((job) => {
      if (!searchJobByText) {
        return true;
      }
      return (
        job?.title?.toLowerCase().includes(searchJobByText.toLowerCase()) ||
        job?.company?.name.toLowerCase().includes(searchJobByText.toLowerCase())
      );
    });
    setFilterJobs(filteredJobs);
  }, [allAdminJobs, searchJobByText]);

  return (
    <div>
      <Table>
        <TableCaption>A list of your recently posted contracts</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Company</TableHead>
            <TableHead>Title</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Seller ID</TableHead>
            <TableHead>Contract Type</TableHead>
            <TableHead>Time Period</TableHead>
            <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filterJobs?.map((job) => {
            const [timeLeft, setTimeLeft] = useState("");

            useEffect(() => {
              if (!job?.position) return;

              const expirationDate = new Date();
              expirationDate.setDate(expirationDate.getDate() + job.position); // Add days

              const updateCountdown = () => {
                const now = new Date();
                const diff = expirationDate - now;

                if (diff <= 0) {
                  setTimeLeft("Expired");
                  return;
                }

                const years = Math.floor(diff / (1000 * 60 * 60 * 24 * 365));
                const months = Math.floor(
                  (diff % (1000 * 60 * 60 * 24 * 365)) /
                    (1000 * 60 * 60 * 24 * 30)
                );
                const days = Math.floor(
                  (diff % (1000 * 60 * 60 * 24 * 30)) / (1000 * 60 * 60 * 24)
                );
                const hours = Math.floor(
                  (diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
                );
                const minutes = Math.floor(
                  (diff % (1000 * 60 * 60)) / (1000 * 60)
                );
                const seconds = Math.floor((diff % (1000 * 60)) / 1000);

                setTimeLeft(
                  `${years}y/${months}m/${days}d/${hours}h/${minutes}m/${seconds}s`
                );
              };

              updateCountdown(); // Initialize countdown
              const interval = setInterval(updateCountdown, 1000); // Update every second

              return () => clearInterval(interval);
            }, [job?.position]);

            return (
              <TableRow key={job._id}>
                <TableCell>{job?.company?.name}</TableCell>
                <TableCell>{job?.title}</TableCell>
                <TableCell>{job?.createdAt.split("T")[0]}</TableCell>
                <TableCell>₹{job?.salary}</TableCell>
                <TableCell>{user?._id}</TableCell>
                <TableCell>{job?.jobType}</TableCell>
                <TableCell>
                  {job?.position} 
                </TableCell>

                <TableCell className="text-right cursor-pointer">
                  <Popover>
                    <PopoverTrigger>
                      <MoreHorizontal />
                    </PopoverTrigger>
                    <PopoverContent className="w-32 bg-gray-950 text-white">
                      <div
                        onClick={() => navigate(`/admin/companies/${job._id}`)}
                        className="flex items-center gap-2 w-fit cursor-pointer"
                      >
                        
                      </div>
                      <div
                        onClick={() =>
                          navigate(`/admin/jobs/${job._id}/applicants`)
                        }
                        className="flex items-center w-fit gap-2 cursor-pointer mt-2"
                      >
                        <Eye className="w-4" />
                        <span>Applicants</span>
                      </div>
                    </PopoverContent>
                  </Popover>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};

export default AdminJobsTable;
