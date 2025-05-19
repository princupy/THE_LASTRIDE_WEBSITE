import express from 'express';
import fetch from 'node-fetch';

const app = express();
const port = process.env.PORT || 5000;

const DISCORD_BOT_TOKEN = process.env.DISCORD_BOT_TOKEN;  // Use environment variables for sensitive data
const SERVER_ID = '1315644299043405874';  // Your Discord server ID

// API endpoint to get live status
app.get('/api/discord-status', async (req, res) => {
  try {
    const response = await fetch(`https://discord.com/api/v10/guilds/${SERVER_ID}/widget.json`);
    const data = await response.json();

    // Debugging logs
    console.log(data);

    // Check if data is fetched successfully
    if (data) {
      res.json({
        status: 'online',  // Your server is online if data is returned
        member_count: data.members.length,  // Total members in the server
        online_count: data.members.filter(member => member.status === 'online').length,  // Online members
        server_name: data.name  // Server name
      });
    } else {
      throw new Error("Failed to fetch data from Discord API");
    }
  } catch (error) {
    console.error('Error fetching Discord status:', error);
    res.status(500).json({ status: 'offline' });
  }
});

// Serve static files (CSS, JS, HTML, etc.)
app.use(express.static('public'));

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
