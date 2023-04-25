/* Create Table */

CREATE TABLE public.Company (
    id text not null,
    name text not null,
    constraint Company_pkey primary key (id)
) tablespace pg_default;

CREATE unique index "Company_name_key" ON public."Company" USING btree (name) tablespace pg_default;

CREATE TABLE public.Internship (
    id text not null,
    startDate timestamp without time zone not null,
    endDate timestamp without time zone not null,
    companyId text not null,
    studentId text null,
    description text null,
    constraint Internship_pkey primary key (id),
    constraint Internship_companyId_fkey foreign key ("companyId") references "Company" (id) ON update cascade ON
DELETE restrict,
    constraint Internship_studentId_fkey foreign key ("studentId") references "Student" (id) ON update cascade ON delete
    SET
        null
) tablespace pg_default;

CREATE TABLE public.InternshipTag (
    internshipId text not null,
    tagId text not null,
    constraint InternshipTag_pkey primary key ("internshipId", "tagId"),
    constraint InternshipTag_internshipId_fkey foreign key ("internshipId") references "Internship" (id) ON update cascade ON
DELETE restrict,
    constraint InternshipTag_tagId_fkey foreign key ("tagId") references "Tag" (id) ON update cascade ON
DELETE restrict
) tablespace pg_default;

CREATE TABLE public.Student (
    id text not null,
    name text not null,
    constraint Student_pkey primary key (id)
) tablespace pg_default;

CREATE unique index "Student_name_key" ON public."Student" USING btree (name) tablespace pg_default;

CREATE TABLE public.Tag (
    id text not null,
    name text not null,
    constraint Tag_pkey primary key (id)
) tablespace pg_default;

CREATE unique index "Tag_name_key" ON public."Tag" USING btree (name) tablespace pg_default;

CREATE index if not exists "Tag_name_idx" ON public."Tag" USING btree (name) tablespace pg_default;

/* Create Table End */

SELECT * FROM Internship WHERE companyId = '<company_id>';

SELECT * FROM Internship WHERE studentId = '<student_id>';

SELECT Internship * FROM Internship
INNER JOIN InternshipTag ON Internship.id = InternshipTag.internshipId
INNER JOIN Tag ON InternshipTag.tagId = Tag.id
WHERE Tag.name = '<tag_name>';

SELECT Tag * FROM Tag
INNER JOIN InternshipTag ON Tag.id = InternshipTag.tagId
INNER JOIN Internship ON InternshipTag.internshipId = Internship.id
WHERE Internship.id = '<internship_id>';

SELECT Internship.* FROM Internship
INNER JOIN InternshipTag ON Internship.id = InternshipTag.internshipId
INNER JOIN Tag ON InternshipTag.tagId = Tag.id
WHERE Tag.name = '<tag_name>' AND Internship.companyId = '<company_id>';

INSERT INTO "Company" (id, name)
VALUES (id, name);

INSERT INTO "Internship" (id, startDate, endDate, companyId, description, studentId)
VALUES ('<internship_id>', '2023-06-01 00:00:00', '2023-09-01 00:00:00', '<company_id>', 'Assist in developing software applications', '<student_id>');

INSERT INTO "Student" (id, name)
VALUES ('<student_id>' , '<student_name>');

INSERT INTO "Tag" (id, name)
VALUES ('<tag_id>', '<tag_name>');

INSERT INTO "InternshipTag" (internshipId, tagId)
VALUES ('<internship_id>', '<tag_id>');

UPDATE Internship
SET '<internship_cell>' = '<update_value>'
WHERE id = 'internship_id';


