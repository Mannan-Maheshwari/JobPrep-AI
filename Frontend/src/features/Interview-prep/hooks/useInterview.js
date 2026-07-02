import {getAllReports, getReportById, generateReport} from "../services/interview.api.js";
import { useContext } from "react";
import { InterviewContext } from "../Interview.context.jsx";

export const useInterview = () => {
    const context = useContext(InterviewContext);
    if (!context) {
        throw new Error("useInterview must be used within an InterviewProvider");
    }
    const {loading, setLoading, report, setReport, reports, setReports} = context;

    const generateAiReport = async({jobDescription, selfDescription, resume}) => {
        setLoading(true)
        try {
            const response = await generateReport({
                
            })
        } catch (error) {
            
        }
    }
}