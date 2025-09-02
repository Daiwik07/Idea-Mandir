import dotenv from 'dotenv';
import nodemailer from 'nodemailer';
import { google } from 'googleapis';

dotenv.config();

const OAuth2 = google.auth.OAuth2;

const oAuth2Client = new OAuth2(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
  process.env.REDIRECT_URI
);

oAuth2Client.setCredentials({
  refresh_token: process.env.REFRESH_TOKEN
});

const accessToken = await oAuth2Client.getAccessToken();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    type: 'OAuth2',
    user: process.env.EMAIL,
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    refreshToken: process.env.REFRESH_TOKEN,
    accessToken: accessToken
  }

});

const sendMail = async(to, subject, text) => {
    const mailOptions = {
        from: `Idea Mandir <${process.env.EMAIL}>`,
        to: to,
        subject: subject,
        text: text
    };

    await transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Error sending email:', error);
        } else {
            console.log('Email sent successfully:', info.response);
        }
    });
};

export default sendMail;
