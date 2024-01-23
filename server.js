const express = require('express');
const multer = require('multer');
const { PDFDocument } = require('pdf-lib');

const app = express();
const port = 3000;

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.use(express.static('public'));
app.use(express.json());

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

app.post('/generate-pdf', upload.array('images'), async (req, res) => {
    try {
        const images = req.files;

        // Create a new PDF document
        const pdfDoc = await PDFDocument.create();
        const page = pdfDoc.addPage();

        let yPosition = 250; // Initial y-position for images

        // Add images to the PDF
        for (const image of images) {
            const imageBytes = image.buffer;
            const embeddedImage = await pdfDoc.embedJpg(imageBytes);
            const { width, height } = embeddedImage.scale(0.5);
            page.drawImage(embeddedImage, {
                x: 10,
                y: yPosition - height,
                width,
                height,
            });

            // Update y-position for the next image
            yPosition -= height + 10;
        }

        // Save the PDF to a buffer
        const pdfBytes = await pdfDoc.save();

        // Send the PDF as a response
        res.setHeader('Content-Type', 'application/pdf');
        res.send(pdfBytes);
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});
