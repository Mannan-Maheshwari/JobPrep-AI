const mongoose = require('mongoose');

/**
 *  -job description schema
 *  -resume text
 *  -self description
 *  -match score
 *  
 *  -Technical questions :[]
 *  -Behavioural questions :[]
 *  -skill gaps :[]
 *  -prepration plan :[{}]
 */

const TechnicalQuestionSchema = new mongoose.Schema({
    question : {
        type: String,
        required:[true,"Question is required"]
    },
    intention : {
        type: String,
        required:[true,"Intention is required"]
    },
    answer : {
        type: String,
        required:[true,"Answer is required"]
    }
    
}, {
    _id : false
})

const BehaviouralQuestionSchema = new mongoose.Schema({
    question : {
        type: String,
        required:[true,"Question is required"]
    },
    intention : {
        type: String,
        required:[true,"Intention is required"]
    },
    answer : {
        type: String,
        required:[true,"Answer is required"]
    }
}, {
    _id : false
})

const SkillGapSchema = new mongoose.Schema({
    skill : {
        type: String,
        required:[true,"Skill is required"]
    },
    severity : {
        type: String,
        enum : ["low","medium","high"],
        required:[true,"Severity is required"]  
    }

}, {
    _id : false
})

const PreparationPlanSchema = new mongoose.Schema({
    day : { 
        type: Number,
        required:[true,"Day is required"]
    },
    focus : {
        type: String,
        required:[true,"Focus is required"]
    },
    tasks : {
        type: [String],
        required:[true,"Tasks are required"]
    }

})

const InterviewReportSchema = new mongoose.Schema({
    JobDescription : {
        type: String,
        required:[true,"Job Description is required"]
    },
    resume :{
        type: String
    },
    SelfDescription :{
        type: String
    },
    MatchScore :{
        type: Number,
        min: 0,
        max : 100
    },
    TechnicalQuestions : [TechnicalQuestionSchema],
    BehaviouralQuestions : [BehaviouralQuestionSchema],
    SkillGaps : [SkillGapSchema],
    PreparationPlan : [PreparationPlanSchema],
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users"
    },
    title : {
        type: String,
        required:[true,"Title is required"]
    }
}, {
    timestamps : true

})

const ReportModel = mongoose.model("Report", InterviewReportSchema);

module.exports = ReportModel;