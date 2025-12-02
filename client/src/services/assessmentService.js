import axios from "../config/axios";

// Assessment Template APIs
export const assessmentTemplateService = {
  // Create new template
  createTemplate: async (templateData) => {
    const response = await axios.post("/api/assessment-templates", templateData);
    return response.data;
  },

  // Get all templates
  getTemplates: async () => {
    const response = await axios.get("/api/assessment-templates");
    return response.data;
  },

  // Get template by ID
  getTemplateById: async (id) => {
    const response = await axios.get(`/api/assessment-templates/${id}`);
    return response.data;
  },

  // Update template
  updateTemplate: async (id, templateData) => {
    const response = await axios.put(
      `/api/assessment-templates/${id}`,
      templateData
    );
    return response.data;
  },

  // Delete template
  deleteTemplate: async (id) => {
    const response = await axios.delete(`/api/assessment-templates/${id}`);
    return response.data;
  },
};

// Assessment Score APIs
export const assessmentScoreService = {
  // Create subject assessment (link subject to template)
  createSubjectAssessment: async (data) => {
    const response = await axios.post(
      "/api/assessment-scores/subject-assessment",
      data
    );
    return response.data;
  },

  // Add or update score
  addScore: async (scoreData) => {
    const response = await axios.post("/api/assessment-scores", scoreData);
    return response.data;
  },

  // Get scores for a subject
  getScoresBySubject: async (subjectId) => {
    const response = await axios.get(
      `/api/assessment-scores/subject/${subjectId}`
    );
    return response.data;
  },

  // Get all predictions for a semester
  getPredictionsBySemester: async (semesterId) => {
    const response = await axios.get(
      `/api/assessment-scores/predictions/${semesterId}`
    );
    return response.data;
  },
};

export default {
  assessmentTemplateService,
  assessmentScoreService,
};
