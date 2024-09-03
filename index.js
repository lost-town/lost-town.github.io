const express = require('express');
const axios = require('axios');
const { Client, GatewayIntentBits } = require('discord.js');
require('dotenv').config();

const app = express();
const port = 3000;

// إعداد بوت ديسكورد
const discordClient = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages] });
discordClient.login(process.env.BOT_TOKEN);

discordClient.on('ready', () => {
    console.log(`Logged in as ${discordClient.user.tag}!`);
});

// صفحة تسجيل الدخول
app.get('/', (req, res) => {
    const discordLoginUrl = `https://discord.com/oauth2/authorize?client_id=${process.env.CLIENT_ID}&redirect_uri=${process.env.REDIRECT_URI}&response_type=code&scope=identify`;
    res.send(`<h1>Login with Discord</h1><a href="${discordLoginUrl}">Login</a>`);
});

// صفحة إعادة التوجيه
app.get('/callback', async (req, res) => {
    const { code } = req.query;

    if (!code) {
        return res.send('No code provided.');
    }

    try {
        // الحصول على رمز التوثيق من Discord
        const tokenResponse = await axios.post('https://discord.com/api/oauth2/token', new URLSearchParams({
            client_id: process.env.CLIENT_ID,
            client_secret: process.env.CLIENT_SECRET,
            grant_type: 'authorization_code',
            code,
            redirect_uri: process.env.REDIRECT_URI,
        }), {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        });

        const { access_token } = tokenResponse.data;

        // الحصول على بيانات المستخدم
        const userResponse = await axios.get('https://discord.com/api/users/@me', {
            headers: {
                Authorization: `Bearer ${access_token}`,
            },
        });

        const { id, username, discriminator, created_at } = userResponse.data;

        // إرسال البيانات إلى روم ديسكورد
        const channel = await discordClient.channels.fetch(process.env.CHANNEL_ID);
        channel.send(`User: ${username}#${discriminator}\nUser ID: ${id}\nAccount Created: ${new Date(created_at).toLocaleDateString()}`);

        // عرض البيانات على الشاشة مع زر نسخ الـ User ID
        res.send(`
            <h1>Login Successful</h1>
            <p>Username: ${username}#${discriminator}</p>
            <p>User ID: ${id}</p>
            <p>Account Created: ${new Date(created_at).toLocaleDateString()}</p>
            <button onclick="copyToClipboard('${id}')">Copy User ID</button>
            <script>
                function copyToClipboard(text) {
                    navigator.clipboard.writeText(text).then(() => {
                        alert('User ID copied to clipboard');
                    });
                }
            </script>
        `);
    } catch (error) {
        console.error('Error fetching user data:', error);
        res.send('An error occurred during the login process.');
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
