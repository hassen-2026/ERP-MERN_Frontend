import {
  approveLeave,
  cancelLeave,
  createContract,
  createDepartment,
  createEmployee,
  createLeave,
  createAttendance,
  createDocument,
  createEvaluation,
  createPayroll,
  createRecruitmentCandidate,
  createTraining,
  createPosition,
  deleteContract,
  deleteDepartment,
  deleteAttendance,
  deleteDocument,
  deleteEvaluation,
  deleteEmployee,
  deletePayroll,
  deleteRecruitmentCandidate,
  deleteTraining,
  deletePosition,
  getHrAlerts,
  getHrMonthlyReport,
  getHrSummary,
  getAttendances,
  getDocuments,
  getEvaluations,
  getContracts,
  getDepartments,
  getEmployees,
  getLeaves,
  getPayrolls,
  getRecruitmentCandidates,
  getTrainings,
  getPositions,
  rejectLeave,
  updateAttendance,
  updateDocument,
  updateEvaluation,
  updateContract,
  updateDepartment,
  updateEmployee,
  updatePayroll,
  updateRecruitmentCandidate,
  updateTraining,
  updatePosition,
} from "../../services/hrApi";

const formatDateTime = (value) => {
  if (!value) return "-";
  const parsedDate = new Date(value);
  if (Number.isNaN(parsedDate.getTime())) return String(value);
  return parsedDate.toLocaleString("fr-FR");
};

const toArray = (data, keyCandidates = []) => {
  if (Array.isArray(data)) return data;
  for (const key of keyCandidates) {
    if (Array.isArray(data?.[key])) return data[key];
  }
  return [];
};

const mapEmployee = (item, index) => {
  const firstName = item?.firstName || "";
  const lastName = item?.lastName || "";
  const fullName = `${firstName} ${lastName}`.trim() || item?.name || "Employe";
  const departmentName = item?.department?.name || item?.departmentName || "-";
  const positionName = item?.positionRef?.title || item?.position || "-";

  const status = item?.status || "ACTIVE";
  const statusLabels = {
    ACTIVE: "Actif",
    INACTIVE: "Inactif",
    ON_LEAVE: "En congé",
    TERMINATED: "Terminé",
  };

  return {
    id: item?.id ?? item?._id ?? `${index + 1}`,
    employeeCode: item?.employeeCode || "-",
    cin: item?.cin || "-",
    firstName,
    lastName,
    name: item?.name || fullName,
    fullName,
    gender: item?.gender || "-",
    birthDate: formatDateTime(item?.birthDate),
    birthDateIso: item?.birthDate || "",
    nationality: item?.nationality || "-",
    email: item?.email || "-",
    phone: item?.phone || "-",
    imageUrl: item?.imageUrl || "",
    status,
    statusLabel: statusLabels[status] || status,
    contractType: item?.contractType || "-",
    hireDate: formatDateTime(item?.hireDate),
    hireDateIso: item?.hireDate || "",
    departmentId: item?.department?._id || item?.department || "",
    departmentName,
    positionId: item?.positionRef?._id || item?.positionRef || "",
    positionName,
    managerId: item?.manager?._id || item?.manager || "",
    managerName: item?.manager?.name || "-",
    createdAt: formatDateTime(item?.createdAt),
  };
};

const mapDepartment = (item, index) => ({
  id: item?.id ?? item?._id ?? `${index + 1}`,
  name: item?.name || "Departement",
  code: item?.code || "-",
  description: item?.description || "-",
  imageUrl: item?.imageUrl || "",
  managerId: item?.manager?._id || item?.manager || "",
  managerName: item?.manager?.name || "-",
  isActive: item?.isActive !== false,
  createdAt: formatDateTime(item?.createdAt),
});

const mapPosition = (item, index) => ({
  id: item?.id ?? item?._id ?? `${index + 1}`,
  title: item?.title || "Poste",
  level: item?.level || "-",
  description: item?.description || "-",
  departmentId: item?.department?._id || item?.department || "",
  departmentName: item?.department?.name || "-",
  isActive: item?.isActive !== false,
  createdAt: formatDateTime(item?.createdAt),
});

const mapContract = (item, index) => {
  const status = item?.status || "ACTIVE";
  const statusLabels = {
    DRAFT: "Brouillon",
    ACTIVE: "Actif",
    ENDED: "Terminé",
    TERMINATED: "Résilié",
  };

  return {
    id: item?.id ?? item?._id ?? `${index + 1}`,
    employeeId: item?.employee?._id || item?.employee || "",
    employeeName:
      item?.employee?.name || `${item?.employee?.firstName || ""} ${item?.employee?.lastName || ""}`.trim() || "Employe",
    contractType: item?.contractType || "-",
    status,
    statusLabel: statusLabels[status] || status,
    salaryBase: item?.salaryBase ?? 0,
    probationMonths: item?.probationMonths ?? 0,
    startDate: formatDateTime(item?.startDate),
    startDateIso: item?.startDate || "",
    endDate: formatDateTime(item?.endDate),
    endDateIso: item?.endDate || "",
    notes: item?.notes || "",
    pdfUrl: item?.pdfUrl || "",
  };
};

const mapLeave = (item, index) => ({
  id: item?.id ?? item?._id ?? `${index + 1}`,
  employeeId: item?.employee?._id || item?.employee || "",
  employeeName:
    item?.employee?.name || `${item?.employee?.firstName || ""} ${item?.employee?.lastName || ""}`.trim() || "Employe",
  leaveType: item?.leaveType || "ANNUAL",
  status: item?.status || "PENDING",
  statusLabel:
    {
      PENDING: "En attente",
      APPROVED: "Approuvé",
      REJECTED: "Refusé",
      CANCELLED: "Annulé",
    }[item?.status || "PENDING"] || item?.status || "PENDING",
  reason: item?.reason || "-",
  totalDays: item?.totalDays ?? 0,
  startDate: formatDateTime(item?.startDate),
  endDate: formatDateTime(item?.endDate),
  decisionComment: item?.decisionComment || "",
});

