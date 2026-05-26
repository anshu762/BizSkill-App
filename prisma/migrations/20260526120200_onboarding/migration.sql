-- CreateEnum
CREATE TYPE "SkillLevel" AS ENUM ('BEGINNER', 'INTERMEDIATE', 'EXPERT');

-- CreateEnum
CREATE TYPE "BusinessStage" AS ENUM ('IDEA', 'BUILDING', 'LAUNCHED');

-- AlterTable: BusinessProfile industry now uses SkillCategory enum, stage uses BusinessStage
ALTER TABLE "business_profiles" ALTER COLUMN "industry" TYPE "SkillCategory" USING "industry"::text::"SkillCategory";
ALTER TABLE "business_profiles" ALTER COLUMN "stage" TYPE "BusinessStage" USING "stage"::text::"BusinessStage";

-- AlterTable: skills level uses SkillLevel enum, add isDeleted
ALTER TABLE "skills" ALTER COLUMN "level" TYPE "SkillLevel" USING "level"::text::"SkillLevel";
ALTER TABLE "skills" ADD COLUMN "isDeleted" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable: add hasOnboarded to users
ALTER TABLE "users" ADD COLUMN "hasOnboarded" BOOLEAN NOT NULL DEFAULT false;
