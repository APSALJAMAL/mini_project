import React, { useEffect, useState, useRef } from "react";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { useParams } from "react-router-dom";
import axios from "axios";
import { APPLICATION_API_END_POINT, JOB_API_END_POINT } from "@/utils/constant";
import { setSingleJob } from "@/redux/jobSlice";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import Navbar from "./shared/Navbar";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const JobDescription = () => {
  const { singleJob } = useSelector((store) => store.job);
  const { user } = useSelector((store) => store.auth);
  const params = useParams();
  const jobId = params.id;
  const dispatch = useDispatch();
  const contractRef = useRef(null);

  const isIntiallyApplied =
    singleJob?.applications?.some(
      (application) => application.applicant === user?._id
    ) || false;
  const [isApplied, setIsApplied] = useState(isIntiallyApplied);

  const applyJobHandler = async () => {
    try {
      const res = await axios.get(
        `${APPLICATION_API_END_POINT}/apply/${jobId}`,
        { withCredentials: true }
      );

      if (res.data.success) {
        setIsApplied(true);
        const updatedSingleJob = {
          ...singleJob,
          applications: [...singleJob.applications, { applicant: user?._id }],
        };
        dispatch(setSingleJob(updatedSingleJob));
        toast.success(res.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
    }
  };

  useEffect(() => {
    const fetchSingleJob = async () => {
      try {
        const res = await axios.get(`${JOB_API_END_POINT}/get/${jobId}`, {
          withCredentials: true,
        });
        if (res.data.success) {
          dispatch(setSingleJob(res.data.job));
          setIsApplied(
            res.data.job.applications.some(
              (application) => application.applicant === user?._id
            )
          );
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchSingleJob();
  }, [jobId, dispatch, user?._id]);

  const downloadContract = () => {
    const input = contractRef.current;
    html2canvas(input).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const imgWidth = 190;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      pdf.addImage(imgData, "PNG", 10, 10, imgWidth, imgHeight);
      pdf.save(`Contract_${singleJob?.title}.pdf`);
    });
  };

  return (
    <div>
      <Navbar />
      <div className="max-w-7xl mx-auto my-10 px-10">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-bold text-xl">{singleJob?.title}</h1>
            <div className="flex items-center gap-2 mt-4">
              <Badge className={"text-blue-700 font-bold"} variant="ghost">
                {singleJob?.position ? `${singleJob.position} Days` : "N/A"}
              </Badge>
              <Badge className={"text-[#F83002] font-bold"} variant="ghost">
                {singleJob?.jobType}
              </Badge>
              <Badge className={"text-[#7209b7] font-bold"} variant="ghost">
                ₹ {singleJob?.salary}
              </Badge>
            </div>
          </div>
          <div className="flex flex-col gap-4">
  <Button
    onClick={isApplied ? null : applyJobHandler}
    disabled={isApplied}
    className={`rounded-lg ${
      isApplied
        ? "bg-gray-600 cursor-not-allowed"
        : "bg-[#7209b7] hover:bg-[#5f32ad] text-white"
    }`}
  >
    {isApplied ? "Already Applied" : "Apply Now"}
  </Button>
  <Button
    onClick={downloadContract}
    className="bg-[#7209b7] hover:bg-[#7209b7] text-white"
  >
    Download Contract
  </Button>
</div>

        
          </div>
        </div>
        

        <div ref={contractRef} className="max-w-3xl mx-auto my-10 p-10 border border-gray-300 bg-white shadow-md rounded-lg text-gray-900 font-serif">
          <h1 className="text-center text-2xl font-bold uppercase underline mb-6">
            Contract Details
          </h1>

          <p className="text-right text-sm italic mb-4">
            Date: {singleJob?.createdAt?.split("T")[0]}
          </p>

          <p className="mb-4">
            This Contract Details is  between {" "} seller ( {" "}
            <strong>{user?._id}</strong>  ) and buyer ( <strong>{singleJob?.company || "Company Name"}</strong>) {" "}
            .
          </p>

          <div className="mb-6">
            <p className="font-bold">Contract Details:</p>
            <ul className="list-none pl-4">
              <li><strong>Contract ID:</strong> {singleJob?._id}</li>
              <li><strong>Title:</strong> {singleJob?.title}</li>
              <li><strong>Job Type:</strong> {singleJob?.jobType}</li>
              <li><strong>Location:</strong> {singleJob?.location}</li>
              <li><strong>Time Period:</strong> {singleJob?.position ? `${singleJob.position} Days` : "N/A"}</li>
              <li><strong>Price:</strong> ₹ {singleJob?.salary}</li>
              <li><strong>Total Buyers:</strong> {singleJob?.applications?.length}</li>
            </ul>
          </div>

          <div className="mb-6">
            <p className="font-bold">Job Description:</p>
            <p className="pl-4 text-gray-700">{singleJob?.description}</p>
          </div>

          <div className="mb-6">
            <p className="font-bold">Requirements:</p>
            <p className="pl-4 text-gray-700">{singleJob?.requirements}</p>
          </div>

          <p className="mt-6">
            By having this contract, both parties agree to abide by the stated
            terms and conditions.
          </p>

          
        </div>

        
      </div>
    
  );
};

export default JobDescription;
