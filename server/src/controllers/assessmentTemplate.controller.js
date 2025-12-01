import prisma from '../../db.config.js';

// Create assessment template with components
const createTemplate = async (req, res) => {
  try {
    const { name, description, components } = req.body;
    const userId = req.user.id;

    // Validate that total weightage equals 100
    const totalWeightage = components.reduce((sum, comp) => sum + comp.weightage, 0);
    if (Math.abs(totalWeightage - 100) > 0.01) {
      return res.status(400).json({
        success: false,
        message: `Total weightage must equal 100%. Current total: ${totalWeightage}%`
      });
    }

    // Create template with components
    const template = await prisma.assessmentTemplate.create({
      data: {
        name,
        description,
        userId,
        components: {
          create: components.map(comp => ({
            name: comp.name,
            weightage: comp.weightage,
            maxScore: comp.maxScore
          }))
        }
      },
      include: {
        components: true
      }
    });

    res.status(201).json({
      success: true,
      message: 'Assessment template created successfully',
      data: template
    });
  } catch (error) {
    console.error('Error creating template:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create assessment template',
      error: error.message
    });
  }
};

// Get all templates for a user
const getTemplates = async (req, res) => {
  try {
    const userId = req.user.id;

    const templates = await prisma.assessmentTemplate.findMany({
      where: { userId },
      include: {
        components: {
          orderBy: { createdAt: 'asc' }
        },
        subjectAssessments: {
          include: {
            subject: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.status(200).json({
      success: true,
      data: templates
    });
  } catch (error) {
    console.error('Error fetching templates:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch templates',
      error: error.message
    });
  }
};

// Get template by ID
const getTemplateById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const template = await prisma.assessmentTemplate.findFirst({
      where: {
        id: BigInt(id),
        userId
      },
      include: {
        components: {
          orderBy: { createdAt: 'asc' }
        }
      }
    });

    if (!template) {
      return res.status(404).json({
        success: false,
        message: 'Template not found'
      });
    }

    res.status(200).json({
      success: true,
      data: template
    });
  } catch (error) {
    console.error('Error fetching template:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch template',
      error: error.message
    });
  }
};

// Update template
const updateTemplate = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, components } = req.body;
    const userId = req.user.id;

    // Validate ownership
    const existingTemplate = await prisma.assessmentTemplate.findFirst({
      where: {
        id: BigInt(id),
        userId
      }
    });

    if (!existingTemplate) {
      return res.status(404).json({
        success: false,
        message: 'Template not found'
      });
    }

    // Validate total weightage if components provided
    if (components) {
      const totalWeightage = components.reduce((sum, comp) => sum + comp.weightage, 0);
      if (Math.abs(totalWeightage - 100) > 0.01) {
        return res.status(400).json({
          success: false,
          message: `Total weightage must equal 100%. Current total: ${totalWeightage}%`
        });
      }
    }

    // Delete existing components and create new ones
    await prisma.assessmentComponent.deleteMany({
      where: { templateId: BigInt(id) }
    });

    const template = await prisma.assessmentTemplate.update({
      where: { id: BigInt(id) },
      data: {
        name,
        description,
        components: components ? {
          create: components.map(comp => ({
            name: comp.name,
            weightage: comp.weightage,
            maxScore: comp.maxScore
          }))
        } : undefined
      },
      include: {
        components: true
      }
    });

    res.status(200).json({
      success: true,
      message: 'Template updated successfully',
      data: template
    });
  } catch (error) {
    console.error('Error updating template:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update template',
      error: error.message
    });
  }
};

// Delete template
const deleteTemplate = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    // Validate ownership
    const template = await prisma.assessmentTemplate.findFirst({
      where: {
        id: BigInt(id),
        userId
      }
    });

    if (!template) {
      return res.status(404).json({
        success: false,
        message: 'Template not found'
      });
    }

    await prisma.assessmentTemplate.delete({
      where: { id: BigInt(id) }
    });

    res.status(200).json({
      success: true,
      message: 'Template deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting template:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete template',
      error: error.message
    });
  }
};

export {
  createTemplate,
  getTemplates,
  getTemplateById,
  updateTemplate,
  deleteTemplate
};