const mapAttendance = (item, index) => ({
  id: item?.id ?? item?._id ?? `${index + 1}`,
  employeeId: item?.employee?._id || item?.employee || "",
  employeeName:
    item?.employee?.name || `${item?.employee?.firstName || ""} ${item?.employee?.lastName || ""}`.trim() || "Employe",
  attendanceDate: formatDateTime(item?.attendanceDate),
  attendanceDateIso: item?.attendanceDate || "",
  checkIn: formatDateTime(item?.checkIn),
  checkInIso: item?.checkIn || "",
  checkOut: formatDateTime(item?.checkOut),
  checkOutIso: item?.checkOut || "",
  status: item?.status || "PRESENT",
  statusLabel:
    {
      PRESENT: "Présent",
      ABSENT: "Absent",
      LATE: "En retard",
      REMOTE: "Télétravail",
      HALF_DAY: "Demi-journée",
    }[item?.status || "PRESENT"] || item?.status || "PRESENT",
  totalHours: item?.totalHours ?? 0,
  notes: item?.notes || "",
});

const mapDocument = (item, index) => ({
  id: item?.id ?? item?._id ?? `${index + 1}`,
  employeeId: item?.employee?._id || item?.employee || "",
  employeeName:
    item?.employee?.name || `${item?.employee?.firstName || ""} ${item?.employee?.lastName || ""}`.trim() || "Employe",
  documentType: item?.documentType || "OTHER",
  title: item?.title || "Document",
  fileUrl: item?.fileUrl || "",
  filePublicId: item?.filePublicId || "",
  issueDate: formatDateTime(item?.issueDate),
  issueDateIso: item?.issueDate || "",
  expirationDate: formatDateTime(item?.expirationDate),
  expirationDateIso: item?.expirationDate || "",
  status: item?.status || "VALID",
  statusLabel:
    {
      VALID: "Valide",
      EXPIRED: "Expiré",
      MISSING: "Manquant",
      PENDING: "En attente",
    }[item?.status || "VALID"] || item?.status || "VALID",
  notes: item?.notes || "",
});

const mapEvaluation = (item, index) => ({
  id: item?.id ?? item?._id ?? `${index + 1}`,
  employeeId: item?.employee?._id || item?.employee || "",
  employeeName:
    item?.employee?.name || `${item?.employee?.firstName || ""} ${item?.employee?.lastName || ""}`.trim() || "Employe",
  periodLabel: item?.periodLabel || "",
  evaluationDate: formatDateTime(item?.evaluationDate),
  evaluationDateIso: item?.evaluationDate || "",
  technicalScore: item?.technicalScore ?? 0,
  behaviorScore: item?.behaviorScore ?? 0,
  goalScore: item?.goalScore ?? 0,
  overallScore: item?.overallScore ?? 0,
  comments: item?.comments || "",
  nextReviewDate: formatDateTime(item?.nextReviewDate),
  nextReviewDateIso: item?.nextReviewDate || "",
  status: item?.status || "DRAFT",
  statusLabel:
    {
      DRAFT: "Brouillon",
      COMPLETED: "Terminée",
      ARCHIVED: "Archivée",
    }[item?.status || "DRAFT"] || item?.status || "DRAFT",
});

const mapTraining = (item, index) => ({
  id: item?.id ?? item?._id ?? `${index + 1}`,
  title: item?.title || "Formation",
  provider: item?.provider || "",
  description: item?.description || "",
  startDate: formatDateTime(item?.startDate),
  startDateIso: item?.startDate || "",
  endDate: formatDateTime(item?.endDate),
  endDateIso: item?.endDate || "",
  location: item?.location || "",
  status: item?.status || "PLANNED",
  statusLabel:
    {
      PLANNED: "Planifiée",
      ONGOING: "En cours",
      COMPLETED: "Terminée",
      CANCELLED: "Annulée",
    }[item?.status || "PLANNED"] || item?.status || "PLANNED",
  budget: item?.budget ?? 0,
  trainer: item?.trainer || "",
  participants: Array.isArray(item?.participants) ? item.participants : [],
  certificateUrl: item?.certificateUrl || "",
});

const mapPayroll = (item, index) => ({
  id: item?.id ?? item?._id ?? `${index + 1}`,
  employeeId: item?.employee?._id || item?.employee || "",
  employeeName:
    item?.employee?.name || `${item?.employee?.firstName || ""} ${item?.employee?.lastName || ""}`.trim() || "Employe",
  periodMonth: item?.periodMonth ?? 0,
  periodYear: item?.periodYear ?? 0,
  grossSalary: item?.grossSalary ?? 0,
  bonusAmount: item?.bonusAmount ?? 0,
  deductionAmount: item?.deductionAmount ?? 0,
  netSalary: item?.netSalary ?? 0,
  paymentDate: formatDateTime(item?.paymentDate),
  paymentDateIso: item?.paymentDate || "",
  status: item?.status || "DRAFT",
  statusLabel:
    {
      DRAFT: "Brouillon",
      CALCULATED: "Calculée",
      PAID: "Payée",
      CANCELLED: "Annulée",
    }[item?.status || "DRAFT"] || item?.status || "DRAFT",
  notes: item?.notes || "",
});

const mapRecruitmentCandidate = (item, index) => ({
  id: item?.id ?? item?._id ?? `${index + 1}`,
  fullName: item?.fullName || "Candidat",
  email: item?.email || "",
  phone: item?.phone || "",
  positionTitle: item?.positionTitle || "",
  source: item?.source || "",
  expectedSalary: item?.expectedSalary ?? 0,
  cvUrl: item?.cvUrl || "",
  status: item?.status || "APPLIED",
  statusLabel:
    {
      APPLIED: "Candidature",
      SCREENING: "Pré-sélection",
      INTERVIEW: "Entretien",
      OFFER: "Offre",
      HIRED: "Recruté",
      REJECTED: "Refusé",
    }[item?.status || "APPLIED"] || item?.status || "APPLIED",
  hiredEmployeeId: item?.hiredEmployee?._id || item?.hiredEmployee || "",
  hiredEmployeeName:
    item?.hiredEmployee?.name || `${item?.hiredEmployee?.firstName || ""} ${item?.hiredEmployee?.lastName || ""}`.trim() || "",
  notes: item?.notes || "",
});

