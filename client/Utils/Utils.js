// import axios from "axios";
// import { toast } from "react-toastify";
// import jsPDF from "jspdf";

// export const products = [
//     {
//         image: "https://www.paneltechllc.com/wp-content/themes/paneltec/images/pr1.png",
//         name: "Sandwich Panel"
//     },
//     {
//         image: "https://www.paneltechllc.com/wp-content/themes/paneltec/images/pr2.png",
//         name: "Corrugated Profile Sheets"
//     },
//     {
//         image: "https://www.paneltechllc.com/wp-content/themes/paneltec/images/pr3.png",
//         name: "Metal Decking Sheet"
//     },
//     {
//         image: "https://www.paneltechllc.com/wp-content/themes/paneltec/images/pr4.png",
//         name: "Z & C Purlins"
//     },
//     {
//         image: "https://www.paneltechllc.com/wp-content/themes/paneltec/images/pr5.png",
//         name: "Translucent Sheet"
//     },
//     {
//         image: "https://www.paneltechllc.com/wp-content/themes/paneltec/images/pr6.png",
//         name: "Flashings"
//     },
//     {
//         image: "https://www.paneltechllc.com/wp-content/themes/paneltec/images/pr7.png",
//         name: "Roller Shutter Doors"
//     },
//     {
//         image: "https://www.paneltechllc.com/wp-content/themes/paneltec/images/pr8.png",
//         name: "Accessories"
//     }
// ];

// export const projectData = [
//     {
//         image: "https://www.paneltechllc.com/wp-content/themes/paneltec/images/blog-image-1.jpg",
//         title: "City Center Sohar",
//     },
//     {
//         image: "https://www.paneltechllc.com/wp-content/themes/paneltec/images/blog-image-2.jpg",
//         title: "Head Office National Bank of Oman",
//     },
//     {
//         image: "https://www.paneltechllc.com/wp-content/themes/paneltec/images/blog-image-3.jpg",
//         title: "Ras Al Hamra Residential Project",
//     },
//     {
//         image: "https://www.paneltechllc.com/wp-content/themes/paneltec/images/blog-image-4.jpg",
//         title: "Staff Accommodation Airport Site",
//     },
//     {
//         image: "https://www.paneltechllc.com/wp-content/themes/paneltec/images/blog-image-5.jpg",
//         title: "Royal Oman Police",
//     },
//     {
//         image: "https://www.paneltechllc.com/wp-content/themes/paneltec/images/blog-image-6.jpg",
//         title: "Gulf International Contracting",
//     },
// ];

// export const urls = [
//     { url: "https://www.paneltechllc.com/wp-content/uploads/2019/01/background-image-4.jpg" },
//     {
//         url: "https://www.paneltechllc.com/wp-content/uploads/2019/02/background-image-1.jpg",
//         heading: "Products",
//         title: "Sandwich Panel",
//         description: "Panel Tech International LLC established in 2009, is considered as one of the leading manufacturers of ...",
//         readMoreLink: "/products/sandwich-panel",
//         contactUsLink: "/contact-us",
//     },
//     {
//         url: "https://www.paneltechllc.com/wp-content/uploads/2019/01/background-image-2.png",
//         heading: "Products",
//         title: "Corrugated Profile Sheets",
//         description: "Profiled steel or Aluminium sheets are used in various roof constructions. Profile Sheets can be produced from ...",
//         readMoreLink: "/products/corrugated-profile-sheets",
//         contactUsLink: "/contact-us",
//     },
//     {
//         url: "https://www.paneltechllc.com/wp-content/uploads/2019/01/background-image-3.png",
//         heading: "Products",
//         title: "Z & C Purlins",
//         description: "Panel Tech manufacturers a complete range of structural C and Z purlins and girts for industrial buildings ...",
//         readMoreLink: "/products/z-c-purlins",
//         contactUsLink: "/contact-us",
//     },
//     {
//         url: "https://www.paneltechllc.com/wp-content/uploads/2019/02/background-image-5.jpg",
//         heading: "Products",
//         title: "Metal Decking Sheet",
//         description: "Multideck Floor System High performance, profiled, galvanized, steel floor decking for use in the ...",
//         readMoreLink: "/products/metal-decking-sheet",
//         contactUsLink: "/contact-us",
//     },
//     {
//         url: "https://www.paneltechllc.com/wp-content/uploads/2019/02/background-image-6.jpg",
//         heading: "Products",
//         title: "Translucent Sheet",
//         description: "To let natural daylight into a sheeted building you can replace some of the metal sheet ...",
//         readMoreLink: "/products/translucent-sheet",
//         contactUsLink: "/contact-us",
//     },
//     {
//         url: "https://www.paneltechllc.com/wp-content/uploads/2019/02/background-image-7.jpg",
//         heading: "Products",
//         title: "Flashings",
//         description: "Panel Tech can fold a wide range of standard or custom flashings to suit your ...",
//         readMoreLink: "/products/flashings",
//         contactUsLink: "/contact-us",
//     },
//     {
//         url: "https://www.paneltechllc.com/wp-content/uploads/2019/02/background-image-8.jpg",
//         heading: "Products",
//         title: "Roller Shutter Doors",
//         description: "The shutter curtain is constructed from cold rolled galvanized concave steel laths ...",
//         readMoreLink: "/products/roller-shutter-doors",
//         contactUsLink: "/contact-us",
//     },
//     {
//         url: "https://www.paneltechllc.com/wp-content/uploads/2019/02/background-image-9.jpg",
//         heading: "Products",
//         title: "Accessories",
//         description: "Panel Tech International LLC established in 2009, is considered as one of the leading ...",
//         readMoreLink: "/products/accessories",
//         contactUsLink: "/contact-us",
//     },
// ];

