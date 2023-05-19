const express = require("express")
require('dotenv').config();
const nodemailer = require("nodemailer")
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express()
const port = process.env.PORT || "4000"

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// Enable CORS
app.use(cors());


function sendEmail({ name, email, message }) {

    return new Promise((resolve, reject) => {
        var transporter = nodemailer.createTransport({
            service: "gmail", 
            auth: {
                user:"ryyyannna@gmail.com", 
                pass:process.env.GMAIL_APP_PASSWORD
            }
        })

        const mail_configs = {
            from: email, 
            to: "ryyyannna@gmail.com", 
            subject: name, 
            text: "Email: " + email + "\n" + message
        }

        transporter.sendMail(mail_configs, function(error, info) {
            if (error) {
                console.log(error)
                return reject({message: {success: false}})
            }
            return resolve({message: {success: true}})
        })
    })

}

app.get('/', (req, res) => {
    sendEmail()
    .then(response => res.send(response.message))
    .catch(error => res.status(500).send(error.message))
})

// Enable CORS for the /api/email route
app.options('/send_email', cors());

app.post('/send_email', cors(), (req, res) => {
    let {name, email, message, disabled, sent} = req.body
    sendEmail({name, email, message})
    .then(response => res.send(response.message))
    .catch(error => res.status(500).send(error.message))
})

app.listen(port, () => {
    console.log(`nodemailer is listening at http://localhost:${port}`)
})