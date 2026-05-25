import apiClient from "./apiClient";

const EMPLOYEE_ROUTE = "/employees";
const DEPARTMENT_ROUTE = "/hr/departments";
const POSITION_ROUTE = "/hr/positions";
const CONTRACT_ROUTE = "/hr/contracts";
const LEAVE_ROUTE = "/hr/leaves";
const ATTENDANCE_ROUTE = "/hr/attendances";
const DOCUMENT_ROUTE = "/hr/documents";
const EVALUATION_ROUTE = "/hr/evaluations";
const TRAINING_ROUTE = "/hr/trainings";
const PAYROLL_ROUTE = "/hr/payrolls";
const RECRUITMENT_ROUTE = "/hr/recruitment-candidates";
const HR_ROUTE = "/hr";

const appendIfDefined = (formData, key, value) => {
  if (value === undefined || value === null || value === "") return;
  formData.append(key, value);
};

const buildEmployeeFormData = (payload = {}) => {
  const formData = new FormData();

  appendIfDefined(formData, "employeeCode", payload?.employeeCode);
  appendIfDefined(formData, "cin", payload?.cin);
  appendIfDefined(formData, "firstName", payload?.firstName);
  appendIfDefined(formData, "lastName", payload?.lastName);
  appendIfDefined(formData, "gender", payload?.gender);
  appendIfDefined(formData, "birthDate", payload?.birthDate);
  appendIfDefined(formData, "nationality", payload?.nationality);
  appendIfDefined(formData, "email", payload?.email);
  appendIfDefined(formData, "phone", payload?.phone);
  appendIfDefined(formData, "status", payload?.status);
  appendIfDefined(formData, "contractType", payload?.contractType);
  appendIfDefined(formData, "hireDate", payload?.hireDate);
  appendIfDefined(formData, "department", payload?.department);
  appendIfDefined(formData, "positionRef", payload?.positionRef);
  appendIfDefined(formData, "manager", payload?.manager);
  appendIfDefined(formData, "imageUrl", payload?.imageUrl);

  if (payload?.image instanceof File) {
    formData.append("image", payload.image);
  }

  return formData;
};

const buildDepartmentFormData = (payload = {}) => {
  const formData = new FormData();

  appendIfDefined(formData, "name", payload?.name);
  appendIfDefined(formData, "code", payload?.code);
  appendIfDefined(formData, "description", payload?.description);
  appendIfDefined(formData, "manager", payload?.manager);
  if (payload?.isActive !== undefined) appendIfDefined(formData, "isActive", payload?.isActive);
  appendIfDefined(formData, "imageUrl", payload?.imageUrl);

  if (payload?.image instanceof File) {
    formData.append("image", payload.image);
  }

  return formData;
};

export const getEmployees = async (params = {}) => {
  const response = await apiClient.get(EMPLOYEE_ROUTE, { params });
  return response.data;
};

export const getEmployeeById = async (id) => {
  const response = await apiClient.get(`${EMPLOYEE_ROUTE}/${id}`);
  return response.data;
};

export const createEmployee = async (payload) => {
  const hasImageFile = Boolean(payload?.image instanceof File);
  const requestPayload = hasImageFile ? buildEmployeeFormData(payload) : payload;

  const response = await apiClient.post(EMPLOYEE_ROUTE, requestPayload, {
    headers: hasImageFile ? { "Content-Type": "multipart/form-data" } : undefined,
  });
  return response.data;
};

export const updateEmployee = async (id, payload) => {
  const hasImageFile = Boolean(payload?.image instanceof File);
  const requestPayload = hasImageFile ? buildEmployeeFormData(payload) : payload;

  const response = await apiClient.put(`${EMPLOYEE_ROUTE}/${id}`, requestPayload, {
    headers: hasImageFile ? { "Content-Type": "multipart/form-data" } : undefined,
  });
  return response.data;
};

export const deleteEmployee = async (id) => {
  const response = await apiClient.delete(`${EMPLOYEE_ROUTE}/${id}`);
  return response.data;
};

export const getDepartments = async (params = {}) => {
  const response = await apiClient.get(DEPARTMENT_ROUTE, { params });
  return response.data;
};