// export const downloadPdf = async (quizID, token) => {
//     // <ToastContainer position="top-right" autoClose={3000} />
//     toast.success(`Downloading PDF for Quiz ID: ${quizID}`);

//     try {
//         const response = await axios.get(`https://localhost:7093/api/Quiz/get-record/quizId`, {
//             params: { quizId: quizID },
//             headers: { Authorization: `Bearer ${token}`, Accept: 'text/plain' },
//         });

//         const { data } = response.data;

//         // Parse the answeredQuestions and questions
//         const answeredQuestions = JSON.parse(data.answeredQuestions);
//         const questions = data.questions.map((q) => ({
//             questionID: q.questionID,
//             questionText: q.questionText,
//             options: JSON.parse(q.options),
//             correctAnswer: q.correctAnswer,
//         }));

//         // Create a new jsPDF instance
//         const doc = new jsPDF();

//         // Add heading
//         doc.setFontSize(18);
//         doc.setFont("helvetica", "bold");
//         doc.text("Quiz Result", 105, 20, null, null, "center");

//         // Add Quiz Details
//         doc.setFontSize(12);
//         doc.setFont("helvetica", "normal");
//         doc.text(`Quiz ID: ${data.quizId}`, 10, 30);
//         doc.text(`Submission ID: ${data.submissionId}`, 10, 40);
//         doc.text(`Marks Obtained: ${data.marksObtained}/${data.totalMarks}`, 10, 50);
//         doc.text(`Start Time: ${new Date(data.startTime).toLocaleString()}`, 10, 60);
//         doc.text(`End Time: ${new Date(data.endTime).toLocaleString()}`, 10, 70);

//         // Add Question Details
//         let yPosition = 80;
//         questions.forEach((question, index) => {
//             // Question Heading
//             doc.setFont("helvetica", "bold");
//             doc.setFontSize(14);
//             doc.text(`Q${index + 1}. ${question.questionText}`, 10, yPosition);
//             yPosition += 10;

//             // Options
//             doc.setFont("helvetica", "normal");
//             doc.setFontSize(12);
//             question.options.forEach((option) => {
//                 doc.text(`${option.Option}: ${option.Text}`, 20, yPosition);
//                 yPosition += 10;
//             });

//             // Correct Answer and User Selected Option
//             const userAnswer = answeredQuestions.find((aq) => aq.questionID === question.questionID)?.selectedOption || "N/A";
//             const isCorrect = userAnswer === question.correctAnswer;

//             // Correct Answer (Green)
//             doc.setTextColor(0, 128, 0); // Green color
//             doc.text(`Correct Answer: ${question.correctAnswer}`, 20, yPosition);

//             // User Selected Option (Green if correct, Red if incorrect)
//             if (isCorrect) {
//                 doc.setTextColor(0, 128, 0); // Green for correct
//                 doc.text(`User Selected: ${userAnswer}`, 20, yPosition + 10);
//             } else {
//                 doc.setTextColor(255, 0, 0); // Red for incorrect
//                 doc.text(`User Selected: ${userAnswer}`, 20, yPosition + 10);
//             }

//             yPosition += 20;

//             // Reset text color to black
//             doc.setTextColor(0, 0, 0);

//             // Add a new page if content exceeds the page height
//             if (yPosition > 270) {
//                 doc.addPage();
//                 yPosition = 20;
//             }
//         });

//         // Save the PDF
//         doc.save(`Quiz_${quizID}_Result.pdf`);
//     } catch (error) {
//         console.error(`Error fetching quiz data: ${error.message}`);
//         toast.error("Failed to download the PDF. Please try again.");
//     }
// }


// export const ApiClient = axios.create({
//     baseURL: 'http://localhost:3000/api', // Base URL for your API
//     timeout: 5000, // Optional: request timeout
//     headers: {
//         'Content-Type': 'application/json',
//     },
// });


