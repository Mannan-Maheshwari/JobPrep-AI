import {getAllReports, getReportById, generateReport} from "../services/interview.api.js";
import { useContext, useEffect } from "react";
import { InterviewContext } from "../Interview.context.jsx";
import { useParams } from "react-router";

export const useInterview = () => {
    const context = useContext(InterviewContext);
    const { id: interviewId } = useParams();

    if (!context) {
        throw new Error("useInterview must be used within an InterviewProvider");
    }
    const {loading, setLoading, report, setReport, reports, setReports} = context;

    const generateAiReport = async({jobDescription, selfDescription, resumeFile}) => {
        setLoading(true)
        let response = null
        try {
            console.log("HOOK:", resumeFile);
            console.log("HOOK instanceof File:", resumeFile instanceof File);


            response = await generateReport({ jobDescription, selfDescription, resumeFile: resumeFile });
            console.log("API Response:", response);
            setReport(response.report);
            return response.report;

        } catch (error) {
            console.log(error)
            return null
        }finally {
            setLoading(false)
        }

    }

    const fetchReportById = async (interviewId) => {
        setLoading(true)
        let response = null
        try{
            response = await getReportById(interviewId);
            setReport(response.interviewReport);
            return response.interviewReport;

        }catch(error){
            console.log(error)
            return null
        }finally {
            setLoading(false)
        }

    }

    const fetchAllReports = async () => {
        setLoading(true)
        let response = null
        try{
            response = await getAllReports()
            setReports(response.reports);
            return response.reports;

        }  catch(error){
            console.log(error)
            return null
        }finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (interviewId) {
            fetchReportById(interviewId);
        }
        else{
            fetchAllReports();
        }
    }, [interviewId]);


    return {
        loading,
        report,
        reports,
        generateAiReport,
        fetchReportById,
        fetchAllReports
    }
}