// const officegen = require("officegen");
// const paperModel = require("./paperRes");
// const fs = require("fs");

// const docx = officegen("docx");

// const paperDetails = async(req, res) => {
//     try{
//         const user = req.user._id;

//         const Data = await paperModel.findOne({
//             userId: user._id
//         });

//         if(!Data){
//             return res.status(400).json({
//                 message: "Data is not found"
//             })
//         }

//         //const {class: className, subject, marks } = Data.extractedQuestions;
//         const className = "4th";
//         const subject = "Hindi";
//         const marks = 40;
//         const p = docx.createP();

//         p.addText("Robin Public School");

//         p.addText(`Class = ${className}`);
//         p.addLineBreak();
//         p.addText(`Subject = ${subject}`);
//         p.addLineBreak();
//         p.addText(`Marks = ${marks}`);

        
//         const temp = fs.createWriteStream("./result.docx");

//         temp.on("finish", () => {
//             console.log("Docx generated successfully");
//         })

//         temp.on("Error", () => {
//             console.log("Error in docs generation");
//         })
        
//         docx.generate(temp);
//     }catch(err){
//         return res.status(500).json({
//             err: err.message,
//             message: "Paper Creation error"
//         })
//     }
// }
// console.log(paperDetails());
// module.exports = paperDetails;



const officegen = require("officegen");
const fs = require("fs");

const docx = officegen("docx");

const p = docx.createP();

p.addText("ROBIN PUBLIC SCHOOL", {
    bold: true,
    fontSize: 20
});

p.addLineBreak();
p.addText("Class: 4th");
p.addLineBreak();
p.addText("Subject: Hindi");
p.addLineBreak();
p.addText("Maximum Marks: 40");

const output = fs.createWriteStream("./result.docx");

output.on("finish", () => {
    console.log("DOCX generated successfully!");
});

output.on("error", (err) => {
    console.error("File error:", err);
});

docx.on("error", (err) => {
    console.error("OfficeGen error:", err);
});

docx.generate(output);
