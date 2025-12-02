const prisma = require('../generated/prisma');

const getAllPredictors = async (req, res) => {
  try {
    const userId = req.user.id;

    const predictors = await prisma.predictorSemester.findMany({
      where: { userId: BigInt(userId) },
      include: {
        subjects: {
          include: {
            components: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json({
      success: true,
      data: predictors.map(p => ({
        ...p,
        id: p.id.toString(),
        userId: p.userId.toString(),
        subjects: p.subjects.map(s => ({
          ...s,
          id: s.id.toString(),
          semesterId: s.semesterId.toString(),
          components: s.components.map(c => ({
            ...c,
            id: c.id.toString(),
            subjectId: c.subjectId.toString(),
          })),
        })),
      })),
    });
  } catch (error) {
    console.error('Error fetching predictors:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch predictors',
    });
  }
};

const getPredictorById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const predictor = await prisma.predictorSemester.findFirst({
      where: {
        id: BigInt(id),
        userId: BigInt(userId),
      },
      include: {
        subjects: {
          include: {
            components: true,
          },
        },
      },
    });

    if (!predictor) {
      return res.status(404).json({
        success: false,
        error: 'Predictor not found',
      });
    }

    res.json({
      success: true,
      data: {
        ...predictor,
        id: predictor.id.toString(),
        userId: predictor.userId.toString(),
        subjects: predictor.subjects.map(s => ({
          ...s,
          id: s.id.toString(),
          semesterId: s.semesterId.toString(),
          components: s.components.map(c => ({
            ...c,
            id: c.id.toString(),
            subjectId: c.subjectId.toString(),
          })),
        })),
      },
    });
  } catch (error) {
    console.error('Error fetching predictor:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch predictor',
    });
  }
};

const createPredictor = async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, targetCGPA, subjects } = req.body;

    // Validation
    if (!name || !targetCGPA || !Array.isArray(subjects)) {
      return res.status(400).json({
        success: false,
        error: 'Name, targetCGPA, and subjects are required',
      });
    }

    if (targetCGPA < 0 || targetCGPA > 10) {
      return res.status(400).json({
        success: false,
        error: 'Target CGPA must be between 0 and 10',
      });
    }

    // Create predictor with subjects and components
    const predictor = await prisma.predictorSemester.create({
      data: {
        userId: BigInt(userId),
        name,
        targetCGPA: parseFloat(targetCGPA),
        subjects: {
          create: subjects.map(subject => ({
            name: subject.name,
            credits: parseFloat(subject.credits),
            components: {
              create: subject.components.map(comp => ({
                name: comp.name,
                maxMarks: parseFloat(comp.maxMarks),
                obtainedMarks: comp.obtainedMarks ? parseFloat(comp.obtainedMarks) : null,
              })),
            },
          })),
        },
      },
      include: {
        subjects: {
          include: {
            components: true,
          },
        },
      },
    });

    res.status(201).json({
      success: true,
      data: {
        ...predictor,
        id: predictor.id.toString(),
        userId: predictor.userId.toString(),
        subjects: predictor.subjects.map(s => ({
          ...s,
          id: s.id.toString(),
          semesterId: s.semesterId.toString(),
          components: s.components.map(c => ({
            ...c,
            id: c.id.toString(),
            subjectId: c.subjectId.toString(),
          })),
        })),
      },
    });
  } catch (error) {
    console.error('Error creating predictor:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create predictor',
    });
  }
};

const updatePredictor = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const { name, targetCGPA, subjects } = req.body;

    // Check if predictor exists and belongs to user
    const existing = await prisma.predictorSemester.findFirst({
      where: {
        id: BigInt(id),
        userId: BigInt(userId),
      },
    });

    if (!existing) {
      return res.status(404).json({
        success: false,
        error: 'Predictor not found',
      });
    }

    // Delete existing subjects and components (cascade)
    await prisma.predictorSubject.deleteMany({
      where: { semesterId: BigInt(id) },
    });

    // Update predictor with new data
    const predictor = await prisma.predictorSemester.update({
      where: { id: BigInt(id) },
      data: {
        name: name || existing.name,
        targetCGPA: targetCGPA ? parseFloat(targetCGPA) : existing.targetCGPA,
        subjects: subjects ? {
          create: subjects.map(subject => ({
            name: subject.name,
            credits: parseFloat(subject.credits),
            components: {
              create: subject.components.map(comp => ({
                name: comp.name,
                maxMarks: parseFloat(comp.maxMarks),
                obtainedMarks: comp.obtainedMarks ? parseFloat(comp.obtainedMarks) : null,
              })),
            },
          })),
        } : undefined,
      },
      include: {
        subjects: {
          include: {
            components: true,
          },
        },
      },
    });

    res.json({
      success: true,
      data: {
        ...predictor,
        id: predictor.id.toString(),
        userId: predictor.userId.toString(),
        subjects: predictor.subjects.map(s => ({
          ...s,
          id: s.id.toString(),
          semesterId: s.semesterId.toString(),
          components: s.components.map(c => ({
            ...c,
            id: c.id.toString(),
            subjectId: c.subjectId.toString(),
          })),
        })),
      },
    });
  } catch (error) {
    console.error('Error updating predictor:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update predictor',
    });
  }
};

const deletePredictor = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    // Check if predictor exists and belongs to user
    const existing = await prisma.predictorSemester.findFirst({
      where: {
        id: BigInt(id),
        userId: BigInt(userId),
      },
    });

    if (!existing) {
      return res.status(404).json({
        success: false,
        error: 'Predictor not found',
      });
    }

    await prisma.predictorSemester.delete({
      where: { id: BigInt(id) },
    });

    res.json({
      success: true,
      message: 'Predictor deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting predictor:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete predictor',
    });
  }
};

module.exports = {
  getAllPredictors,
  getPredictorById,
  createPredictor,
  updatePredictor,
  deletePredictor,
};
