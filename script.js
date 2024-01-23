async function generatePDF() {
    const imageInput = document.getElementById('imageInput');
    const fileNameInput = document.getElementById('fileNameInput');
    const generateButton = document.getElementById('generateButton');

    if (imageInput.files.length === 0) {
        alert('Please select at least one image.');
        return;
    }

    const formData = new FormData();
    Array.from(imageInput.files).forEach((file) => {
        formData.append('images', file);
    });

    const customFileName = fileNameInput.value.trim() || 'generated_pdf';

    try {
        const response = await fetch('/generate-pdf', {
            method: 'POST',
            body: formData,
            headers: {
                'Content-Disposition': `attachment; filename=${customFileName}.pdf`,
            },
        });

        if (response.ok) {
            const pdfBlob = await response.blob();
            const pdfUrl = URL.createObjectURL(pdfBlob);

            // Update button text and behavior
            generateButton.textContent = 'Download PDF';
            generateButton.onclick = () => {
                // Create a download link
                const downloadLink = document.createElement('a');
                downloadLink.href = pdfUrl;
                downloadLink.download = `${customFileName}.pdf`;

                // Append the link to the document
                document.body.appendChild(downloadLink);

                // Trigger a click event to prompt download
                downloadLink.click();

                // Remove the link from the document
                document.body.removeChild(downloadLink);
            };
        } else {
            console.error('Failed to generate PDF:', response.status, response.statusText);
        }
    } catch (error) {
        console.error('Error:', error.message);
    }
}
