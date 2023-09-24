const express = require('express');
const router = express.Router();
const ActiveUser = require('./subscribedUsers/activeUsers-model'); // Import your Mongoose model

// Create a new user

router.post('/activeUsers/create', async (req, res) => {
  try {
    const { email } = req.body;

    // Check if the email already exists in the database
    const existingUser = await ActiveUser.findOne({ email });

    if (existingUser) {
      // If an existing user with the same email is found, return an error
      return res.status(400).json({ error: `${req.body.email} is address already Subscribed.` });
    }

    const newUser = new ActiveUser(req.body);
    await newUser.save();
    res.status(200).json({message:`${req.body.email} Subscribed successfully.`});
  } catch (error) {
    res.status(500).json({ error: `Failed to create ${req.body.email}.` });
    console.log(error);
  }
});


router.get('/activeUsers/delete/:email', async (req, res) => {
  try {
    const email = req.params.email;

    // Find and remove the user by email
    const deletedUser = await ActiveUser.findOneAndRemove({ email });

    if (!deletedUser) {
      return res.status(404).json({ error: `${email} not found.` });
    }

    res.status(200).json({ message: `${email} Unsubscribed successfully.` });
  } catch (error) {
    res.status(500).json({ error: `Failed to Unsubscribed ${email}.` });
  }
});

router.get('/activeUsers/getAll', async (req, res) => {
  try {
    const allUsers = await ActiveUser.find();
    res.status(200).json(allUsers);
  } catch (error) {
    res.status(500).json({ error: `Failed to get all users.` });
  }
});



module.exports = router;
