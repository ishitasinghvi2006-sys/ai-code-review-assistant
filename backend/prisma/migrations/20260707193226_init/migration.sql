-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Review" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "language" TEXT NOT NULL,
    "sourceType" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Review_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StaticIssue" (
    "id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "severity" TEXT NOT NULL,
    "line" INTEGER,
    "reviewId" TEXT NOT NULL,

    CONSTRAINT "StaticIssue_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AiIssue" (
    "id" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "suggestion" TEXT NOT NULL,
    "severity" TEXT NOT NULL,
    "reviewId" TEXT NOT NULL,

    CONSTRAINT "AiIssue_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ComplexityMetric" (
    "id" TEXT NOT NULL,
    "cyclomaticComplexity" INTEGER NOT NULL,
    "functionCount" INTEGER NOT NULL,
    "classCount" INTEGER NOT NULL,
    "linesOfCode" INTEGER NOT NULL,
    "reviewId" TEXT NOT NULL,

    CONSTRAINT "ComplexityMetric_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "ComplexityMetric_reviewId_key" ON "ComplexityMetric"("reviewId");

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StaticIssue" ADD CONSTRAINT "StaticIssue_reviewId_fkey" FOREIGN KEY ("reviewId") REFERENCES "Review"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AiIssue" ADD CONSTRAINT "AiIssue_reviewId_fkey" FOREIGN KEY ("reviewId") REFERENCES "Review"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ComplexityMetric" ADD CONSTRAINT "ComplexityMetric_reviewId_fkey" FOREIGN KEY ("reviewId") REFERENCES "Review"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
