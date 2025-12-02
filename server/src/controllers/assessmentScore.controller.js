import prisma from '../../db.config.js';

// Helper function to calculate grade based on percentage and grading scale
const calculateGrade = async (percentage, collegeId) => {
  try {
    const grades = await prisma.grade.findMany({
      where: { collegeId },
      orderBy: { minPercentage: 'desc' }
    });

    for (const grade of grades) {
      if (percentage >= (grade.minPercentage || 0)) {
        return {
          gradeLetter: grade.gradeLetter,
          gradePoint: grade.gradePoint
        };
      }
    }

    // Return lowest grade if no match found
    return grades.length > 0 
      ? { gradeLetter: grades[grades.length - 1].gradeLetter, gradePoint: grades[grades.length - 1].gradePoint }
      : { gradeLetter: 'F', gradePoint: 0 };
  } catch (error) {
    console.error('Error calculating grade:', error);
    return { gradeLetter: 'F', gradePoint: 0 };
  }
};

// Create or link subject assessment
const createSubjectAssessment = async (req, res) => {
  try {
    const { subjectId, templateId } = req.body;
    const userId = req.user.id;

    // Verify subject belongs to user
    const subject = await prisma.subject.findFirst({
      where: {
        id: BigInt(subjectId),
        semester: {
          userId
        }
      },
      include: {
        semester: {
          include: {
            user: {
              include: {
                college: true
              }
            }
          }
        }
      }
    });

    if (!subject) {
      return res.status(404).json({
        success: false,
        message: 'Subject not found'
      });
    }

    // Verify template belongs to user
    const template = await prisma.assessmentTemplate.findFirst({
      where: {
        id: BigInt(templateId),
        userId
      }
    });

    if (!template) {
      return res.status(404).json({
        success: false,
        message: 'Template not found'
      });
    }

    // Create subject assessment
    const subjectAssessment = await prisma.subjectAssessment.create({
      data: {
        subjectId: BigInt(subjectId),
        templateId: BigInt(templateId)
      },
      include: {
        template: {
          include: {
            components: true
          }
        },
        subject: true
      }
    });

    res.status(201).json({
      success: true,
      message: 'Subject assessment created successfully',
      data: subjectAssessment
    });
  } catch (error) {
    console.error('Error creating subject assessment:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create subject assessment',
      error: error.message
    });
  }
};

// Add or update score for a component
const addScore = async (req, res) => {
  try {
    const { subjectAssessmentId, componentId, scoreObtained, maxScore } = req.body;
    const userId = req.user.id;

    // Verify subject assessment belongs to user
    const subjectAssessment = await prisma.subjectAssessment.findFirst({
      where: {
        id: BigInt(subjectAssessmentId),
        subject: {
          semester: {
            userId
          }
        }
      },
      include: {
        subject: {
          include: {
            semester: {
              include: {
                user: {
                  include: {
                    college: true
                  }
                }
              }
            }
          }
        },
        template: {
          include: {
            components: true
          }
        },
        scores: {
          include: {
            component: true
          }
        }
      }
    });

    if (!subjectAssessment) {
      return res.status(404).json({
        success: false,
        message: 'Subject assessment not found'
      });
    }

    // Upsert score
    const score = await prisma.assessmentScore.upsert({
      where: {
        componentId_subjectAssessmentId: {
          componentId: BigInt(componentId),
          subjectAssessmentId: BigInt(subjectAssessmentId)
        }
      },
      update: {
        scoreObtained,
        maxScore
      },
      create: {
        componentId: BigInt(componentId),
        subjectAssessmentId: BigInt(subjectAssessmentId),
        scoreObtained,
        maxScore
      }
    });

    // Recalculate prediction
    const updatedAssessment = await prisma.subjectAssessment.findUnique({
      where: { id: BigInt(subjectAssessmentId) },
      include: {
        scores: {
          include: {
            component: true
          }
        },
        template: {
          include: {
            components: true
          }
        },
        subject: {
          include: {
            semester: {
              include: {
                user: {
                  include: {
                    college: true
                  }
                }
              }
            }
          }
        }
      }
    });

    // Calculate weighted percentage
    let totalWeightedScore = 0;
    let totalWeightageUsed = 0;

    for (const scoreEntry of updatedAssessment.scores) {
      const percentage = (scoreEntry.scoreObtained / scoreEntry.maxScore) * 100;
      const weightedScore = (percentage * scoreEntry.component.weightage) / 100;
      totalWeightedScore += weightedScore;
      totalWeightageUsed += scoreEntry.component.weightage;
    }

    // If not all components have scores, project the current average to remaining components
    let predictedPercentage;
    if (totalWeightageUsed < 100) {
      const currentAverage = totalWeightageUsed > 0 ? totalWeightedScore / totalWeightageUsed * 100 : 0;
      const remainingWeightage = 100 - totalWeightageUsed;
      const projectedRemainingScore = (currentAverage * remainingWeightage) / 100;
      predictedPercentage = totalWeightedScore + projectedRemainingScore;
    } else {
      predictedPercentage = totalWeightedScore;
    }

    // Calculate predicted grade
    const collegeId = updatedAssessment.subject.semester.user.collegeId;
    const { gradeLetter, gradePoint } = await calculateGrade(predictedPercentage, collegeId);

    // Update subject assessment with prediction
    await prisma.subjectAssessment.update({
      where: { id: BigInt(subjectAssessmentId) },
      data: {
        predictedGrade: gradeLetter,
        predictedGradePoint: gradePoint
      }
    });

    res.status(200).json({
      success: true,
      message: 'Score added successfully',
      data: {
        score,
        prediction: {
          percentage: predictedPercentage,
          grade: gradeLetter,
          gradePoint
        }
      }
    });
  } catch (error) {
    console.error('Error adding score:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add score',
      error: error.message
    });
  }
};

