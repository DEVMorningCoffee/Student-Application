const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

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

  async findSurvey(studId) {
    return await prisma.internship.findMany({
      where: { studentId: studId },
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

module.exports = { Company, Student, Tag, Internship, InternshipTag };