const initialAsyncState = {
  loading: false,
  error: null,
};

export const initialState = {
  employees: {
    items: [],
    creating: false,
    createError: null,
    updating: false,
    updateError: null,
    deleting: false,
    deleteError: null,
    ...initialAsyncState,
  },
  departments: {
    items: [],
    creating: false,
    createError: null,
    updating: false,
    updateError: null,
    deleting: false,
    deleteError: null,
    ...initialAsyncState,
  },
  positions: {
    items: [],
    creating: false,
    createError: null,
    updating: false,
    updateError: null,
    deleting: false,
    deleteError: null,
    ...initialAsyncState,
  },
  contracts: {
    items: [],
    creating: false,
    createError: null,
    updating: false,
    updateError: null,
    deleting: false,
    deleteError: null,
    ...initialAsyncState,
  },
  leaves: {
    items: [],
    creating: false,
    createError: null,
    processing: false,
    processError: null,
    ...initialAsyncState,
  },
  attendances: {
    items: [],
    creating: false,
    createError: null,
    updating: false,
    updateError: null,
    deleting: false,
    deleteError: null,
    ...initialAsyncState,
  },
  documents: {
    items: [],
    creating: false,
    createError: null,
    updating: false,
    updateError: null,
    deleting: false,
    deleteError: null,
    ...initialAsyncState,
  },
  evaluations: {
    items: [],
    creating: false,
    createError: null,
    updating: false,
    updateError: null,
    deleting: false,
    deleteError: null,
    ...initialAsyncState,
  },
  trainings: {
    items: [],
    creating: false,
    createError: null,
    updating: false,
    updateError: null,
    deleting: false,
    deleteError: null,
    ...initialAsyncState,
  },
  payrolls: {
    items: [],
    creating: false,
    createError: null,
    updating: false,
    updateError: null,
    deleting: false,
    deleteError: null,
    ...initialAsyncState,
  },
  recruitmentCandidates: {
    items: [],
    creating: false,
    createError: null,
    updating: false,
    updateError: null,
    deleting: false,
    deleteError: null,
    ...initialAsyncState,
  },
  insights: {
    summary: null,
    alerts: null,
    monthlyReport: null,
    loading: false,
    error: null,
  },
};

const SET_HR_SLICE_LOADING = "SET_HR_SLICE_LOADING";
const SET_HR_SLICE_ERROR = "SET_HR_SLICE_ERROR";
const CLEAR_HR_SLICE_ERROR = "CLEAR_HR_SLICE_ERROR";
const SET_HR_SLICE_ITEMS = "SET_HR_SLICE_ITEMS";
const SET_HR_SLICE_FLAG = "SET_HR_SLICE_FLAG";
const SET_HR_SLICE_FLAG_ERROR = "SET_HR_SLICE_FLAG_ERROR";
const CLEAR_HR_SLICE_FLAG_ERROR = "CLEAR_HR_SLICE_FLAG_ERROR";
const SET_HR_INSIGHTS_LOADING = "SET_HR_INSIGHTS_LOADING";
const SET_HR_INSIGHTS_ERROR = "SET_HR_INSIGHTS_ERROR";
const SET_HR_INSIGHTS_DATA = "SET_HR_INSIGHTS_DATA";

const setSliceLoading = (slice, value) => ({ type: SET_HR_SLICE_LOADING, payload: { slice, value } });
const setSliceError = (slice, value) => ({ type: SET_HR_SLICE_ERROR, payload: { slice, value } });
const clearSliceError = (slice) => ({ type: CLEAR_HR_SLICE_ERROR, payload: { slice } });
const setSliceItems = (slice, items) => ({ type: SET_HR_SLICE_ITEMS, payload: { slice, items } });
const setSliceFlag = (slice, flag, value) => ({ type: SET_HR_SLICE_FLAG, payload: { slice, flag, value } });
const setSliceFlagError = (slice, flagError, value) => ({
  type: SET_HR_SLICE_FLAG_ERROR,
  payload: { slice, flagError, value },
});
const clearSliceFlagError = (slice, flagError) => ({
  type: CLEAR_HR_SLICE_FLAG_ERROR,
  payload: { slice, flagError },
});
const setInsightsLoading = (value) => ({ type: SET_HR_INSIGHTS_LOADING, payload: value });
const setInsightsError = (value) => ({ type: SET_HR_INSIGHTS_ERROR, payload: value });
const setInsightsData = (key, value) => ({ type: SET_HR_INSIGHTS_DATA, payload: { key, value } });

const employeePayload = (payload) => ({
  ...(payload?.employeeCode
    ? { employeeCode: String(payload.employeeCode).trim().toUpperCase() }
    : {}),
  cin: String(payload?.cin || "").trim().toUpperCase(),
  firstName: String(payload?.firstName || "").trim(),
  lastName: String(payload?.lastName || "").trim(),
  gender: String(payload?.gender || "").trim().toUpperCase(),
  birthDate: payload?.birthDate || null,
  nationality: String(payload?.nationality || "").trim(),
  email: String(payload?.email || "").trim(),
  phone: String(payload?.phone || "").trim(),
  image: payload?.image,
  status: String(payload?.status || "ACTIVE").trim().toUpperCase(),
  contractType: String(payload?.contractType || "").trim().toUpperCase(),
  hireDate: payload?.hireDate || null,
  department: payload?.departmentId || undefined,
  positionRef: payload?.positionId || undefined,
  manager: payload?.managerId || undefined,
});

const departmentPayload = (payload) => ({
  name: String(payload?.name || "").trim(),
  code: String(payload?.code || "").trim().toUpperCase(),
  description: String(payload?.description || "").trim(),
  image: payload?.image,
  manager: payload?.managerId || undefined,
  isActive: payload?.isActive !== false,
});

const positionPayload = (payload) => ({
  title: String(payload?.title || "").trim(),
  level: String(payload?.level || "").trim(),
  description: String(payload?.description || "").trim(),
  department: payload?.departmentId || undefined,
  isActive: payload?.isActive !== false,
});

