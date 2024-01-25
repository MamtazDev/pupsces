import axios from "axios";
import Chart from "chart.js/auto";
import Cookies from "js-cookie";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { endPoint } from "../../../../utils/config";
export default function CreditUnits({
  studentNumber,
  onRemainingCreditUnitsChange,
  onValidatedTotalUnitsChange,
  onTotalCreditUnitsChange,
}) {
  const [remainingCreditUnits, setRemainingCreditUnits] = useState(0);
  const [totalCreditUnits, setTotalCreditUnits] = useState(0);
  const [creditUnits, setCreditUnits] = useState({});

  const [dataFetched, setDataFetched] = useState(false);
  const [validatedTotalunits, setValidatedTotalUnits] = useState(0);

  const [validatedCourse, setValidatedCourse] = useState({});
  const [courseType, setCourseType] = useState("");


  const strand = Cookies.get("strand");
  const [programId, setProgramId] = useState();
  console.log("Program ID:", programId);
  console.log("Strand:", strand);
  console.log("Student Number:", studentNumber);

  useEffect(() => {
    console.log("Fetching student data...");

    async function fetchStudentData() {
      try {
        const response = await axios.get(
          `${endPoint}/students?studentNumber=${studentNumber}`
        );
        const studentData = response.data;

        setProgramId(studentData.program_id);
        console.log("Student data fetched:", studentData);
      } catch (error) {
        console.error("Error fetching student data:", error);
      }
    }

    fetchStudentData();
    console.log("Fetching student data complete.");
  }, [studentNumber]);

  //fetch validate
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch data from validateData endpoint
        const validateResponse = await axios.get(
          `${endPoint}/validateData?studentNumber=${studentNumber}`
        );

        const validateData = validateResponse.data || [];
        // const curriculumData = curriculumResponse.data || [];

        setValidatedCourse(validateData);

        setDataFetched(true);
      } catch (error) {
        console.error("Error fetching data:", error.message);
      }
    };

    // Call fetchData when the component mounts
    fetchData();
  }, [studentNumber]);

  useEffect(() => {
    // console.log("Validate Data:", validatedCourse);
  }, [validatedCourse]);

  useEffect(() => {
    let courseType = "";
    if (studentNumber.startsWith("2020") || studentNumber.startsWith("2021")) {
      courseType = 2019;
    } else {
      courseType = 2022;
    }

    setCourseType(courseType);
    axios
      .get(
        `${endPoint}/curriculum?program_id=${programId}&year_started=${courseType}`
      )
      .then((res) => {
        const combinedData = res.data;

        console.log("Curriculum Data:", combinedData);

        if (!Array.isArray(combinedData)) {
          console.error("Invalid data format. Expected an array.");
          return;
        }
        // Check if combinedData contains the expected properties
        if (combinedData.length > 0 && !("course_id" in combinedData[0])) {
          console.error("Invalid data format. Missing 'course_id' property.");
          return;
        }

        let totalCreditUnits = 0;
        combinedData.forEach((course) => {
          // console.log(
          //   `Credit Unit for ${course.course_id}: ${course.credit_unit}`
          // );
          if (
            !(
              programId === 1 &&
              (strand === "STEM" || strand === "ICT") &&
              course.course_sem === "Bridging"
            )
          ) {
            console.log(
              `Credit Unit for ${course.course_id}: ${course.credit_unit}`
            );
            totalCreditUnits += course.credit_unit;
          }
        });

        // Log the total credit units
        console.log("Total Credit Units:", totalCreditUnits);
        setTotalCreditUnits(totalCreditUnits);
        // Extract course_ids from combinedData
        const courseIds = combinedData.map((course) => course.course_id);

        // Filter the course_ids that exist in validatedCourse
        const matchingCourseIds = validatedCourse.filter((course) =>
          courseIds.includes(course.course_id)
        );

        // Log the matching course_ids
        console.log("Matching Course IDs:", matchingCourseIds);

        const creditUnitsMap = {};
        let totalValidatedCreditUnits = 0;
        matchingCourseIds.forEach((course) => {
          const matchingData = combinedData.find(
            (data) => data.course_id === course.course_id
          );
          creditUnitsMap[course.course_id] = matchingData.credit_unit;

          totalValidatedCreditUnits += matchingData.credit_unit;
        });

        console.log("Validated Total Credit Units:", totalValidatedCreditUnits);
        setValidatedTotalUnits(totalValidatedCreditUnits);

        // Log the credit units
        console.log("Credit Units:", creditUnitsMap);
        setCreditUnits(creditUnitsMap);
      })
      .catch((error) => {
        console.error("Error fetching curriculum data:", error.message);
      });
  }, [strand, programId, studentNumber, validatedCourse]);

  useEffect(() => {
    console.log("totalCreditUnits:", totalCreditUnits);
    console.log("validatedTotalUnits:", validatedTotalunits);

    const remainingCreditUnits = totalCreditUnits - validatedTotalunits;

    console.log("Remaining Credit Units:", remainingCreditUnits);
    setRemainingCreditUnits(remainingCreditUnits);
  }, [totalCreditUnits, validatedTotalunits]);

  useEffect(() => {
    console.log("Credit Units", creditUnits);
    console.log("Remaining Credit Units", remainingCreditUnits);
  }, [creditUnits, remainingCreditUnits]);

  const updateCreditUnitsData = () => {
    const remainingCreditUnits = totalCreditUnits - validatedTotalunits;
    setRemainingCreditUnits(remainingCreditUnits);

    // Notify the parent component about the change
    onRemainingCreditUnitsChange(remainingCreditUnits);
    onValidatedTotalUnitsChange(validatedTotalunits);
    onTotalCreditUnitsChange(totalCreditUnits);
  };

  useEffect(() => {
    updateCreditUnitsData();
  }, [totalCreditUnits, validatedTotalunits]);

  useEffect(() => {
    if (dataFetched) {
      const canvas = document.getElementById("myPieChart");
      const ctx = canvas.getContext("2d");
      canvas.width = 400;
      canvas.height = 400;

      const myPieChart = new Chart(ctx, {
        type: "pie",
        data: {
          labels: ["Taken Units", "Remaining Units"],
          datasets: [
            {
              data: [validatedTotalunits, remainingCreditUnits],
              backgroundColor: ["#FF5733", "#FFB000"],
            },
          ],
        },
      });

      return () => {
        myPieChart.destroy();
      };
    }
  }, [
    dataFetched,
    validatedTotalunits,
    totalCreditUnits,
    remainingCreditUnits,
  ]);

  return (
    <div>
      <canvas id="myPieChart" width="400" height="400"></canvas>
    </div>
  );
}

CreditUnits.propTypes = {
  studentNumber: PropTypes.string.isRequired,
  onRemainingCreditUnitsChange: PropTypes.func.isRequired,
  onValidatedTotalUnitsChange: PropTypes.func.isRequired,
  onTotalCreditUnitsChange: PropTypes.func.isRequired,
};