export const createDepartment = async (payload) => {
  const hasImageFile = Boolean(payload?.image instanceof File);
  const requestPayload = hasImageFile ? buildDepartmentFormData(payload) : payload;

  const response = await apiClient.post(DEPARTMENT_ROUTE, requestPayload, {
    headers: hasImageFile ? { "Content-Type": "multipart/form-data" } : undefined,
  });
  return response.data;
};

export const updateDepartment = async (id, payload) => {
  const hasImageFile = Boolean(payload?.image instanceof File);
  const requestPayload = hasImageFile ? buildDepartmentFormData(payload) : payload;

  const response = await apiClient.put(`${DEPARTMENT_ROUTE}/${id}`, requestPayload, {
    headers: hasImageFile ? { "Content-Type": "multipart/form-data" } : undefined,
  });
  return response.data;
};

export const deleteDepartment = async (id) => {
  const response = await apiClient.delete(`${DEPARTMENT_ROUTE}/${id}`);
  return response.data;
};

export const getPositions = async (params = {}) => {
  const response = await apiClient.get(POSITION_ROUTE, { params });
  return response.data;
};

export const createPosition = async (payload) => {
  const response = await apiClient.post(POSITION_ROUTE, payload);
  return response.data;
};

export const updatePosition = async (id, payload) => {
  const response = await apiClient.put(`${POSITION_ROUTE}/${id}`, payload);
  return response.data;
};

export const deletePosition = async (id) => {
  const response = await apiClient.delete(`${POSITION_ROUTE}/${id}`);
  return response.data;
};

const buildContractFormData = (payload = {}) => {
  const formData = new FormData();

  appendIfDefined(formData, "employee", payload?.employee);
  appendIfDefined(formData, "contractType", payload?.contractType);
  appendIfDefined(formData, "startDate", payload?.startDate);
  appendIfDefined(formData, "endDate", payload?.endDate);
  appendIfDefined(formData, "salaryBase", payload?.salaryBase);
  appendIfDefined(formData, "probationMonths", payload?.probationMonths);
  appendIfDefined(formData, "status", payload?.status);
  appendIfDefined(formData, "notes", payload?.notes);

  if (payload?.pdf instanceof File) {
    formData.append("file", payload.pdf);
  }

  return formData;
};

export const getContracts = async (params = {}) => {
  const response = await apiClient.get(CONTRACT_ROUTE, { params });
  console.log("📥 hrApi.getContracts() received:", response.data);
  return response.data;
};

export const createContract = async (payload) => {
  const hasPdfFile = Boolean(payload?.pdf instanceof File);
  const requestPayload = hasPdfFile ? buildContractFormData(payload) : payload;

  const response = await apiClient.post(CONTRACT_ROUTE, requestPayload, {
    headers: hasPdfFile ? { "Content-Type": "multipart/form-data" } : undefined,
  });
  return response.data;
};

export const updateContract = async (id, payload) => {
  const hasPdfFile = Boolean(payload?.pdf instanceof File);
  const requestPayload = hasPdfFile ? buildContractFormData(payload) : payload;

  const response = await apiClient.put(`${CONTRACT_ROUTE}/${id}`, requestPayload, {
    headers: hasPdfFile ? { "Content-Type": "multipart/form-data" } : undefined,
  });
  return response.data;
};

export const deleteContract = async (id) => {
  const response = await apiClient.delete(`${CONTRACT_ROUTE}/${id}`);
  return response.data;
};

export const getLeaves = async (params = {}) => {
  const response = await apiClient.get(LEAVE_ROUTE, { params });
  return response.data;
};

export const createLeave = async (payload) => {
  const response = await apiClient.post(LEAVE_ROUTE, payload);
  return response.data;
};

export const approveLeave = async (id, payload = {}) => {
  const response = await apiClient.patch(`${LEAVE_ROUTE}/${id}/approve`, payload);
  return response.data;
};

export const rejectLeave = async (id, payload = {}) => {
  const response = await apiClient.patch(`${LEAVE_ROUTE}/${id}/reject`, payload);
  return response.data;
};