const contractPayload = (payload) => {
  const result = {};
  
  if (payload?.employeeId !== undefined) result.employee = payload.employeeId;
  if (payload?.contractType !== undefined) result.contractType = String(payload.contractType).trim().toUpperCase();
  if (payload?.status !== undefined) result.status = String(payload.status).trim().toUpperCase();
  if (payload?.startDate !== undefined) result.startDate = payload.startDate;
  if (payload?.endDate !== undefined) result.endDate = payload.endDate;
  if (payload?.salaryBase !== undefined) result.salaryBase = Number(payload.salaryBase);
  if (payload?.probationMonths !== undefined) result.probationMonths = Number(payload.probationMonths);
  if (payload?.notes !== undefined) result.notes = String(payload.notes).trim();
  if (payload?.pdf !== undefined) result.pdf = payload.pdf;
  
  return result;
};

const leavePayload = (payload) => ({
  employee: payload?.employeeId || undefined,
  leaveType: String(payload?.leaveType || "ANNUAL").trim().toUpperCase(),
  startDate: payload?.startDate || undefined,
  endDate: payload?.endDate || undefined,
  reason: String(payload?.reason || "").trim(),
});

const attendancePayload = (payload) => ({
  employeeId: payload?.employeeId,
  attendanceDate: payload?.attendanceDate,
  checkIn: payload?.checkIn,
  checkOut: payload?.checkOut,
  status: payload?.status ? String(payload.status).trim().toUpperCase() : undefined,
  notes: payload?.notes,
});

const documentPayload = (payload) => ({
  employeeId: payload?.employeeId,
  documentType: payload?.documentType ? String(payload.documentType).trim().toUpperCase() : undefined,
  title: payload?.title,
  fileUrl: payload?.fileUrl,
  filePublicId: payload?.filePublicId,
  issueDate: payload?.issueDate,
  expirationDate: payload?.expirationDate,
  status: payload?.status ? String(payload.status).trim().toUpperCase() : undefined,
  notes: payload?.notes,
});

const evaluationPayload = (payload) => ({
  employeeId: payload?.employeeId,
  periodLabel: payload?.periodLabel,
  evaluationDate: payload?.evaluationDate,
  technicalScore: payload?.technicalScore,
  behaviorScore: payload?.behaviorScore,
  goalScore: payload?.goalScore,
  comments: payload?.comments,
  nextReviewDate: payload?.nextReviewDate,
  status: payload?.status ? String(payload.status).trim().toUpperCase() : undefined,
});

const trainingPayload = (payload) => ({
  title: payload?.title,
  provider: payload?.provider,
  description: payload?.description,
  startDate: payload?.startDate,
  endDate: payload?.endDate,
  location: payload?.location,
  status: payload?.status ? String(payload.status).trim().toUpperCase() : undefined,
  budget: payload?.budget,
  trainer: payload?.trainer,
  participants: payload?.participants,
  certificateUrl: payload?.certificateUrl,
});

const payrollPayload = (payload) => ({
  employeeId: payload?.employeeId,
  periodMonth: payload?.periodMonth,
  periodYear: payload?.periodYear,
  grossSalary: payload?.grossSalary,
  bonusAmount: payload?.bonusAmount,
  deductionAmount: payload?.deductionAmount,
  paymentDate: payload?.paymentDate,
  status: payload?.status ? String(payload.status).trim().toUpperCase() : undefined,
  notes: payload?.notes,
});

const recruitmentPayload = (payload) => ({
  fullName: payload?.fullName,
  email: payload?.email,
  phone: payload?.phone,
  positionTitle: payload?.positionTitle,
  source: payload?.source,
  expectedSalary: payload?.expectedSalary,
  cvUrl: payload?.cvUrl,
  status: payload?.status ? String(payload.status).trim().toUpperCase() : undefined,
  notes: payload?.notes,
  hiredEmployeeId: payload?.hiredEmployeeId || payload?.hiredEmployee,
});

const entityCrudFactory = ({ slice, getList, createOne, updateOne, deleteOne, payloadFormatter, mapper, createMessage, updateMessage, deleteMessage, listErrorMessage }) => {
  const fetchList = () => async (dispatch) => {
    dispatch(setSliceLoading(slice, true));
    dispatch(clearSliceError(slice));
    try {
      const data = await getList();
      const items = toArray(data, ["data", "items", slice, "results"]).map((item, index) => mapper(item, index));
      dispatch(setSliceItems(slice, items));
      dispatch(setSliceLoading(slice, false));
      return { success: true, items };
    } catch (error) {
      const errorMessage = error?.response?.data?.message || listErrorMessage;
      dispatch(setSliceError(slice, errorMessage));
      dispatch(setSliceLoading(slice, false));
      return { success: false, error: errorMessage };
    }
  };

  const createThunk = (payload) => async (dispatch) => {
    dispatch(setSliceFlag(slice, "creating", true));
    dispatch(clearSliceFlagError(slice, "createError"));
    try {
      const data = await createOne(payloadFormatter(payload));
      await dispatch(fetchList());
      dispatch(setSliceFlag(slice, "creating", false));
      return { success: true, data };
    } catch (error) {
      const errorMessage = error?.response?.data?.message || createMessage;
      dispatch(setSliceFlagError(slice, "createError", errorMessage));
      dispatch(setSliceFlag(slice, "creating", false));
      return { success: false, error: errorMessage };
    }
  };

  const updateThunk = (id, payload) => async (dispatch) => {
    dispatch(setSliceFlag(slice, "updating", true));
    dispatch(clearSliceFlagError(slice, "updateError"));
    try {
      const data = await updateOne(id, payloadFormatter(payload));
      await dispatch(fetchList());
      dispatch(setSliceFlag(slice, "updating", false));
      return { success: true, data };
    } catch (error) {
      const errorMessage = error?.response?.data?.message || updateMessage;
      dispatch(setSliceFlagError(slice, "updateError", errorMessage));
      dispatch(setSliceFlag(slice, "updating", false));
      return { success: false, error: errorMessage };
    }
  };

  const deleteThunk = (id) => async (dispatch) => {
    dispatch(setSliceFlag(slice, "deleting", true));
    dispatch(clearSliceFlagError(slice, "deleteError"));
    try {
      const data = await deleteOne(id);
      await dispatch(fetchList());
      dispatch(setSliceFlag(slice, "deleting", false));
      return { success: true, data };
    } catch (error) {
      const errorMessage = error?.response?.data?.message || deleteMessage;
      dispatch(setSliceFlagError(slice, "deleteError", errorMessage));
      dispatch(setSliceFlag(slice, "deleting", false));
      return { success: false, error: errorMessage };
    }
  };

  return { fetchList, createThunk, updateThunk, deleteThunk };
};

