// Import required modules
const mongoose = require('mongoose');
const express = require('express');
const bodyParser = require('body-parser');
const cron = require('node-cron');
const transporter = require('./emailConfig'); // Import your nodemailer transporter
const ActiveUser = require('./subscribedUsers/activeUsers-model'); // Import your Mongoose model
const routes = require('./routes'); // Import your routes

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect('mongodb+srv://seantech:76f9PU5Sx83PbB8p@subscribeduserdetails.zvda9dw.mongodb.net/seantechlist', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');

  // Start the Express server after the MongoDB connection is established
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
});

// Use the routes defined in routes.js
app.use('/api', routes);

// Define the timezone
const indiaTimezone = 'Asia/Kolkata';

// Define the cron job function
const sendEmailsDaily = async () => {
  try {
    console.log('Cron job started.');

    // Get the current day (1-31)
    const currentDay = new Date().getDate();

    // Find users whose subscriptionDay matches the current day
    const usersToSendEmail = await ActiveUser.find({ subscriptionDay: currentDay });

    console.log(`Found ${usersToSendEmail.length} users to email.`);

    // Iterate over the matching users and send emails
    for (const user of usersToSendEmail) {
      const mailOptions = {
        from: 'invoice@seantech.online',
        to: user.email,
        subject: "Monthly PC Tune-Up and Optimization Reminder",
        html: `<html>
        <head>
          <style>
            body {
              font-family: Arial, sans-serif;
              line-height: 1.6;
            }
            h1 {
              color: #007bff;
            }
            h2 {
              color: #333;
            }
            ul {
              list-style-type: disc;
              margin-left: 20px;
            }
          </style>
        </head>
        <body>
          <p>Dear ${user.fname.toUpperCase()} ${user.lname.toUpperCase()},</p>
          
          <p>I hope this message finds you well. We want to ensure that your computer remains in peak performance and continues to meet your expectations. As part of your service plan with us, we are pleased to offer you a monthly PC tune-up and optimization session.</p>
        
          <h2>Why is Monthly Maintenance Important?</h2>
          <p>Regular maintenance is crucial to keep your computer running smoothly and prevent potential issues down the road. Our expert technicians will work on your PC to:</p>
          <ul>
            <li>Remove unnecessary files and temporary data that can slow down your system.</li>
            <li>Update software, drivers, and operating systems for enhanced security and performance.</li>
            <li>Scan for and remove malware or viruses.</li>
            <li>Optimize system settings for better speed and responsiveness.</li>
            <li>Address any specific concerns or issues you may have.</li>
          </ul>
        
          <h2>Scheduling Your Tune-Up:</h2>
          <p>To schedule your next monthly tune-up and optimization session, simply reply to this email or give us a call at +1 315 628 1160. Our team will work with you to find a convenient time that fits your schedule.</p>
        
          <h2>Your Satisfaction is Our Priority:</h2>
          <p>We are committed to providing you with the best possible service and ensuring your computer operates at its best. If you have any questions, concerns, or feedback, please don't hesitate to reach out to us.</p>
        
          <p>Thank you for choosing us as your trusted technology partner. We look forward to continuing to serve you and keep your PC running at its peak performance.</p>
        
          <p><b>Best regards,<br>SeanTech</b></p>
        </body>
        </html>
        `
        // <p class="footer">To unsubscribe from our emails, click <a href="www.google.com" target="_blank">here</a>.</p>

        // html: `<html>Dear ${user.fname.toUpperCase()} ${user.lname.toUpperCase()},<br><br>I hope this message finds you well. We want to ensure that your computer remains in peak performance and continues to meet your expectations. As part of your service plan with us, we are pleased to offer you a monthly PC tune-up and optimization session.<br><br><b>Why is Monthly Maintenance Important?</b><br>Regular maintenance is crucial to keep your computer running smoothly and prevent potential issues down the road. Our expert technicians will work on your PC to:<br><br>1. Remove unnecessary files and temporary data that can slow down your system.<br>2. Update software, drivers, and operating systems for enhanced security and performance.<br>3. Scan for and remove malware or viruses.<br>4. Optimize system settings for better speed and responsiveness.<br>5. Address any specific concerns or issues you may have.<br><br><b>Scheduling Your Tune-Up:</b><br>To schedule your next monthly tune-up and optimization session, simply reply to this email or give us a call at +1 315 628 1160. Our team will work with you to find a convenient time that fits your schedule.<br><br><b>Your Satisfaction is Our Priority:</b><br>We are committed to providing you with the best possible service and ensuring your computer operates at its best. If you have any questions, concerns, or feedback, please don't hesitate to reach out to us.<br><br>Thank you for choosing us as your trusted technology partner. We look forward to continuing to serve you and keep your PC running at its peak performance.<br><br>Best regards,<br><br>SeanTech</html>`

      };

      await transporter.sendMail(mailOptions);

      console.log(`Email sent to ${user.email}`);
    }

    console.log('Cron job completed.');
  } catch (error) {
    console.error('Error in cron job:', error);
  }
};

// Schedule the cron job without invoking it
cron.schedule('0 9 * * *', sendEmailsDaily, {
  scheduled: true,
  timezone: indiaTimezone, // Replace with your timezone
});


app.get('/test-cron', (req, res) => {
  try {
    sendEmailsDaily();

    res.status(200).json({ message: 'Cron job triggered successfully.' });
  } catch (error) {
    console.error('Error triggering cron job:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