export const cancelLeave = async (id, payload = {}) => {
  const response = await apiClient.patch(`${LEAVE_ROUTE}/${id}/cancel`, payload);
  return response.data;
};

const buildAttendancePayload = (payload = {}) => ({
  employee: payload?.employeeId || undefined,
  attendanceDate: payload?.attendanceDate || undefined,
  checkIn: payload?.checkIn || undefined,
  checkOut: payload?.checkOut || undefined,
  status: payload?.status,
  notes: payload?.notes,
});

const buildDocumentPayload = (payload = {}) => ({
  employee: payload?.employeeId || undefined,
  documentType: payload?.documentType,
  title: payload?.title,
  fileUrl: payload?.fileUrl,
  filePublicId: payload?.filePublicId,
  issueDate: payload?.issueDate || undefined,
  expirationDate: payload?.expirationDate || undefined,
  status: payload?.status,
  notes: payload?.notes,
});

const buildEvaluationPayload = (payload = {}) => ({
  employee: payload?.employeeId || undefined,
  periodLabel: payload?.periodLabel,
  evaluationDate: payload?.evaluationDate || undefined,
  technicalScore: payload?.technicalScore,
  behaviorScore: payload?.behaviorScore,
  goalScore: payload?.goalScore,
  comments: payload?.comments,
  nextReviewDate: payload?.nextReviewDate || undefined,
  status: payload?.status,
});

const buildTrainingPayload = (payload = {}) => ({
  title: payload?.title,
  provider: payload?.provider,
  description: payload?.description,
  startDate: payload?.startDate || undefined,
  endDate: payload?.endDate || undefined,
  location: payload?.location,
  status: payload?.status,
  budget: payload?.budget,
  trainer: payload?.trainer,
  participants: payload?.participants,
  certificateUrl: payload?.certificateUrl,
});

const buildPayrollPayload = (payload = {}) => ({
  employee: payload?.employeeId || undefined,
  periodMonth: payload?.periodMonth,
  periodYear: payload?.periodYear,
  grossSalary: payload?.grossSalary,
  bonusAmount: payload?.bonusAmount,
  deductionAmount: payload?.deductionAmount,
  paymentDate: payload?.paymentDate || undefined,
  status: payload?.status,
  notes: payload?.notes,
});

const buildRecruitmentPayload = (payload = {}) => ({
  fullName: payload?.fullName,
  email: payload?.email,
  phone: payload?.phone,
  positionTitle: payload?.positionTitle,
  source: payload?.source,
  expectedSalary: payload?.expectedSalary,
  cvUrl: payload?.cvUrl,
  status: payload?.status,
  notes: payload?.notes,
  hiredEmployee: payload?.hiredEmployeeId || payload?.hiredEmployee,
});

export const getAttendances = async (params = {}) => {
  const response = await apiClient.get(ATTENDANCE_ROUTE, { params });
  return response.data;
};

export const createAttendance = async (payload) => {
  const response = await apiClient.post(ATTENDANCE_ROUTE, buildAttendancePayload(payload));
  return response.data;
};

export const updateAttendance = async (id, payload) => {
  const response = await apiClient.put(`${ATTENDANCE_ROUTE}/${id}`, buildAttendancePayload(payload));
  return response.data;
};

export const deleteAttendance = async (id) => {
  const response = await apiClient.delete(`${ATTENDANCE_ROUTE}/${id}`);
  return response.data;
};

export const getDocuments = async (params = {}) => {
  const response = await apiClient.get(DOCUMENT_ROUTE, { params });
  return response.data;
};

export const createDocument = async (payload) => {
  const response = await apiClient.post(DOCUMENT_ROUTE, buildDocumentPayload(payload));
  return response.data;
};

export const updateDocument = async (id, payload) => {
  const response = await apiClient.put(`${DOCUMENT_ROUTE}/${id}`, buildDocumentPayload(payload));
  return response.data;
};

export const deleteDocument = async (id) => {
  const response = await apiClient.delete(`${DOCUMENT_ROUTE}/${id}`);
  return response.data;
};

export const getEvaluations = async (params = {}) => {
  const response = await apiClient.get(EVALUATION_ROUTE, { params });
  return response.data;
};