const attendanceCrud = entityCrudFactory({
  slice: "attendances",
  getList: getAttendances,
  createOne: createAttendance,
  updateOne: updateAttendance,
  deleteOne: deleteAttendance,
  payloadFormatter: attendancePayload,
  mapper: mapAttendance,
  createMessage: "Erreur lors de la création de la présence.",
  updateMessage: "Erreur lors de la mise à jour de la présence.",
  deleteMessage: "Erreur lors de la suppression de la présence.",
  listErrorMessage: "Erreur lors du chargement des présences.",
});

const documentCrud = entityCrudFactory({
  slice: "documents",
  getList: getDocuments,
  createOne: createDocument,
  updateOne: updateDocument,
  deleteOne: deleteDocument,
  payloadFormatter: documentPayload,
  mapper: mapDocument,
  createMessage: "Erreur lors de la création du document.",
  updateMessage: "Erreur lors de la mise à jour du document.",
  deleteMessage: "Erreur lors de la suppression du document.",
  listErrorMessage: "Erreur lors du chargement des documents.",
});

const evaluationCrud = entityCrudFactory({
  slice: "evaluations",
  getList: getEvaluations,
  createOne: createEvaluation,
  updateOne: updateEvaluation,
  deleteOne: deleteEvaluation,
  payloadFormatter: evaluationPayload,
  mapper: mapEvaluation,
  createMessage: "Erreur lors de la création de l'évaluation.",
  updateMessage: "Erreur lors de la mise à jour de l'évaluation.",
  deleteMessage: "Erreur lors de la suppression de l'évaluation.",
  listErrorMessage: "Erreur lors du chargement des évaluations.",
});

const trainingCrud = entityCrudFactory({
  slice: "trainings",
  getList: getTrainings,
  createOne: createTraining,
  updateOne: updateTraining,
  deleteOne: deleteTraining,
  payloadFormatter: trainingPayload,
  mapper: mapTraining,
  createMessage: "Erreur lors de la création de la formation.",
  updateMessage: "Erreur lors de la mise à jour de la formation.",
  deleteMessage: "Erreur lors de la suppression de la formation.",
  listErrorMessage: "Erreur lors du chargement des formations.",
});

const payrollCrud = entityCrudFactory({
  slice: "payrolls",
  getList: getPayrolls,
  createOne: createPayroll,
  updateOne: updatePayroll,
  deleteOne: deletePayroll,
  payloadFormatter: payrollPayload,
  mapper: mapPayroll,
  createMessage: "Erreur lors de la création de la paie.",
  updateMessage: "Erreur lors de la mise à jour de la paie.",
  deleteMessage: "Erreur lors de la suppression de la paie.",
  listErrorMessage: "Erreur lors du chargement des paies.",
});

const recruitmentCrud = entityCrudFactory({
  slice: "recruitmentCandidates",
  getList: getRecruitmentCandidates,
  createOne: createRecruitmentCandidate,
  updateOne: updateRecruitmentCandidate,
  deleteOne: deleteRecruitmentCandidate,
  payloadFormatter: recruitmentPayload,
  mapper: mapRecruitmentCandidate,
  createMessage: "Erreur lors de la création du candidat.",
  updateMessage: "Erreur lors de la mise à jour du candidat.",
  deleteMessage: "Erreur lors de la suppression du candidat.",
  listErrorMessage: "Erreur lors du chargement des candidats.",
});

export const fetchHrAttendances = attendanceCrud.fetchList;
export const createHrAttendanceThunk = attendanceCrud.createThunk;
export const updateHrAttendanceThunk = attendanceCrud.updateThunk;
export const deleteHrAttendanceThunk = attendanceCrud.deleteThunk;

export const fetchHrDocuments = documentCrud.fetchList;
export const createHrDocumentThunk = documentCrud.createThunk;
export const updateHrDocumentThunk = documentCrud.updateThunk;
export const deleteHrDocumentThunk = documentCrud.deleteThunk;

export const fetchHrEvaluations = evaluationCrud.fetchList;
export const createHrEvaluationThunk = evaluationCrud.createThunk;
export const updateHrEvaluationThunk = evaluationCrud.updateThunk;
export const deleteHrEvaluationThunk = evaluationCrud.deleteThunk;

export const fetchHrTrainings = trainingCrud.fetchList;
export const createHrTrainingThunk = trainingCrud.createThunk;
export const updateHrTrainingThunk = trainingCrud.updateThunk;
export const deleteHrTrainingThunk = trainingCrud.deleteThunk;

export const fetchHrPayrolls = payrollCrud.fetchList;
export const createHrPayrollThunk = payrollCrud.createThunk;
export const updateHrPayrollThunk = payrollCrud.updateThunk;
export const deleteHrPayrollThunk = payrollCrud.deleteThunk;

export const fetchHrRecruitmentCandidates = recruitmentCrud.fetchList;
export const createHrRecruitmentCandidateThunk = recruitmentCrud.createThunk;
export const updateHrRecruitmentCandidateThunk = recruitmentCrud.updateThunk;
export const deleteHrRecruitmentCandidateThunk = recruitmentCrud.deleteThunk;

export const fetchHrSummaryThunk = () => async (dispatch) => {
  dispatch(setInsightsLoading(true));
  dispatch(setInsightsError(null));
  try {
    const data = await getHrSummary();
    dispatch(setInsightsData("summary", data));
    dispatch(setInsightsLoading(false));
    return { success: true, data };
  } catch (error) {
    const errorMessage = error?.response?.data?.message || "Erreur lors du chargement du résumé RH.";
    dispatch(setInsightsError(errorMessage));
    dispatch(setInsightsLoading(false));
    return { success: false, error: errorMessage };
  }
};

