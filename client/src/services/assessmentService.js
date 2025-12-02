import axios from "axios";

const API_URL =
  import.meta.env.VITE_API_URL || "https://cgpa-analyzer.onrender.com";

// Create axios instance with credentials
const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

// Assessment Template APIs
export const assessmentTemplateService = {
  // Create new template
  createTemplate: async (templateData) => {
    const response = await api.post("/api/assessment-templates", templateData);
    return response.data;
  },

  // Get all templates
  getTemplates: async () => {
    const response = await api.get("/api/assessment-templates");
    return response.data;
  },

  // Get template by ID
  getTemplateById: async (id) => {
    const response = await api.get(`/api/assessment-templates/${id}`);
    return response.data;
  },

  // Update template
  updateTemplate: async (id, templateData) => {
    const response = await api.put(
      `/api/assessment-templates/${id}`,
      templateData
    );
    return response.data;
  },

  // Delete template
  deleteTemplate: async (id) => {
    const response = await api.delete(`/api/assessment-templates/${id}`);
    return response.data;
  },
};

// Assessment Score APIs
export const assessmentScoreService = {
  // Create subject assessment (link subject to template)
  createSubjectAssessment: async (data) => {
    const response = await api.post(
      "/api/assessment-scores/subject-assessment",
      data
    );
    return response.data;
  },

  // Add or update score
  addScore: async (scoreData) => {
    const response = await api.post("/api/assessment-scores", scoreData);
    return response.data;
  },

  // Get scores for a subject
  getScoresBySubject: async (subjectId) => {
    const response = await api.get(
      `/api/assessment-scores/subject/${subjectId}`
    );
    return response.data;
  },

  // Get all predictions for a semester
  getPredictionsBySemester: async (semesterId) => {
    const response = await api.get(
      `/api/assessment-scores/predictions/${semesterId}`
    );
    return response.data;
  },
};

export default {
  assessmentTemplateService,
  assessmentScoreService,
};