import axios from "axios";
import { toast } from "react-toastify";
import jsPDF from "jspdf";
import { useDispatch } from "react-redux";
import { setSessionExpired } from "../src/state/index";


export const products = [
    {
        image: "https://www.paneltechllc.com/wp-content/themes/paneltec/images/pr1.png",
        name: "Sandwich Panel"
    },
    {
        image: "https://www.paneltechllc.com/wp-content/themes/paneltec/images/pr2.png",
        name: "Corrugated Profile Sheets"
    },
    {
        image: "https://www.paneltechllc.com/wp-content/themes/paneltec/images/pr3.png",
        name: "Metal Decking Sheet"
    },
    {
        image: "https://www.paneltechllc.com/wp-content/themes/paneltec/images/pr4.png",
        name: "Z & C Purlins"
    },
    {
        image: "https://www.paneltechllc.com/wp-content/themes/paneltec/images/pr5.png",
        name: "Translucent Sheet"
    },
    {
        image: "https://www.paneltechllc.com/wp-content/themes/paneltec/images/pr6.png",
        name: "Flashings"
    },
    {
        image: "https://www.paneltechllc.com/wp-content/themes/paneltec/images/pr7.png",
        name: "Roller Shutter Doors"
    },
    {
        image: "https://www.paneltechllc.com/wp-content/themes/paneltec/images/pr8.png",
        name: "Accessories"
    }
];

export const projectData = [
    {
        image: "https://www.paneltechllc.com/wp-content/themes/paneltec/images/blog-image-1.jpg",
        title: "City Center Sohar",
    },
    {
        image: "https://www.paneltechllc.com/wp-content/themes/paneltec/images/blog-image-2.jpg",
        title: "Head Office National Bank of Oman",
    },
    {
        image: "https://www.paneltechllc.com/wp-content/themes/paneltec/images/blog-image-3.jpg",
        title: "Ras Al Hamra Residential Project",
    },
    {
        image: "https://www.paneltechllc.com/wp-content/themes/paneltec/images/blog-image-4.jpg",
        title: "Staff Accommodation Airport Site",
    },
    {
        image: "https://www.paneltechllc.com/wp-content/themes/paneltec/images/blog-image-5.jpg",
        title: "Royal Oman Police",
    },
    {
        image: "https://www.paneltechllc.com/wp-content/themes/paneltec/images/blog-image-6.jpg",
        title: "Gulf International Contracting",
    },
];

export const urls = [
    { url: "https://www.paneltechllc.com/wp-content/uploads/2019/01/background-image-4.jpg" },
    {
        url: "https://www.paneltechllc.com/wp-content/uploads/2019/02/background-image-1.jpg",
        heading: "Products",
        title: "Sandwich Panel",
        description: "Panel Tech International LLC established in 2009, is considered as one of the leading manufacturers of ...",
        readMoreLink: "/products/sandwich-panel",
        contactUsLink: "/contact-us",
    },
    {
        url: "https://www.paneltechllc.com/wp-content/uploads/2019/01/background-image-2.png",
        heading: "Products",
        title: "Corrugated Profile Sheets",
        description: "Profiled steel or Aluminium sheets are used in various roof constructions. Profile Sheets can be produced from ...",
        readMoreLink: "/products/corrugated-profile-sheets",
        contactUsLink: "/contact-us",
    },
    {
        url: "https://www.paneltechllc.com/wp-content/uploads/2019/01/background-image-3.png",
        heading: "Products",
        title: "Z & C Purlins",
        description: "Panel Tech manufacturers a complete range of structural C and Z purlins and girts for industrial buildings ...",
        readMoreLink: "/products/z-c-purlins",
        contactUsLink: "/contact-us",
    },
    {
        url: "https://www.paneltechllc.com/wp-content/uploads/2019/02/background-image-5.jpg",
        heading: "Products",
        title: "Metal Decking Sheet",
        description: "Multideck Floor System High performance, profiled, galvanized, steel floor decking for use in the ...",
        readMoreLink: "/products/metal-decking-sheet",
        contactUsLink: "/contact-us",
    },
    {
        url: "https://www.paneltechllc.com/wp-content/uploads/2019/02/background-image-6.jpg",
        heading: "Products",
        title: "Translucent Sheet",
        description: "To let natural daylight into a sheeted building you can replace some of the metal sheet ...",
        readMoreLink: "/products/translucent-sheet",
        contactUsLink: "/contact-us",
    },
    {
        url: "https://www.paneltechllc.com/wp-content/uploads/2019/02/background-image-7.jpg",
        heading: "Products",
        title: "Flashings",
        description: "Panel Tech can fold a wide range of standard or custom flashings to suit your ...",
        readMoreLink: "/products/flashings",
        contactUsLink: "/contact-us",
    },
    {
        url: "https://www.paneltechllc.com/wp-content/uploads/2019/02/background-image-8.jpg",
        heading: "Products",
        title: "Roller Shutter Doors",
        description: "The shutter curtain is constructed from cold rolled galvanized concave steel laths ...",
        readMoreLink: "/products/roller-shutter-doors",
        contactUsLink: "/contact-us",
    },
    {
        url: "https://www.paneltechllc.com/wp-content/uploads/2019/02/background-image-9.jpg",
        heading: "Products",
        title: "Accessories",
        description: "Panel Tech International LLC established in 2009, is considered as one of the leading ...",
        readMoreLink: "/products/accessories",
        contactUsLink: "/contact-us",
    },
];

