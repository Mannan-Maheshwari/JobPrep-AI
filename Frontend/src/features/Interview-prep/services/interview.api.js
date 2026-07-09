 import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:3020",
    withCredentials: true,
})

/**
 * @description Service to generate interview report based on user self description, resume and job description.
 */
export const generateReport = async ({ jobDescription, selfDescription, resumeFile }) => {


    console.log("API:", resumeFile);
    console.log("API instanceof File:", resumeFile instanceof File);

    const formData = new FormData()
    formData.append("jobDescription", jobDescription)
    formData.append("selfDescription", selfDescription)
    formData.append("resume", resumeFile)

    const response = await api.post("/api/interview/", formData, {
        headers: {
            "Content-Type": "multipart/form-data"
        }
    })

    return response.data

}


/**
 * @description Service to get interview report by interviewId.
 */
export const getReportById = async (interviewId) => {
    const response = await api.get(`/api/interview/report/${interviewId}`)

    return response.data
}


/**
 * @description Service to get all interview reports of logged in user.
 */
export const getAllReports = async () => {
    const response = await api.get("/api/interview/")

    return response.data
}

/**
 * @description Service to generate resume pdf from the report.
 */

export const generateResumePdf = async (reportId) => {
    const response = await api.post(`/api/interview/resume/pdf/${reportId}`, null, {
        responseType: "blob"
    })

    return response.data
}