export const createEvaluation = async (payload) => {
  const response = await apiClient.post(EVALUATION_ROUTE, buildEvaluationPayload(payload));
  return response.data;
};

export const updateEvaluation = async (id, payload) => {
  const response = await apiClient.put(`${EVALUATION_ROUTE}/${id}`, buildEvaluationPayload(payload));
  return response.data;
};

export const deleteEvaluation = async (id) => {
  const response = await apiClient.delete(`${EVALUATION_ROUTE}/${id}`);
  return response.data;
};

export const getTrainings = async (params = {}) => {
  const response = await apiClient.get(TRAINING_ROUTE, { params });
  return response.data;
};

export const createTraining = async (payload) => {
  const response = await apiClient.post(TRAINING_ROUTE, buildTrainingPayload(payload));
  return response.data;
};

export const updateTraining = async (id, payload) => {
  const response = await apiClient.put(`${TRAINING_ROUTE}/${id}`, buildTrainingPayload(payload));
  return response.data;
};

export const deleteTraining = async (id) => {
  const response = await apiClient.delete(`${TRAINING_ROUTE}/${id}`);
  return response.data;
};

export const getPayrolls = async (params = {}) => {
  const response = await apiClient.get(PAYROLL_ROUTE, { params });
  return response.data;
};

export const createPayroll = async (payload) => {
  const response = await apiClient.post(PAYROLL_ROUTE, buildPayrollPayload(payload));
  return response.data;
};

export const updatePayroll = async (id, payload) => {
  const response = await apiClient.put(`${PAYROLL_ROUTE}/${id}`, buildPayrollPayload(payload));
  return response.data;
};

export const deletePayroll = async (id) => {
  const response = await apiClient.delete(`${PAYROLL_ROUTE}/${id}`);
  return response.data;
};

export const getRecruitmentCandidates = async (params = {}) => {
  const response = await apiClient.get(RECRUITMENT_ROUTE, { params });
  return response.data;
};

export const createRecruitmentCandidate = async (payload) => {
  const response = await apiClient.post(RECRUITMENT_ROUTE, buildRecruitmentPayload(payload));
  return response.data;
};

export const updateRecruitmentCandidate = async (id, payload) => {
  const response = await apiClient.put(`${RECRUITMENT_ROUTE}/${id}`, buildRecruitmentPayload(payload));
  return response.data;
};

export const deleteRecruitmentCandidate = async (id) => {
  const response = await apiClient.delete(`${RECRUITMENT_ROUTE}/${id}`);
  return response.data;
};

export const getHrSummary = async () => {
  const response = await apiClient.get(`${HR_ROUTE}/summary`);
  return response.data;
};

export const getHrAlerts = async () => {
  const response = await apiClient.get(`${HR_ROUTE}/alerts`);
  return response.data;
};

export const getHrMonthlyReport = async (params = {}) => {
  const response = await apiClient.get(`${HR_ROUTE}/reports/monthly`, { params });
  return response.data;
};

export const hrApi = {
  getEmployees,
  getEmployeeById,
  createEmployee,
  updateEmployee,
  deleteEmployee,
  getDepartments,
  createDepartment,
  updateDepartment,
  deleteDepartment,
  getPositions,
  createPosition,
  updatePosition,
  deletePosition,
  getContracts,
  createContract,
  updateContract,
  deleteContract,
  getLeaves,
  createLeave,
  approveLeave,
  rejectLeave,
  cancelLeave,
  getAttendances,
  createAttendance,
  updateAttendance,
  deleteAttendance,
  getDocuments,
  createDocument,
  updateDocument,
  deleteDocument,
  getEvaluations,
  createEvaluation,
  updateEvaluation,
  deleteEvaluation,
  getTrainings,
  createTraining,
  updateTraining,
  deleteTraining,
  getPayrolls,
  createPayroll,
  updatePayroll,
  deletePayroll,
  getRecruitmentCandidates,
  createRecruitmentCandidate,
  updateRecruitmentCandidate,
  deleteRecruitmentCandidate,
  getHrSummary,
  getHrAlerts,
  getHrMonthlyReport,
};

export default hrApi;