export const fetchHrAlertsThunk = () => async (dispatch) => {
  dispatch(setInsightsLoading(true));
  dispatch(setInsightsError(null));
  try {
    const data = await getHrAlerts();
    dispatch(setInsightsData("alerts", data));
    dispatch(setInsightsLoading(false));
    return { success: true, data };
  } catch (error) {
    const errorMessage = error?.response?.data?.message || "Erreur lors du chargement des alertes RH.";
    dispatch(setInsightsError(errorMessage));
    dispatch(setInsightsLoading(false));
    return { success: false, error: errorMessage };
  }
};

export const fetchHrMonthlyReportThunk = (month) => async (dispatch) => {
  dispatch(setInsightsLoading(true));
  dispatch(setInsightsError(null));
  try {
    const data = await getHrMonthlyReport(month ? { month } : {});
    dispatch(setInsightsData("monthlyReport", data));
    dispatch(setInsightsLoading(false));
    return { success: true, data };
  } catch (error) {
    const errorMessage = error?.response?.data?.message || "Erreur lors du chargement du reporting RH.";
    dispatch(setInsightsError(errorMessage));
    dispatch(setInsightsLoading(false));
    return { success: false, error: errorMessage };
  }
};

export const fetchHrEmployees = () => {
  return async (dispatch) => {
    dispatch(setSliceLoading("employees", true));
    dispatch(clearSliceError("employees"));

    try {
      const data = await getEmployees();
      const items = toArray(data, ["data", "items", "employees", "results"]).map((item, index) => mapEmployee(item, index));
      dispatch(setSliceItems("employees", items));
      dispatch(setSliceLoading("employees", false));
      return { success: true, items };
    } catch (error) {
      const errorMessage = error?.response?.data?.message || "Erreur lors du chargement des employes.";
      dispatch(setSliceError("employees", errorMessage));
      dispatch(setSliceLoading("employees", false));
      return { success: false, error: errorMessage };
    }
  };
};

export const createHrEmployeeThunk = (payload) => {
  return async (dispatch) => {
    dispatch(setSliceFlag("employees", "creating", true));
    dispatch(clearSliceFlagError("employees", "createError"));

    try {
      const data = await createEmployee(employeePayload(payload));
      await dispatch(fetchHrEmployees());
      dispatch(setSliceFlag("employees", "creating", false));
      return { success: true, data };
    } catch (error) {
      const errorMessage = error?.response?.data?.message || "Erreur lors de la creation de l'employe.";
      dispatch(setSliceFlagError("employees", "createError", errorMessage));
      dispatch(setSliceFlag("employees", "creating", false));
      return { success: false, error: errorMessage };
    }
  };
};

export const updateHrEmployeeThunk = (id, payload) => {
  return async (dispatch) => {
    dispatch(setSliceFlag("employees", "updating", true));
    dispatch(clearSliceFlagError("employees", "updateError"));

    try {
      const data = await updateEmployee(id, employeePayload(payload));
      await dispatch(fetchHrEmployees());
      dispatch(setSliceFlag("employees", "updating", false));
      return { success: true, data };
    } catch (error) {
      const errorMessage = error?.response?.data?.message || "Erreur lors de la mise a jour de l'employe.";
      dispatch(setSliceFlagError("employees", "updateError", errorMessage));
      dispatch(setSliceFlag("employees", "updating", false));
      return { success: false, error: errorMessage };
    }
  };
};

export const deleteHrEmployeeThunk = (id) => {
  return async (dispatch) => {
    dispatch(setSliceFlag("employees", "deleting", true));
    dispatch(clearSliceFlagError("employees", "deleteError"));

    try {
      const data = await deleteEmployee(id);
      await dispatch(fetchHrEmployees());
      dispatch(setSliceFlag("employees", "deleting", false));
      return { success: true, data };
    } catch (error) {
      const errorMessage = error?.response?.data?.message || "Erreur lors de la suppression de l'employe.";
      dispatch(setSliceFlagError("employees", "deleteError", errorMessage));
      dispatch(setSliceFlag("employees", "deleting", false));
      return { success: false, error: errorMessage };
    }
  };
};

export const fetchHrDepartments = () => {
  return async (dispatch) => {
    dispatch(setSliceLoading("departments", true));
    dispatch(clearSliceError("departments"));

    try {
      const data = await getDepartments();
      const items = toArray(data, ["data", "items", "departments", "results"]).map((item, index) => mapDepartment(item, index));
      dispatch(setSliceItems("departments", items));
      dispatch(setSliceLoading("departments", false));
      return { success: true, items };
    } catch (error) {
      const errorMessage = error?.response?.data?.message || "Erreur lors du chargement des departements.";
      dispatch(setSliceError("departments", errorMessage));
      dispatch(setSliceLoading("departments", false));
      return { success: false, error: errorMessage };
    }
  };
};

export const createHrDepartmentThunk = (payload) => {
  return async (dispatch) => {
    dispatch(setSliceFlag("departments", "creating", true));
    dispatch(clearSliceFlagError("departments", "createError"));

    try {
      const data = await createDepartment(departmentPayload(payload));
      await dispatch(fetchHrDepartments());
      dispatch(setSliceFlag("departments", "creating", false));
      return { success: true, data };
    } catch (error) {
      const errorMessage = error?.response?.data?.message || "Erreur lors de la creation du departement.";
      dispatch(setSliceFlagError("departments", "createError", errorMessage));
      dispatch(setSliceFlag("departments", "creating", false));
      return { success: false, error: errorMessage };
    }
  };
};

export const updateHrDepartmentThunk = (id, payload) => {
  return async (dispatch) => {
    dispatch(setSliceFlag("departments", "updating", true));
    dispatch(clearSliceFlagError("departments", "updateError"));

    try {
      const data = await updateDepartment(id, departmentPayload(payload));
      await dispatch(fetchHrDepartments());
      dispatch(setSliceFlag("departments", "updating", false));
      return { success: true, data };
    } catch (error) {
      const errorMessage = error?.response?.data?.message || "Erreur lors de la mise a jour du departement.";
      dispatch(setSliceFlagError("departments", "updateError", errorMessage));
      dispatch(setSliceFlag("departments", "updating", false));
      return { success: false, error: errorMessage };
    }
  };
};

