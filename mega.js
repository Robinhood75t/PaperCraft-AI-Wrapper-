const express = require("express");
const bcrypt = require("bcryptjs");
const multer = require("multer");
const connectDB = require("./db");
const jwt = require("jsonwebtoken");
const storage = multer.memoryStorage();

require("dotenv").config();

const app = express();

app.use(express.json());

// connectDB 
connectDB();

app.post("/",async(req, res)=> {
    console.log("API is working");
    return res.status(200).json({
        message:"ok"
    });
});

const uploads = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024
    },
    fileFilter: (req,file,cb) => {
        if(file.mimetype.startsWith("image/")){
            cb(null,true);
        }else{
            cb(new Error("only images are allowed"));
        }
    }
});

let gemini;
async function getGemini(){
    if(!gemini){
        const { GoogleGenAI } = await import("@google/genai");

        gemini = new GoogleGenAI({
            apikey: process.env.GOOGLE_API_KEY
        });
    }
    return gemini;
}

app.post("/register", async(req, res)=> {
    try{
        const { name, email , password } = req.body;
        
        if(!name || !email || !password){
            return res.status(400).json({
                message: "All fields are required"
            })
        }

        const exists = await userModel.findOne({
            userEmail: email.toLowerCase().trim()
        });
        
        if(exists){
            return res.status(400).json({
                message: "user already exists"
            })
        }

        const hashedPassword = await bcrypt.hash(password,10);

        const user = await userModel.create({
            userName: name,
            userEmail: email.toLowerCase().trim(),
            userPassword: hashedPassword,
        })

        return res.status(200).json({
            message: "user created successfully",
            user
        })

    }catch(error){
        return res.status(500).json({
            message: "Register error"
        })
    }
});

app.post("/login",async(req,res) => {
    try{
        const { email , password } = req.body;

        if(!email || !password){
            return res.status(400).json({
                message: "All fields are required"
            })
        }

        const exists = await userModel.findOne({
            userEmail: email.toLowerCase.trim()
        });

        if(!exists){
            return res.status(401).json({
                message: "user dosen't exists"
            })
        }
        const isPasswordValid = await bcrypt.compare(exists.userPassword,password);

        if(!isPasswordValid){
            return res.status(401).json({
                message: "invalid password"
            })
        }

        const token = jwt.sign(
            {id: exists._id.toString()},
            process.env.JWT_SECRET,
            {expiresIn: "1d"}
        )

        return res.status(200).json({
            message:"logged in successfull",
            exists,
            token
        })

    }catch(error){
        return res.status(500).json({
            error: error.message,
            message: "loggin error"
        })
    }
});

app.post("/paper-test",async(req, res)=> {
    return res.status(200).json({message: "paper-test is success"});
})

console.log("registering paper route....");

app.post("/papers",uploads.single("paper"),async(req, res) => {
    console.log("paper router hits");
    try{
        console.log("inside try");
        const file = req.file;

        if(!file){
            return res.status(400).json({
                message: "Please upload file"
            })
        }
        console.log("file mil gyi");

        const ai = await getGemini();
        console.log("getGemini call");
        const base64Image = file.buffer.toString("base64");
        console.log("base64 conversion");
        const prompt = `
            You are an OCR and exam paper extraction assistant.

            Analyze the uploaded handwritten examination paper.

            Extract the following information:
            1. Subject name
            2. Exam instructions
            3. Sections
            4. Question numbers
            5. Complete question text
            6. Marks assigned to each question

            Important rules:
            - Preserve the original question numbering.
            - Do not change the meaning of questions.
            - Do not invent missing text or marks.
            - If something is unreadable, mark it as unclear.
            - Preserve the original language.

            Return ONLY valid JSON in this structure:

            {
                "subject": "",
                "instructions": [],
                "sections": [
                    {
                        "sectionName": "",
                        "questions": [
                            {
                                "questionNumber": 1,
                                "questionText": "",
                                "marks": null
                            }
                        ]
                    }
                ]
            }
        `;
        console.log("response tak gaya");
        const response = await ai.models.generateContent({
            model: "gemini-3.8-flash",
            contents:[
                {
                    inlineData: {
                        mimeType: file.mimetype,
                        data: base64Image
                    }
                },
                prompt
            ],
            config: {
                responseMimeType: "application/json"
            }
        });
        console.log("data extract krr raha hu");
        const extractedData = JSON.parse(response.text);
        console.log("data extract kar liya");

        const paperJob = await paperJob.create({
            status: "review",
            extractedQuestions: extractedData
        })

        return res.status(200).json({
            message: "Paper Scanned and saved",
            id: paperJob._id,
            data: paperJob.extractedQuestions,
        })

    }catch(err){
        return res.status(500).json({
            err: err.message,
            message: "failed to process"
        });
    }
});

app.post("/api/AICraft", async(req, res) => {
    try{

    }catch(err){

    }
});

const PORT = process.env.PORT || 8000;

console.log("Paper route registered");

app.listen(PORT,()=>{
    console.log(`server is running at ${PORT}`);
});
