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

  async find(name) {
    let tag = await prisma.tag.findFirst({
      where: { name },
    });
    return tag;
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
}

module.exports = { Company, Student, Tag, Internship, InternshipTag };
