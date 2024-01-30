import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Divider,
  Flex,
  HStack,
  Select,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import axios from "axios";
import html2pdf from "html2pdf.js";
import Cookies from "js-cookie";
import React, { useEffect, useRef, useState } from "react";
import { endPoint } from "../../../config";

function Achiever() {
  const facultyEmail = Cookies.get("facultyEmail");
  console.log("faculty email in cookies:", facultyEmail);
  const [facultyprogram, setFacultyProgram] = useState([]);
  const [studentsList, setStudentsList] = useState([]);
  const [courses, setCourses] = useState();
  const [studentNumber, setStudentNumber] = useState([]);
  const [combinedData, setCombinedData] = useState([]);
  const [selectedAcademicYear, setSelectedAcademicYear] = useState("");
  const [selectedYearLevel, setSelectedYearLevel] = useState("");

  const containerRef = useRef(null);

  const handleDownloadPDF = () => {
    const element = containerRef.current;
    const table = element.querySelector("table");
    console.log("Container reference:", element);
    // Set a specific width for the table
    if (table) {
      table.style.width = "100%";
    }

    html2pdf(element, {
      margin: 10,
      filename: "Achiever.pdf",
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: {
        unit: "mm",
        format: "legal",
        orientation: "landscape",
      },
    }).then(() => {
      if (table) {
        table.style.width = ""; // Reset to default width
      }
    });
  };

  //fetch faculty
  useEffect(() => {
    if (facultyEmail) {
      axios
        .get(`${endPoint}/faculty/${encodeURIComponent(facultyEmail)}`)
        .then((response) => {
          const facultyData = response.data;

          setFacultyProgram(facultyData.program_id);
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }, [facultyEmail]);

  //fetch students
  useEffect(() => {
    if (facultyprogram) {
      axios
        .get(`${endPoint}/students/program/${facultyprogram}`)
        .then((response) => {
          const studentsData = response.data;

          // Filter students with status "Regular"
          const regularStudentsData = studentsData.filter(
            (student) => student.status === "Regular"
          );

          setStudentsList(regularStudentsData);

          // Extract student numbers from the regularStudentsData array
          const studentNumbers = regularStudentsData.map(
            (student) => student.student_number
          );
          setStudentNumber(studentNumbers);
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }, [facultyprogram]);

  // fetch Grades

  useEffect(() => {
    const fetchGrades = async () => {
      try {
        if (studentNumber.length > 0) {
          const gradesPromises = studentNumber.map(async (number) => {
            const response = await axios.get(
              `${endPoint}/grades?studentNumber=${number}`
            );
            return response.data;
          });

          const allGradesData = await Promise.all(gradesPromises);

          // Combine studentsList, gradesData, and coursesData for each student
          const combinedDataWithSummedGrades = studentsList.map(
            (student, index) => {
              const gradesData = allGradesData[index];

              // Filter out grades that are 0 or -1
              // const validGradesData = gradesData.filter(
              //   (grade) => grade.grades !== 0 && grade.grades !== -1
              // );

              // Map course_id to course_sem and course_year
              const mappedGradesData = gradesData.map((grades) => {
                const matchingCourse = courses.find(
                  (course) => course.course_id === grades.course_id
                );
                if (matchingCourse) {
                  return {
                    ...grades,
                    course_sem: matchingCourse.course_sem,
                    course_year: matchingCourse.course_year,
                  };
                }
                return grades; // If no matching course is found
              });

              // Compute the sum of grades for every course_year and course_sem
              const summedGrade = mappedGradesData.reduce(
                (accumulator, grades) => accumulator + grades.grades,
                0
              );

              // Calculate average grade per course_year and course_sem
              const averageGrades = {};
              mappedGradesData.forEach((grades) => {
                const key = `${grades.course_year}_${grades.course_sem}`;
                if (!averageGrades[key]) {
                  averageGrades[key] = {
                    totalGrades: grades.grades,
                    gradeCount: 1,
                  };
                } else {
                  averageGrades[key].totalGrades += grades.grades;
                  averageGrades[key].gradeCount += 1;
                }
              });

              const averages = Object.entries(averageGrades).map(
                ([key, value]) => ({
                  course_year: parseInt(key.split("_")[0]),
                  course_sem: key.split("_")[1],
                  averageGrade: (value.totalGrades / value.gradeCount).toFixed(
                    2
                  ),
                })
              );

              return {
                ...student,

                summedGrade: summedGrade,
                averageGrades: averages,
              };
            }
          );

          // Set the combined data in the local state
          setCombinedData(combinedDataWithSummedGrades);

          console.log(
            "Combined Data with Summed Grades:",
            combinedDataWithSummedGrades
          );
        }
      } catch (error) {
        console.error("Error fetching grades data:", error);
      }
    };

    fetchGrades();
  }, [studentNumber, studentsList, courses]);

  // const computeSummedGrades = (combinedData) => {
  //   const summedGradesMap = {};

  //   combinedData.forEach((student) => {
  //     student.gradesData.forEach((grade) => {
  //       const key = `${grade.course_year}-${grade.course_sem}`;

  //       if (!summedGradesMap[key]) {
  //         summedGradesMap[key] = {
  //           course_year: grade.course_year,
  //           course_sem: grade.course_sem,
  //           studentNumber: grade.student_number,
  //           totalGrades: 0,
  //           gradeCount: 0,
  //         };
  //       }

  //       summedGradesMap[key].totalGrades += grade.grades;
  //       summedGradesMap[key].gradeCount += 1;
  //     });
  //   });

  //   // Calculate average grades
  //   Object.values(summedGradesMap).forEach((entry) => {
  //     entry.averageGrade =
  //       entry.gradeCount > 0
  //         ? (entry.totalGrades / entry.gradeCount).toFixed(2)
  //         : 0;
  //     entry.totalGrades = entry.totalGrades.toFixed(2);
  //   });

  //   return Object.values(summedGradesMap);
  // };

  //fetch curriculum

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const coursesResponse = await axios.get(`${endPoint}/curriculum/all`);
        setCourses(coursesResponse.data);
        console.log("coursesResponse", coursesResponse.data);
      } catch (error) {
        console.error("Error fetching courses:", error);
      }
    };

    fetchCourses();
  }, []);

  const calculateYearLevel = (studentNumber) => {
    const studentYear = parseInt(studentNumber.substring(0, 4), 10);
    const currentYear = new Date().getFullYear();
    const academicYearStartMonth = 9; // September
    const isNewAcademicYear =
      new Date().getMonth() + 1 >= academicYearStartMonth; // Adding 1 to get the current month in the range [1-12]

    return isNewAcademicYear
      ? currentYear - studentYear + 1
      : currentYear - studentYear;
  };

  const filteredStudentsByYearLevel = combinedData.filter((student) => {
    const studentYearLevel = calculateYearLevel(student.student_number);
    return studentYearLevel === parseInt(selectedYearLevel, 10);
  });

  console.log("Student Number:", studentNumber);

  console.log("STudent Data in Achiever:", studentsList);

  const renderAverageGrades = (student) => {
    console.log("Selected Year Level:", selectedYearLevel);

    return student.averageGrades
      .filter((average) => average.course_year.toString() === selectedYearLevel)
      .map((average) => {
        // Calculate the modified course_year value
        const modifiedCourseYear =
          parseInt(student.student_number.substring(0, 4), 10) +
          average.course_year;

        // Calculate the result based on your formula
        const result = `${modifiedCourseYear - 1} - ${modifiedCourseYear}`;

        const placement =
          average.averageGrade >= 1.0 && average.averageGrade <= 1.3
            ? "President Lister"
            : average.averageGrade >= 1.31 && average.averageGrade <= 1.6
            ? "Deans Lister"
            : null;

        return (
          <React.Fragment key={`${average.course_sem}_${average.course_year}`}>
            <Td>{average.averageGrade}</Td>
            <Td>{average.course_sem}</Td>
            <Td>{result}</Td>
            <Td>{placement}</Td>
          </React.Fragment>
        );
      });
  };

  const shouldDisplayData = selectedYearLevel;
  console.log("Filtered Students by Year Level:", filteredStudentsByYearLevel);

  return (
    <Card mt="2rem" w="100%" h="auto" boxShadow="2xl" borderRadius="30px">
      <div ref={containerRef}>
        <Flex justify="space-between" align="center" overflow="scroll">
          <CardHeader>Student(s) that are Listers</CardHeader>
          <HStack>
            <Select
              value={selectedAcademicYear}
              onChange={(e) => setSelectedAcademicYear(e.target.value)}
              placeholder="Academic Year"
              w="10rem"
            >
              <option value="First Semester">First Semester</option>
              <option value="Second Semester">Second Semester</option>
            </Select>
            <Select
              value={selectedYearLevel}
              onChange={(e) => setSelectedYearLevel(e.target.value)}
              placeholder="Year Level"
              w="10rem"
            >
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
            </Select>
            <Button
              mr="4rem"
              colorScheme="teal"
              style={{
                color: "white",
                transition: "background-color 0.3s ease, transform 0.3s ease",
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = "#43766C";
                e.currentTarget.style.transform = "scale(1.05)";
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = "#43766C";
                e.currentTarget.style.transform = "scale(1)";
              }}
              onClick={handleDownloadPDF}
            >
              Download
            </Button>
          </HStack>
        </Flex>
        <Divider bg="gray.300" />
        <CardBody ml="2rem" justifyContent="center">
          <TableContainer>
            <Table>
              <Thead bg="palette.primary" h="2rem">
                <Tr>
                  <Th
                    style={{ textAlign: "center" }}
                    fontSize="10px"
                    color="palette.secondary"
                  >
                    Student Number
                  </Th>
                  <Th
                    style={{ textAlign: "center" }}
                    fontSize="10px"
                    color="palette.secondary"
                  >
                    Name
                  </Th>
                  <Th
                    style={{ textAlign: "center" }}
                    fontSize="10px"
                    color="palette.secondary"
                  >
                    Average
                  </Th>
                  <Th
                    style={{ textAlign: "center" }}
                    fontSize="10px"
                    color="palette.secondary"
                  >
                    {" "}
                    Course Semester
                  </Th>
                  <Th
                    style={{ textAlign: "center" }}
                    fontSize="10px"
                    color="palette.secondary"
                  >
                    {" "}
                    Academic Year
                  </Th>
                  <Th
                    style={{ textAlign: "center" }}
                    fontSize="10px"
                    color="palette.secondary"
                  >
                    Placement
                  </Th>
                </Tr>
              </Thead>

              <Tbody>
                {shouldDisplayData ? (
                  <React.Fragment>
                    {filteredStudentsByYearLevel
                      .filter(
                        (student) =>
                          student.averageGrades &&
                          student.averageGrades.some(
                            (average) =>
                              average.course_year.toString() ===
                                selectedYearLevel &&
                              parseFloat(average.averageGrade) <= 1.61
                          )
                      )
                      .map((student) => (
                        <Tr key={student.student_number}>
                          <Td fontSize="12px">{student.student_number}</Td>
                          <Td fontSize="12px">{`${student.first_name} ${student.middle_name} ${student.last_name}`}</Td>
                          {renderAverageGrades(student)}
                        </Tr>
                      ))}
                  </React.Fragment>
                ) : (
                  <Td colSpan={6} textAlign="center" fontSize="12px">
                    Please select both year level and semester
                  </Td>
                )}
              </Tbody>
            </Table>
          </TableContainer>
        </CardBody>
      </div>
    </Card>
  );
}
export default Achiever;
