export function buildEmployeeFormData(values) {
  const formData = new FormData();
  const fields = {
    is_intern: "false",
    first_name: values.firstName.trim(),
    last_name: values.lastName.trim(),
    email: values.loginEmail.trim(),
    personal_email_address: values.personalEmail.trim(),
    official_email_address: values.officialEmail.trim(),
    dob: values.dob,
    gender: values.gender,
    mobile_number: values.mobile,
    alternate_number: values.alternateNumber,
    department_id: values.department,
    designation_id: values.designation,
    joining_date: values.joiningDate,
    probation_period: values.probationPeriod,
    work_type: values.workType,
    branch: values.branch,
    employee_code: values.employeeCode.trim(),
    attendance_code: values.attendanceCode,
    CardNo: values.cardNumber,
    aadhar_number: values.aadhaarNumber,
    pan_number: values.panNumber.toUpperCase(),
    bank_ifsc_code: values.ifscCode.trim(),
    bank_account_number: values.accountNumber.trim(),
    bank_name: values.bankName.trim(),
    bank_account_name: values.accountHolderName.trim(),
    address: values.permanentAddress.trim(),
    city: values.city.trim(),
    state: values.state.replace(/\s*\[[^\]]+\]\s*$/, "").trim(),
    pincode: values.pincode,
    emergency_contact_name: values.emergencyContactName.trim(),
    emergency_contact_relation: values.emergencyContactRelation.trim(),
    emergency_contact_number: values.emergencyContactNumber,
    received_remarks: values.receivedRemarks.trim(),
    is_background_verification_done: values.backgroundVerification,
    college: values.college.trim(),
    qualification: values.qualification.trim(),
    interview_date: values.interviewDate,
    passout_year: values.passoutYear,
    pursuing_year: values.pursuingYear,
    previous_experience: values.previousExperience.trim(),
    notes: values.notes.filter(Boolean).join("\n"),
    password: values.password,
  };

  Object.entries(fields).forEach(([key, value]) => {
    if (value !== "" && value !== undefined && value !== null) {
      formData.append(key, value);
    }
  });

  if (values.profileImage) {
    formData.append("image", values.profileImage);
  }

  return formData;
}

export function buildInternFormData(values) {
  const formData = new FormData();
  const fields = {
    is_intern: "true",
    first_name: values.firstName.trim(),
    last_name: values.lastName.trim(),
    email: values.loginEmail.trim(),
    personal_email_address: values.personalEmail.trim(),
    official_email_address: values.officialEmail.trim(),
    dob: values.dob,
    gender: values.gender.toLowerCase(),
    mobile_number: values.mobile,
    alternate_number: values.alternateNumber,
    department_id: values.department,
    designation_id: values.designation,
    joining_date: values.joiningDate,
    work_type: values.workType,
    branch: values.branch,
    employee_code: values.employeeCode.trim(),
    aadhar_number: values.aadhaarNumber,
    pan_number: values.panNumber.toUpperCase(),
    bank_ifsc_code: values.ifscCode.trim(),
    bank_account_number: values.accountNumber.trim(),
    bank_name: values.bankName.trim(),
    bank_account_name: values.accountHolderName.trim(),
    address: values.permanentAddress.trim(),
    city: values.city.trim(),
    state: values.state.trim(),
    college: values.college.trim(),
    qualification: values.qualification.trim(),
    interview_date: values.interviewDate,
    passout_year: values.passoutYear,
    pursuing_year: values.pursuingYear,
    previous_experience: values.previousExperience,
    notes: values.notes.filter(Boolean).join("\n"),
    password: values.password,
  };

  Object.entries(fields).forEach(([key, value]) => {
    if (value !== "" && value !== undefined && value !== null) {
      formData.append(key, value);
    }
  });

  if (values.profileImage) {
    formData.append("image", values.profileImage);
  }

  return formData;
}
