const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const moment = require("moment");

async function formatResults(results) {
  const company = new Company();
  const student = new Student();
  let newResults = [];
  for (let i = 0; i < results.length; i++) {
    const { name: compName } = await company.findCompany(results[i].companyId);
    const { name: stuName } = await student.findById(results[i].studentId);

    const startDate = moment(results[i].startDate).utc().format("DD-MM-YYYY");
    const endDate = moment(results[i].endDate).utc().format("DD-MM-YYYY");
    const description = results[i].description;

    newResults[i] = { stuName, compName, startDate, endDate, description };
  }

  return newResults;
}

class Internship {
  async insert(startDate, endDate, description, stuId, compId) {
    return await prisma.internship.create({
      data: {
        startDate,
        endDate,
        description,
        companyId: compId,
        studentId: stuId,
      },
    });
  }
  async findById(id) {
    return await prisma.internship.findUnique({
      where: { id },
    });
  }

  async findSurvey(studId) {
    return await prisma.internship.findMany({
      where: { studentId: studId },
    });
  }

  async findCompanySurvey(compId) {
    return await prisma.internship.findMany({
      where: { companyId: compId },
    });
  }

  async findByStartDate(startDate) {
    return await prisma.internship.findMany({
      where: { startDate },
    });
  }
}

class Student {
  async insert(name) {
    let user = await prisma.student.upsert({
      update: {},
      where: { name },
      create: {
        name,
      },
    });

    return user;
  }

  async find(name) {
    return await prisma.student.findFirst({
      where: { name },
    });
  }

  async findById(id) {
    return await prisma.student.findUnique({
      where: { id },
    });
  }
}

class Company {
  async insert(name) {
    let company = await prisma.company.upsert({
      update: {},
      where: { name },
      create: {
        name,
      },
    });
    return company;
  }
  async findCompany(id) {
    return await prisma.company.findUnique({
      where: { id },
    });
  }
  async findCompanyByName(name) {
    return await prisma.company.findUnique({
      where: { name },
    });
  }
}

class Tag {
  async insert(name) {
    let tag = await prisma.tag.upsert({
      update: {},
      where: { name },
      create: {
        name,
      },
    });
    return tag;
  }

  async findTags(id) {
    return await prisma.tag.findUnique({
      where: { id },
    });
  }
}

class InternshipTag {
  async insert(internId, tagId) {
    let internTag = await prisma.internshipTag.upsert({
      update: {},
      where: {
        internshipId_tagId: {
          internshipId: internId,
          tagId,
        },
      },
      create: {
        internshipId: internId,
        tagId,
      },
    });
    return internTag;
  }

  async find(internId) {
    return await prisma.internshipTag.findMany({
      where: { internshipId: internId },
    });
  }
}

module.exports = {
  Company,
  Student,
  Tag,
  Internship,
  InternshipTag,
  formatResults,
};
