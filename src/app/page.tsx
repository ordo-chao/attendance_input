"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { toast } from "sonner";
import { z } from "zod";

// Define the schema using Zod
const studentSchema = z.object({
  student_id: z
    .string()
    .regex(/^\d{2}-\d{4}$/, "Student ID must match 00-0000 format"),
  first_name: z.string().min(1, "First name is required"),
  last_name: z.string().min(1, "Last name is required"),
  email: z.string().email("Email address is required"),
  gender: z.enum(["Male", "Female"], { required_error: "Gender is required" }),
  school: z.string().min(1, "Please select a school"),
  chapel_usher: z.boolean(),
  campus: z.string().min(1, "Campus is required"),
});

export default function Home() {
  const [email, setEmail] = useState("");
  const [admno, setAdmno] = useState("");
  const [gender, setGender] = useState("");
  const [school, setSchool] = useState("");
  const [fname, setFname] = useState("");
  const [lname, setLname] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let inputValue = e.target.value.replace(/\D/g, "");
    if (inputValue.length > 2) {
      inputValue = `${inputValue.slice(0, 2)}-${inputValue.slice(2, 6)}`;
    }
    setAdmno(inputValue);
    setErrors((prev) => ({ ...prev, student_id: "" })); 
  };

  const handleInputChange = (
    key: keyof typeof errors,
    value: string,
    setter: (value: string) => void
  ) => {
    setter(value);
    setErrors((prev) => ({ ...prev, [key]: "" })); 
  };

  const postData = async () => {
    setErrors({});

    const data = {
      student_id: admno,
      first_name: fname,
      last_name: lname,
      email: email,
      gender: gender,
      school: school,
      chapel_usher: false,
      campus: "Athi River",
    };

    const validation = studentSchema.safeParse(data);
    if (!validation.success) {
      const fieldErrors: Record<string, string> = {};
      validation.error.errors.forEach((err) => {
        if (err.path.length > 0) {
          fieldErrors[err.path[0]] = err.message;
        }
      });

      setErrors(fieldErrors);
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch(
        "https://q2q18vht-8080.uks1.devtunnels.ms/attendance/register",
        {
          method: "POST",
          mode: "no-cors",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        }
      );
      console.log("Response", response);
      toast(`Response status: ${response.status}`);
    } catch (error) {
      console.error("Error during POST:", error);
      toast.error("An error occurred while submitting the form.");
    }
    setIsSubmitting(false);

    setAdmno("");
    setFname("");
    setLname("");
    setEmail("");
    setGender("");
    setSchool("");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <div className="bg-[#181a25] sm:p-8 p-4 rounded-xl shadow-lg w-full max-w-[450px] mx-4 sm:mx-0">
        <h1 className="text-3xl font-bold text-center text-white mb-10">Sign Up</h1>
        <form className="space-y-8">
          {/* Student ID */}
          <div>
            <Input
              type="text"
              value={admno}
              onChange={handleChange}
              maxLength={7}
              placeholder="00-0000"
              className="w-full p-3 rounded-md bg-[#1f2430] text-white border-gray-700 border-2 outline-none focus:ring-purple-500 transition placeholder-gray-200"
            />
            {errors.student_id && <p className="mt-1 text-sm text-red-500">{errors.student_id}</p>}
          </div>
          {/* First and Last Name */}
          <div className="flex sm:flex-row sm:gap-4 gap-8 flex-col ">
            <div className="sm:w-1/2">
              <Input
                type="text"
                placeholder="First Name"
                value={fname}
                onChange={(e) => handleInputChange("first_name", e.target.value, setFname)}
                className="w-full p-3 rounded-md bg-[#1f2430] text-white border-gray-700 border focus:outline-none focus:ring-2 focus:ring-purple-500 transition placeholder-gray-400"
              />
              {errors.first_name && <p className="mt-1 text-sm text-red-500">{errors.first_name}</p>}
            </div>
            <div className="sm:w-1/2">
              <Input
                type="text"
                placeholder="Last Name"
                value={lname}
                onChange={(e) => handleInputChange("last_name", e.target.value, setLname)}
                className="w-full p-3 rounded-md bg-[#1f2430] text-white border-gray-700 border focus:outline-none focus:ring-2 focus:ring-purple-500 transition placeholder-gray-400"
              />
              {errors.last_name && <p className="mt-1 text-sm text-red-500">{errors.last_name}</p>}
            </div>
          </div>
          {/* Email */}
          <div>
            <Input
              type="email"
              placeholder="jondoe@daystar.ac.ke"
              value={email}
              onChange={(e) => handleInputChange("email", e.target.value, setEmail)}
              className="w-full p-3 rounded-md bg-[#1f2430] text-white border-gray-700 border focus:outline-none focus:ring-2 focus:ring-purple-500 transition placeholder-white"
            />
            {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}
          </div>
          {/* Gender */}
          <div className="flex items-center justify-around">
            <div className="flex items-center">
              <Input
                type="radio"
                name="gender"
                id="male"
                value="Male"
                checked={gender === "Male"}
                onChange={(e) => handleInputChange("gender", e.target.value, setGender)}
                className="mr-2"
              />
              <label htmlFor="male" className="text-white">Male</label>
            </div>
            <div className="flex items-center">
              <Input
                type="radio"
                name="gender"
                id="female"
                value="Female"
                checked={gender === "Female"}
                onChange={(e) => handleInputChange("gender", e.target.value, setGender)}
                className="mr-2"
              />
              <label htmlFor="female" className="text-white">Female</label>
            </div>
          </div>
          {errors.gender && <p className="mt-1 text-sm text-red-500 text-center">{errors.gender}</p>}
          {/* School */}
          <div>
            <select
              title="Schools"
              className="w-full p-3 text-sm rounded-md bg-[#1f2430] text-white border-gray-700 border focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
              value={school}
              onChange={(e) => handleInputChange("school", e.target.value, setSchool)}
            >
               <option value="" disabled>
                Select School
              </option>
              <option value="School of Science Engineering and Health">
                School of Science Engineering and Health
              </option>
              <option value="School of Law">School of Law</option>
              <option value="School of Nursing">School of Nursing</option>
              <option value="School of Business and Economics">
                School of Business and Economics
              </option>
              <option value="School of Applied Human Sciences">
                School of Applied Human Sciences
              </option>
              <option value="School of Arts and Social Sciences">
                School of Arts and Social Sciences
              </option>
              <option value="School of Communication">
                School of Communication
              </option>
            </select>
            {errors.school && <p className="mt-1 text-sm text-red-500">{errors.school}</p>}
          </div>
          <Button
              className="w-full p-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white font-bold rounded-md transition duration-200 hover:from-purple-600 hover:to-blue-600 disabled:opacity-50"
              onClick={(e) => {
                e.preventDefault();
                postData();
              }}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Submitting..." : "Submit"}
            </Button>
        </form>
      </div>
    </div>
  );
}
