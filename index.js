const express = require('express')
const bodyParser = require('body-parser')
const { PDFDocument } = require('pdf-lib')
const { readFile, writeFile } = require('fs/promises')
require('dotenv').config()


const app = express();


// Setting view engine to use ejs
app.set('view engine', 'ejs')

// Serving static files
app.use(express.static('public'))

// Use body-parser middleware
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

const port = process.env.PORT


app.get("/", (req, res) => {
    res.render("index")
})

app.post("/submit", (req, res)=>{
let name = req.body.full_name;
let location = req.body.location;
let requirements = req.body.requirements


async function createPdf(input, output) {
    try {
        const pdfDoc = await PDFDocument.load(await readFile(input))
        let fieldNames = pdfDoc.getForm().getFields()
        fieldNames = fieldNames.map((f) => f.getName())

        const form = pdfDoc.getForm()
        form.getTextField(fieldNames[0]).setText(name)
        form.getTextField(fieldNames[1]).setText(location)
        form.getTextField(fieldNames[2]).setText(requirements)

        const pdfBytes = await pdfDoc.save()

        await writeFile(output, pdfBytes)
    } catch (error) {
        console.log(error)
    }
}

createPdf("public/assets/pdf/test_document.pdf", "result.pdf")
res.render("index")
})

app.listen(port, () => {
    console.log("Server started successfully")
})



