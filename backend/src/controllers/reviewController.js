const prisma = require('../prismaClient');
const { runStaticAnalysis } = require('../services/staticAnalysisService');
const { runAiReview } = require('../services/aiReviewService');
const { analyzeComplexity } = require('../services/complexityService');
const { generateDocumentation } = require('../services/documentationService');

// CREATE REVIEW (paste or file upload)
const createReview = async (req, res) => {
  try {
    const { title, language, sourceType } = req.body;
    let code = req.body.code;

    // if a file was uploaded, read its content instead
    if (req.file) {
      code = req.file.buffer.toString('utf-8');
    }

    if (!code || !title || !language) {
      return res.status(400).json({ error: 'Title, language, and code are required' });
    }

    if (title.trim().length < 1 || title.trim().length > 200) {
      return res.status(400).json({ error: 'Title must be between 1 and 200 characters' });
    }

    if (code.length > 50000) {
      return res.status(400).json({ error: 'Code exceeds maximum length of 50,000 characters' });
    }

    const allowedLanguages = ['javascript', 'typescript', 'python', 'java', 'other'];
    if (!allowedLanguages.includes(language.toLowerCase())) {
      return res.status(400).json({ error: 'Unsupported language' });
    }

    const review = await prisma.review.create({
      data: {
        title: title.trim(),
        language,
        sourceType: sourceType || (req.file ? 'upload' : 'paste'),
        code,
        userId: req.userId,
      },
    });

    // run static analysis and save results (don't block the response if this fails)
    try {
      const issues = await runStaticAnalysis(code, language);
      if (issues.length > 0) {
        await prisma.staticIssue.createMany({
          data: issues.map((issue) => ({ ...issue, reviewId: review.id })),
        });
      }
    } catch (analysisError) {
      console.error('Static analysis failed:', analysisError);
    }

    // run AI review and save results (don't block the response if this fails)
    try {
      const aiIssues = await runAiReview(code, language);
      if (aiIssues.length > 0) {
        await prisma.aiIssue.createMany({
          data: aiIssues.map((issue) => ({ ...issue, reviewId: review.id })),
        });
      }
    } catch (aiError) {
      console.error('AI review failed:', aiError);
    }

    // run complexity analysis and save results (don't block the response if this fails)
    try {
      const metrics = analyzeComplexity(code, language);
      await prisma.complexityMetric.create({
        data: { ...metrics, reviewId: review.id },
      });
    } catch (metricsError) {
      console.error('Complexity analysis failed:', metricsError);
    }

    // generate documentation and save it (don't block the response if this fails)
    try {
      const documentation = await generateDocumentation(code, language);
      await prisma.review.update({
        where: { id: review.id },
        data: { documentation },
      });
    } catch (docError) {
      console.error('Documentation generation failed:', docError);
    }

    res.status(201).json(review);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Something went wrong creating the review' });
  }
};

// GET ALL REVIEWS for logged-in user (with search and filters)
const getReviews = async (req, res) => {
  try {
    const { search, language, sourceType } = req.query;

    const where = {
      userId: req.userId,
      ...(search && {
        title: { contains: search, mode: 'insensitive' },
      }),
      ...(language && { language }),
      ...(sourceType && { sourceType }),
    };

    const reviews = await prisma.review.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        title: true,
        language: true,
        sourceType: true,
        createdAt: true,
      },
    });
    res.status(200).json(reviews);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Something went wrong fetching reviews' });
  }
};

// GET SINGLE REVIEW by id
const getReviewById = async (req, res) => {
  try {
    const review = await prisma.review.findFirst({
      where: { id: req.params.id, userId: req.userId },
      include: { staticIssues: true, aiIssues: true, metrics: true },
    });

    if (!review) {
      return res.status(404).json({ error: 'Review not found' });
    }

    res.status(200).json(review);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Something went wrong fetching the review' });
  }
};

// DELETE REVIEW
const deleteReview = async (req, res) => {
  try {
    const review = await prisma.review.findFirst({
      where: { id: req.params.id, userId: req.userId },
    });

    if (!review) {
      return res.status(404).json({ error: 'Review not found' });
    }

    await prisma.review.delete({ where: { id: req.params.id } });
    res.status(200).json({ message: 'Review deleted' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Something went wrong deleting the review' });
  }
};

module.exports = { createReview, getReviews, getReviewById, deleteReview };