// Get scores for a subject
const getScoresBySubject = async (req, res) => {
  try {
    const { subjectId } = req.params;
    const userId = req.user.id;

    const subjectAssessment = await prisma.subjectAssessment.findFirst({
      where: {
        subjectId: BigInt(subjectId),
        subject: {
          semester: {
            userId
          }
        }
      },
      include: {
        template: {
          include: {
            components: {
              orderBy: { createdAt: 'asc' }
            }
          }
        },
        scores: {
          include: {
            component: true
          }
        },
        subject: true
      }
    });

    if (!subjectAssessment) {
      return res.status(404).json({
        success: false,
        message: 'No assessment found for this subject'
      });
    }

    res.status(200).json({
      success: true,
      data: subjectAssessment
    });
  } catch (error) {
    console.error('Error fetching scores:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch scores',
      error: error.message
    });
  }
};

// Get all predictions for a semester
const getPredictionsBySemester = async (req, res) => {
  try {
    const { semesterId } = req.params;
    const userId = req.user.id;

    // Verify semester belongs to user
    const semester = await prisma.semester.findFirst({
      where: {
        id: BigInt(semesterId),
        userId
      }
    });

    if (!semester) {
      return res.status(404).json({
        success: false,
        message: 'Semester not found'
      });
    }

    const predictions = await prisma.subjectAssessment.findMany({
      where: {
        subject: {
          semesterId: BigInt(semesterId)
        }
      },
      include: {
        subject: true,
        template: {
          include: {
            components: true
          }
        },
        scores: {
          include: {
            component: true
          }
        }
      }
    });

    // Calculate predicted SGPA
    let totalCredits = 0;
    let totalWeightedGradePoints = 0;

    for (const prediction of predictions) {
      if (prediction.predictedGradePoint !== null) {
        totalCredits += prediction.subject.credits;
        totalWeightedGradePoints += prediction.predictedGradePoint * prediction.subject.credits;
      }
    }

    const predictedSGPA = totalCredits > 0 ? totalWeightedGradePoints / totalCredits : null;

    res.status(200).json({
      success: true,
      data: {
        predictions,
        predictedSGPA
      }
    });
  } catch (error) {
    console.error('Error fetching predictions:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch predictions',
      error: error.message
    });
  }
};

export {
  createSubjectAssessment,
  addScore,
  getScoresBySubject,
  getPredictionsBySemester
};
