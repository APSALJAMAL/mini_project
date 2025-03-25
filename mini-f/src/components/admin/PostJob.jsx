import React, { useState } from "react";
import Navbar from "../shared/Navbar";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useSelector } from "react-redux";
import axios from "axios";
import { JOB_API_END_POINT } from "@/utils/constant";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";

const jobTypes = [
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

const PostJob = () => {
  const { user } = useSelector((store) => store.auth);
  const [input, setInput] = useState({
    title: "",
    description: "",
    requirements: "",
    salary: "",
    location: "",
    jobType: "",
    experience: "",
    position: 0,
    companyId: "",
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const { companies } = useSelector((store) => store.company);

  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const selectChangeHandler = (value) => {
    const selectedCompany = companies.find(
      (company) => company.name.toLowerCase() === value
    );
    setInput({ ...input, companyId: selectedCompany?._id || "" });
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await axios.post(`${JOB_API_END_POINT}/post`, input, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });
      if (res.data.success) {
        toast.success(res.data.message);
        navigate("/browse");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Navbar />
      <div className="flex items-center justify-center w-screen my-5">
        <form onSubmit={submitHandler} className="  ">

        <Label>Seller Id</Label>
          <Input
            type="text"
            name="experience"
            value={user?._id}
            onChange={changeEventHandler}
            className="my-1 font-bold text-lg"
          />

          <Label>Title</Label>
          <Input
            type="text"
            name="title"
            value={input.title}
            onChange={changeEventHandler}
            className="my-1"
          />

          <Label>Description</Label>
          <Input
            type="text"
            name="description"
            value={input.description}
            onChange={changeEventHandler}
            className="my-1"
          />

          <div className="mb-4">
            <div className="font-semibold">Contract Type</div>
            <div>
              <select
                name="jobType"
                value={input.jobType}
                onChange={changeEventHandler}
                className="border p-2 rounded-md my-1 w-full"
              >
                <option value="">Select Contract Type</option>
                {jobTypes.map((type, index) => (
                  <option key={index} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <Label>Requirements</Label>
          <Input
            type="text"
            name="requirements"
            value={input.requirements}
            onChange={changeEventHandler}
            className="my-1"
          />

          <Label>Price</Label>
          <Input
            type="text"
            name="salary"
            value={input.salary}
            onChange={changeEventHandler}
            className="my-1"
            placeholder="₹"
          />

          <Label>Location</Label>
          <Input
            type="text"
            name="location"
            value={input.location}
            onChange={changeEventHandler}
            className="my-1"
          />

          

          

          <Label>Time period( In Days )</Label>
          <Input
            type="number"
            name="position"
            value={input.position}
            onChange={changeEventHandler}
            className="my-1"
          />

          {companies.length > 0 && (
            <>
              <Label>Company</Label>
              <select
                onChange={(e) => selectChangeHandler(e.target.value)}
                className="border p-2 rounded-md my-1"
              >
                <option value="">Select a Company</option>
                {companies.map((company) => (
                  <option key={company._id} value={company.name.toLowerCase()}>
                    {company.name}
                  </option>
                ))}
              </select>
            </>
          )}

          {loading ? (
            <Button className="w-full my-4">
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please wait
            </Button>
          ) : (
            <Button
              type="submit"
              className="bg-violet-600 text-white w-full my-4 hover:bg-violet-700 transition duration-300"
            >
              Post New Contract
            </Button>
          )}

          {companies.length === 0 && (
            <p className="text-xs text-red-600 font-bold text-center my-3">
              *Please register a company first, before posting a contract
            </p>
          )}
        </form>
      </div>
    </div>
  );
};

export default PostJob;
