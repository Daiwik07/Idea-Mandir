import bcrypt from 'bcrypt';
import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import { Groq } from 'groq-sdk';
import connectDB from './db.js';
import Feedback from './feedback.js';
import Idea from './idea.js';
import sendMail from './mail.js';
import User from './user.js';

dotenv.config();

// Connect to MongoDB before starting the server
connectDB();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());

const otpStore = new Map();

function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

app.get('/', (req, res) => {
  res.send('Design Studio API is running');
});


app.post('/check-user', async (req, res) => {
  try {
    const user = await User.findOne({ Email: req.body.email });
    res.json({ exists: !!user });
  } catch (error) {
    res.status(500).json({ message: 'Error checking user', error: error.message });
  }
});

app.post('/login', async (req, res) => {
  try {
    const { email, pass } = req.body;
    const user = await User.findOne({ Email: email });
    
    if (!user) {
      return res.json({ message: "No Exist" });
    }
    
    const isPasswordCorrect = await bcrypt.compare(pass, user.Password);
    res.json({ message: isPasswordCorrect ? "Exist" : "No Exist Pass" });
  } catch (error) {
    res.status(500).json({ message: 'Error logging in', error: error.message });
  }
});

app.post('/signup', async (req, res) => {
  try {
    const { name, email, pass } = req.body;
    const hashedPassword = await bcrypt.hash(pass, 10);
    
    await new User({
      Name: name,
      Email: email,
      Password: hashedPassword,
    }).save();
    
    res.json({ message: 'User created successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error creating user', error: error.message });
  }
});

app.post('/otp', async (req, res) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({ error: 'Email is required in the request body' });
    }
    
    const otp = generateOTP();
    
    otpStore.set(email, otp);
    
    const emailSubject = 'Your Design Studio OTP Code';
    const emailText = `Your OTP code is: ${otp}\n\nPlease use this code to verify your account.`;
    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
        <h1 style="color: #333; text-align: center;">Your OTP Code</h1>
        <div style="font-size: 32px; font-weight: bold; text-align: center; padding: 20px; background-color: #f5f5f5; border-radius: 4px; letter-spacing: 5px; margin: 20px 0;">${otp}</div>
        <p style="color: #666; line-height: 1.5;">Please use this code to verify your account.</p>
        <p style="color: #999; margin-top: 30px; font-size: 12px; text-align: center;">If you didn't request this code, please ignore this email.</p>
      </div>
    `;
    
    try {
      const emailResult = await sendMail(email, emailSubject, emailText, emailHtml);
      console.log(`OTP sent to ${email}: ${otp}`);
      res.json({ 
        success: true, 
        message: 'OTP sent successfully',
        otp: otp 
      });
    } catch (emailError) {
      console.error('Failed to send OTP email:', emailError);
      res.status(500).json({ 
        success: false, 
        error: 'Failed to send OTP email', 
        details: emailError.message 
      });
    }
  } catch (error) {
    console.error('Error in /otp endpoint:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Server error when generating OTP', 
      details: error.message 
    });
  }
});

app.post('/otpcheck', (req, res) => {
  try {
    const { otp, email } = req.body;
    
    if (!email || !otp) {
      return res.status(400).json({ 
        success: false, 
        message: 'Both email and OTP are required' 
      });
    }
    
    const storedOTP = otpStore.get(email);
    
    if (storedOTP && storedOTP === otp) {
      otpStore.delete(email);
      res.json({ message: "True" });
    } else {
      res.json({ message: "False" });
    }
  } catch (error) {
    console.error('Error in /otpcheck endpoint:', error);
    res.status(500).json({
      success: false,
      message: "Server error during OTP verification",
      details: error.message
    });
  }
});

app.post('/feedback', async (req, res) => {
  try {
    const { data } = req.body;
    
    const newFeedback = new Feedback({
      firstName: data.firstName,
      email: data.email,
      feedback: data.feedback
    });
    
    await newFeedback.save();
    
    res.json({ message: "True" });
  } catch (error) {
    console.error('Error saving feedback:', error);
    res.status(500).json({ message: "False", error: error.message });
  }
});

app.post('/ai', async (req, res) => {
  try {
    const { question } = req.body;
    
    if (!process.env.GROQ_API_KEY) {
      return res.status(200).json({ 
        answer: "I'm currently operating in demo mode without an API key. In production, I would connect to Groq's AI models to provide detailed responses to your design questions."
      });
    }
    
    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "You are a helpful design assistant, knowledgeable about graphic design, UI/UX principles, and creative processes. Provide thoughtful, concise responses that offer actionable insights. Focus on being educational rather than just giving opinions.",
        },
        {
          role: "user",
          content: question,
        },
      ],
      model: "llama3-70b-8192",
      temperature: 0.7,
      max_tokens: 800,
    });
    
    let answer = completion.choices[0]?.message?.content || "";
    console.log('AI Response:', answer.substring(0, 100) + '...');
    res.json({ answer });
  } catch (error) {
    console.error('Error in /ai endpoint:', error);
    res.status(200).json({ 
      answer: "I apologize, but I'm having trouble generating a response at the moment. This could be due to high demand or a temporary service interruption. Please try again in a few moments.",
      error: error.message 
    });
  }
});

app.post('/get-user-info', async (req, res) => {
  try {
    const { email } = req.body;
    console.log('Getting user info for email:', email);
    
    if (!email) {
      console.log('No email provided in request');
      return res.status(400).json({ success: false, message: 'Email is required' });
    }
    
    const user = await User.findOne({ Email: email });
    
    if (!user) {
      console.log('User not found for email:', email);
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    
    console.log('User found:', user.Name);
    res.json({
      success: true,
      name: user.Name,
      email: user.Email
    });
  } catch (error) {
    console.error('Error fetching user info:', error);
    res.status(500).json({ success: false, message: 'Error fetching user info', error: error.message });
  }
});

// Create a new idea
app.post('/create-idea', async (req, res) => {
  try {
    const { title, description, category, email } = req.body;
    
    const newIdea = new Idea({
      title,
      description,
      category,
      email,
    });
    
    await newIdea.save();
    
    res.status(201).json({ 
      success: true, 
      message: 'Idea created successfully', 
      idea: newIdea 
    });
  } catch (error) {
    console.error('Error creating idea:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error creating idea', 
      error: error.message 
    });
  }
});

// Get all ideas
app.get('/get-ideas', async (req, res) => {
  try {
    const ideas = await Idea.find().sort({ createdAt: -1 }); // Sort by newest first
    
    res.status(200).json({ 
      success: true, 
      ideas: ideas.map(idea => ({
        id: idea._id,
        title: idea.title,
        description: idea.description,
        category: idea.category,
        email: idea.email
      }))
    });
  } catch (error) {
    console.error('Error fetching ideas:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching ideas', 
      error: error.message 
    });
  }
});

app.get('/get-ideas/:category', async (req, res) => {
  try {
    const { category } = req.params;
    let ideas;
    
    if (category.toLowerCase() === 'all') {
      ideas = await Idea.find().sort({ createdAt: -1 });
    } else {
      ideas = await Idea.find({ category }).sort({ createdAt: -1 });
    }
    
    res.status(200).json({ 
      success: true, 
      ideas: ideas.map(idea => ({
        id: idea._id,
        title: idea.title,
        description: idea.description,
        category: idea.category,
        email: idea.email
      }))
    });
  } catch (error) {
    console.error('Error fetching ideas by category:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching ideas by category', 
      error: error.message 
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on Port ${PORT}`);
});
