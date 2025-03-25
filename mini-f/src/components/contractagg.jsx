import React, { useEffect, useState, useRef } from "react";
import { Button } from "./ui/button";
import { useParams } from "react-router-dom";
import axios from "axios";
import { JOB_API_END_POINT } from "@/utils/constant";
import { setSingleJob } from "@/redux/jobSlice";
import { useDispatch, useSelector } from "react-redux";
import Navbar from "./shared/Navbar";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const ContractAgreement = () => {
  const { singleJob } = useSelector((store) => store.job);
  const { user } = useSelector((store) => store.auth);
  const params = useParams();
  const jobId = params.id;
  const dispatch = useDispatch();
  const contractRef = useRef(null);

  useEffect(() => {
    const fetchSingleJob = async () => {
      try {
        const res = await axios.get(`${JOB_API_END_POINT}/get/${jobId}`, {
          withCredentials: true,
        });
        if (res.data.success) {
          dispatch(setSingleJob(res.data.job));
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchSingleJob();
  }, [jobId, dispatch]);

  const downloadContract = () => {
    const input = contractRef.current;
    html2canvas(input, { scale: 2 }).then((canvas) => {
      const pdf = new jsPDF("p", "mm", "a4");
      const imgWidth = 190;
      let imgHeight = (canvas.height * imgWidth) / canvas.width;
      pdf.addImage(canvas.toDataURL("image/png"), "PNG", 10, 10, imgWidth, imgHeight);
      pdf.save(`Contract_${singleJob?.title}.pdf`);
    });
  };

  return (
    <div>
      <Navbar />
      <div className="max-w-5xl mx-auto my-10 px-10">
        <div className="flex justify-between items-center">
          <h1 className="font-bold text-2xl">Contract Agreement</h1>
          <Button onClick={downloadContract} className="bg-[#7209b7] hover:bg-[#5f32ad] text-white">
            Download Contract
          </Button>
        </div>

        <div ref={contractRef} className="max-w-3xl mx-auto my-10 p-10 border border-gray-300 bg-white shadow-md rounded-lg text-gray-900 font-serif">
        <p className="text-right">Date: {singleJob?.createdAt?.split("T")[0]}</p>
        <p className="font-bold">SELLER:</p>
          <p>{user?.fullname}</p>

          <p>{user?.email}</p>
          <p style={{ marginBottom: "20px" }}>{user?.phoneNumber}</p>
          
          <p className="font-bold">BUYER:</p>
          <p>{singleJob?.company}</p>
          <p>{singleJob?.companyAddress || "[Recipient's Address]"}</p>
          <p>{singleJob?.companyCityStateZip || "[City, State, ZIP Code]"}</p>
          
          <h1 className="text-center text-2xl font-bold uppercase underline my-6">Contract for the Purchase of {singleJob?.jobType}</h1>

          <p>Buyer {singleJob?.company},</p>

          <p>
            This letter serves as a formal agreement between {user?.fullname} ("Buyer") and {singleJob?.company} ("Seller") regarding the purchase of a lease agreement for the property located at {singleJob?.location}. The terms and conditions outlined in this contract shall govern the transaction and establish the respective obligations of both parties.
          </p>

          <h2 className="font-bold mt-4">1. Purchase Details</h2>
          <ul className="list-disc pl-4">
            <li><strong>Property Address:</strong> {singleJob?.location}</li>
            <li><strong>Agreement Type:</strong> {singleJob?.jobType}</li>
            <li><strong>Days:</strong> {singleJob?.position ? `${singleJob.position} Days` : "N/A"}</li>
            <li><strong>Purchase Price:</strong> ₹{singleJob?.salary}</li>
          </ul>

          <h2 className="font-bold mt-4">2. Conditions of Purchase</h2>
          <p>The Seller guarantees that the lease agreement is valid, legally binding, and transferable.</p>

          <h2 className="font-bold mt-4">3. Legal Considerations</h2>
          <p>Both parties agree to comply with all local, state, and federal laws governing lease agreements.</p>

          <h2 className="font-bold mt-4">4. Execution</h2>
          <p>By signing below, both parties acknowledge that they have read, understood, and agreed to the terms of this contract.</p>

          <div className="mt-8 flex justify-between">
            <div>
              <p className="font-bold">Buyer Signature:</p>
              <p>{singleJob?.company}</p>
              <p className="text-gray-700">Date: ___________</p>
            </div>
            <div>
              <p className="font-bold">Seller Signature:</p>
              <p>{user?.fullname}</p>
              <p>{user?._id}</p>
              
              <p className="text-gray-700">Date: ___________</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContractAgreement;