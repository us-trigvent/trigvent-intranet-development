import {
  KeyRound,
  Landmark,
  NotebookPen,
  UserRound,
} from "lucide-react";

export const employeeSteps = [
  { label: "Personal Details", icon: UserRound },
  { label: "Login Details", icon: KeyRound },
  { label: "Bank Details", icon: Landmark },
  { label: "Notes & Review", icon: NotebookPen },
];

export const initialEmployeeForm = {
  firstName: "",
  lastName: "",
  dob: "",
  gender: "male",
  profileImage: null,
  mobile: "",
  alternateNumber: "",
  officialEmail: "",
  personalEmail: "",
  permanentAddress: "",
  state: "",
  stateId: "",
  city: "",
  pincode: "",
  emergencyContactName: "",
  emergencyContactRelation: "",
  emergencyContactNumber: "",
  department: "",
  designation: "",
  joiningDate: "",
  workType: "",
  branch: "Mohali",
  employeeCode: "",
  probationPeriod: "",
  attendanceCode: "",
  cardNumber: "",
  backgroundVerification: "",
  receivedRemarks: "",
  college: "",
  qualification: "",
  interviewDate: "",
  passoutYear: "",
  pursuingYear: "",
  previousExperience: "",
  loginEmail: "",
  password: "",
  accountHolderName: "",
  bankName: "",
  accountNumber: "",
  ifscCode: "",
  aadhaarNumber: "",
  panNumber: "",
  notes: [""],
};

export const workTypeOptions = [
  { label: "Remote", value: "remote" },
  { label: "Onsite", value: "onsite" },
  { label: "Hybrid", value: "hybrid" },
];

export const probationOptions = [
  { label: "3 Months", value: "3" },
  { label: "6 Months", value: "6" },
];

export const verificationOptions = [
  { label: "Yes", value: "Yes" },
  { label: "No", value: "No" },
];