export const downloadPdf = async (quizID, token) => {
    // <ToastContainer position="top-right" autoClose={3000} />
    toast.success(`Downloading PDF for Quiz ID: ${quizID}`);

    try {
        const response = await axios.get(`https://localhost:7093/api/Quiz/get-record/quizId`, {
            params: { quizId: quizID },
            headers: { Authorization: `Bearer ${token}`, Accept: 'text/plain' },
        });

        const { data } = response.data;

        // Parse the answeredQuestions and questions
        const answeredQuestions = JSON.parse(data.answeredQuestions);
        const questions = data.questions.map((q) => ({
            questionID: q.questionID,
            questionText: q.questionText,
            options: JSON.parse(q.options),
            correctAnswer: q.correctAnswer,
        }));

        // Create a new jsPDF instance
        const doc = new jsPDF();

        // Add heading
        doc.setFontSize(18);
        doc.setFont("helvetica", "bold");
        doc.text("Quiz Result", 105, 20, null, null, "center");

        // Add Quiz Details
        doc.setFontSize(12);
        doc.setFont("helvetica", "normal");
        doc.text(`Quiz ID: ${data.quizId}`, 10, 30);
        doc.text(`Submission ID: ${data.submissionId}`, 10, 40);
        doc.text(`Marks Obtained: ${data.marksObtained}/${data.totalMarks}`, 10, 50);
        doc.text(`Start Time: ${new Date(data.startTime).toLocaleString()}`, 10, 60);
        doc.text(`End Time: ${new Date(data.endTime).toLocaleString()}`, 10, 70);

        // Add Question Details
        let yPosition = 80;
        questions.forEach((question, index) => {
            // Question Heading
            doc.setFont("helvetica", "bold");
            doc.setFontSize(14);
            doc.text(`Q${index + 1}. ${question.questionText}`, 10, yPosition);
            yPosition += 10;

            // Options
            doc.setFont("helvetica", "normal");
            doc.setFontSize(12);
            question.options.forEach((option) => {
                doc.text(`${option.Option}: ${option.Text}`, 20, yPosition);
                yPosition += 10;
            });

            // Correct Answer and User Selected Option
            const userAnswer = answeredQuestions.find((aq) => aq.questionID === question.questionID)?.selectedOption || "N/A";
            const isCorrect = userAnswer === question.correctAnswer;

            // Correct Answer (Green)
            doc.setTextColor(0, 128, 0); // Green color
            doc.text(`Correct Answer: ${question.correctAnswer}`, 20, yPosition);

            // User Selected Option (Green if correct, Red if incorrect)
            if (isCorrect) {
                doc.setTextColor(0, 128, 0); // Green for correct
                doc.text(`User Selected: ${userAnswer}`, 20, yPosition + 10);
            } else {
                doc.setTextColor(255, 0, 0); // Red for incorrect
                doc.text(`User Selected: ${userAnswer}`, 20, yPosition + 10);
            }

            yPosition += 20;

            // Reset text color to black
            doc.setTextColor(0, 0, 0);

            // Add a new page if content exceeds the page height
            if (yPosition > 270) {
                doc.addPage();
                yPosition = 20;
            }
        });

        // Save the PDF
        doc.save(`Quiz_${quizID}_Result.pdf`);
    } catch (error) {
        // console.error(`Error fetching quiz data: ${error.message}`);
        toast.error("Failed to download the PDF. Please try again.");
    }
}


export const createApiClient = (dispatch) => {
    const ApiClient = axios.create({
        baseURL: "http://localhost:3000/api",
        timeout: 5000,
        headers: {
            "Content-Type": "application/json",
        },
    });

    // Attach an interceptor to handle 401 responses
    ApiClient.interceptors.response.use(
        (response) => response, // Return response if successful
        (error) => {
            if (error.response && error.response.status === 401) {
                // console.error("Session expired!");
                setTimeout(() => {
                    dispatch(setSessionExpired(true)); // Dispatch action to set session as expired
                }, 0);
            }
            return Promise.reject(error);
        }
    );

    return ApiClient;
};