export const deleteHrDepartmentThunk = (id) => {
  return async (dispatch) => {
    dispatch(setSliceFlag("departments", "deleting", true));
    dispatch(clearSliceFlagError("departments", "deleteError"));

    try {
      const data = await deleteDepartment(id);
      await dispatch(fetchHrDepartments());
      dispatch(setSliceFlag("departments", "deleting", false));
      return { success: true, data };
    } catch (error) {
      const errorMessage = error?.response?.data?.message || "Erreur lors de la suppression du departement.";
      dispatch(setSliceFlagError("departments", "deleteError", errorMessage));
      dispatch(setSliceFlag("departments", "deleting", false));
      return { success: false, error: errorMessage };
    }
  };
};

export const fetchHrPositions = () => {
  return async (dispatch) => {
    dispatch(setSliceLoading("positions", true));
    dispatch(clearSliceError("positions"));

    try {
      const data = await getPositions();
      const items = toArray(data, ["data", "items", "positions", "results"]).map((item, index) => mapPosition(item, index));
      dispatch(setSliceItems("positions", items));
      dispatch(setSliceLoading("positions", false));
      return { success: true, items };
    } catch (error) {
      const errorMessage = error?.response?.data?.message || "Erreur lors du chargement des postes.";
      dispatch(setSliceError("positions", errorMessage));
      dispatch(setSliceLoading("positions", false));
      return { success: false, error: errorMessage };
    }
  };
};

export const createHrPositionThunk = (payload) => {
  return async (dispatch) => {
    dispatch(setSliceFlag("positions", "creating", true));
    dispatch(clearSliceFlagError("positions", "createError"));

    try {
      const data = await createPosition(positionPayload(payload));
      await dispatch(fetchHrPositions());
      dispatch(setSliceFlag("positions", "creating", false));
      return { success: true, data };
    } catch (error) {
      const errorMessage = error?.response?.data?.message || "Erreur lors de la creation du poste.";
      dispatch(setSliceFlagError("positions", "createError", errorMessage));
      dispatch(setSliceFlag("positions", "creating", false));
      return { success: false, error: errorMessage };
    }
  };
};

export const updateHrPositionThunk = (id, payload) => {
  return async (dispatch) => {
    dispatch(setSliceFlag("positions", "updating", true));
    dispatch(clearSliceFlagError("positions", "updateError"));

    try {
      const data = await updatePosition(id, positionPayload(payload));
      await dispatch(fetchHrPositions());
      dispatch(setSliceFlag("positions", "updating", false));
      return { success: true, data };
    } catch (error) {
      const errorMessage = error?.response?.data?.message || "Erreur lors de la mise a jour du poste.";
      dispatch(setSliceFlagError("positions", "updateError", errorMessage));
      dispatch(setSliceFlag("positions", "updating", false));
      return { success: false, error: errorMessage };
    }
  };
};

export const deleteHrPositionThunk = (id) => {
  return async (dispatch) => {
    dispatch(setSliceFlag("positions", "deleting", true));
    dispatch(clearSliceFlagError("positions", "deleteError"));

    try {
      const data = await deletePosition(id);
      await dispatch(fetchHrPositions());
      dispatch(setSliceFlag("positions", "deleting", false));
      return { success: true, data };
    } catch (error) {
      const errorMessage = error?.response?.data?.message || "Erreur lors de la suppression du poste.";
      dispatch(setSliceFlagError("positions", "deleteError", errorMessage));
      dispatch(setSliceFlag("positions", "deleting", false));
      return { success: false, error: errorMessage };
    }
  };
};

export const fetchHrContracts = () => {
  return async (dispatch) => {
    dispatch(setSliceLoading("contracts", true));
    dispatch(clearSliceError("contracts"));

    try {
      const data = await getContracts();
      console.log("Raw contracts data from API:", data);
      const items = toArray(data, ["data", "items", "contracts", "results"]).map((item, index) => mapContract(item, index));
      console.log("Mapped contracts:", items);
      items.forEach((c, i) => {
        console.log(`  Contract ${i + 1}: ${c.employeeName} - pdfUrl: ${c.pdfUrl ? "✓ Present" : "✗ Empty"}`);
      });
      dispatch(setSliceItems("contracts", items));
      dispatch(setSliceLoading("contracts", false));
      return { success: true, items };
    } catch (error) {
      const errorMessage = error?.response?.data?.message || "Erreur lors du chargement des contrats.";
      dispatch(setSliceError("contracts", errorMessage));
      dispatch(setSliceLoading("contracts", false));
      return { success: false, error: errorMessage };
    }
  };
};

export const createHrContractThunk = (payload) => {
  return async (dispatch) => {
    dispatch(setSliceFlag("contracts", "creating", true));
    dispatch(clearSliceFlagError("contracts", "createError"));

    try {
      console.log("Creating contract with payload:", payload);
      const data = await createContract(contractPayload(payload));
      console.log("Contract created response:", data);
      await dispatch(fetchHrContracts());
      dispatch(setSliceFlag("contracts", "creating", false));
      return { success: true, data };
    } catch (error) {
      const errorMessage = error?.response?.data?.message || "Erreur lors de la creation du contrat.";
      console.error("Error creating contract:", errorMessage, error);
      dispatch(setSliceFlagError("contracts", "createError", errorMessage));
      dispatch(setSliceFlag("contracts", "creating", false));
      return { success: false, error: errorMessage };
    }
  };
};

export const updateHrContractThunk = (id, payload) => {
  return async (dispatch) => {
    dispatch(setSliceFlag("contracts", "updating", true));
    dispatch(clearSliceFlagError("contracts", "updateError"));

    try {
      const transformedPayload = contractPayload(payload);
      const data = await updateContract(id, transformedPayload);
      await dispatch(fetchHrContracts());
      dispatch(setSliceFlag("contracts", "updating", false));
      return { success: true, data };
    } catch (error) {
      const errorMessage = error?.response?.data?.message || error?.message || "Erreur lors de la mise a jour du contrat.";
      console.error("Contract update error:", errorMessage);
      dispatch(setSliceFlagError("contracts", "updateError", errorMessage));
      dispatch(setSliceFlag("contracts", "updating", false));
      return { success: false, error: errorMessage };
    }
  };
};

export const deleteHrContractThunk = (contractId) => {
  return async (dispatch) => {
    dispatch(setSliceFlag("contracts", "deleting", true));
    dispatch(clearSliceFlagError("contracts", "deleteError"));

    try {
      // Supprimer le contrat
      const data = await deleteContract(contractId);
      
      // Récupérer la liste des contrats et l'employé associé
      await dispatch(fetchHrContracts());
      
      // Marquer l'employé comme inactif si tous ses contrats sont supprimés/terminés
      const contractState = await new Promise((resolve) => {
        dispatch((state) => {
          resolve(state.hr?.contracts);
        });
      });
      
      // Note: Pour implémenter complètement la logique, il faudrait:
      // 1. Récupérer l'employé du contrat supprimé
      // 2. Vérifier s'il a d'autres contrats actifs
      // 3. Si non, le marquer comme INACTIVE
      // Cela nécessiterait une modification backend ou une API dédiée
      
      dispatch(setSliceFlag("contracts", "deleting", false));
      return { success: true, data };
    } catch (error) {
      const errorMessage = error?.response?.data?.message || "Erreur lors de la suppression du contrat.";
      dispatch(setSliceFlagError("contracts", "deleteError", errorMessage));
      dispatch(setSliceFlag("contracts", "deleting", false));
      return { success: false, error: errorMessage };
    }
  };
};

export const fetchHrLeaves = () => {
  return async (dispatch) => {
    dispatch(setSliceLoading("leaves", true));
    dispatch(clearSliceError("leaves"));

    try {
      const data = await getLeaves();
      const items = toArray(data, ["data", "items", "leaves", "results"]).map((item, index) => mapLeave(item, index));
      dispatch(setSliceItems("leaves", items));
      dispatch(setSliceLoading("leaves", false));
      return { success: true, items };
    } catch (error) {
      const errorMessage = error?.response?.data?.message || "Erreur lors du chargement des conges.";
      dispatch(setSliceError("leaves", errorMessage));
      dispatch(setSliceLoading("leaves", false));
      return { success: false, error: errorMessage };
    }
  };
};

export const createHrLeaveThunk = (payload) => {
  return async (dispatch) => {
    dispatch(setSliceFlag("leaves", "creating", true));
    dispatch(clearSliceFlagError("leaves", "createError"));

    try {
      const data = await createLeave(leavePayload(payload));
      await dispatch(fetchHrLeaves());
      dispatch(setSliceFlag("leaves", "creating", false));
      return { success: true, data };
    } catch (error) {
      const errorMessage = error?.response?.data?.message || "Erreur lors de la creation de la demande de conge.";
      dispatch(setSliceFlagError("leaves", "createError", errorMessage));
      dispatch(setSliceFlag("leaves", "creating", false));
      return { success: false, error: errorMessage };
    }
  };
};

const processLeave = (apiCall, defaultErrorMessage) => {
  return (id, payload = {}) => {
    return async (dispatch) => {
      dispatch(setSliceFlag("leaves", "processing", true));
      dispatch(clearSliceFlagError("leaves", "processError"));

      try {
        const data = await apiCall(id, payload);
        await dispatch(fetchHrLeaves());
        dispatch(setSliceFlag("leaves", "processing", false));
        return { success: true, data };
      } catch (error) {
        const errorMessage = error?.response?.data?.message || defaultErrorMessage;
        dispatch(setSliceFlagError("leaves", "processError", errorMessage));
        dispatch(setSliceFlag("leaves", "processing", false));
        return { success: false, error: errorMessage };
      }
    };
  };
};

export const approveHrLeaveThunk = processLeave(approveLeave, "Erreur lors de l'approbation du conge.");
export const rejectHrLeaveThunk = processLeave(rejectLeave, "Erreur lors du rejet du conge.");
export const cancelHrLeaveThunk = processLeave(cancelLeave, "Erreur lors de l'annulation du conge.");

function HrReducer(state = initialState, action) {
  switch (action.type) {
    case SET_HR_SLICE_LOADING: {
      const { slice, value } = action.payload;
      return { ...state, [slice]: { ...state[slice], loading: value } };
    }
    case SET_HR_SLICE_ERROR: {
      const { slice, value } = action.payload;
      return { ...state, [slice]: { ...state[slice], error: value } };
    }
    case CLEAR_HR_SLICE_ERROR: {
      const { slice } = action.payload;
      return { ...state, [slice]: { ...state[slice], error: null } };
    }
    case SET_HR_SLICE_ITEMS: {
      const { slice, items } = action.payload;
      return { ...state, [slice]: { ...state[slice], items } };
    }
    case SET_HR_SLICE_FLAG: {
      const { slice, flag, value } = action.payload;
      return { ...state, [slice]: { ...state[slice], [flag]: value } };
    }
    case SET_HR_SLICE_FLAG_ERROR: {
      const { slice, flagError, value } = action.payload;
      return { ...state, [slice]: { ...state[slice], [flagError]: value } };
    }
    case CLEAR_HR_SLICE_FLAG_ERROR: {
      const { slice, flagError } = action.payload;
      return { ...state, [slice]: { ...state[slice], [flagError]: null } };
    }
    case SET_HR_INSIGHTS_LOADING: {
      return { ...state, insights: { ...state.insights, loading: action.payload } };
    }
    case SET_HR_INSIGHTS_ERROR: {
      return { ...state, insights: { ...state.insights, error: action.payload } };
    }
    case SET_HR_INSIGHTS_DATA: {
      const { key, value } = action.payload;
      return { ...state, insights: { ...state.insights, [key]: value } };
    }
    default:
      return state;
  }
}

export default HrReducer;
