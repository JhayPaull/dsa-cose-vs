// Test script to verify slider functionality
const express = require('express');
const app = express();
const port = 3005;

// Serve static files from the frontend directory
app.use(express.static('frontend'));

// Simple test endpoint
app.get('/test-slider', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Slider Functionality Test</title>
            <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
        </head>
        <body>
            <h1>Slider Functionality Test</h1>
            <p>This page tests the slider functionality integration.</p>
            
            <h2>Create Test Slider Item</h2>
            <form id="testForm">
                <input type="text" id="title" placeholder="Title" value="Test Slider Item"><br><br>
                <textarea id="description" placeholder="Description">This is a test slider item</textarea><br><br>
                <input type="text" id="link" placeholder="Link" value="/test"><br><br>
                <button type="submit">Create Slider Item</button>
            </form>
            
            <h2>Current Slider Items</h2>
            <div id="slider-items"></div>
            
            <script>
                // Test creating a slider item
                document.getElementById('testForm').addEventListener('submit', async function(e) {
                    e.preventDefault();
                    
                    const title = document.getElementById('title').value;
                    const description = document.getElementById('description').value;
                    const link = document.getElementById('link').value;
                    const imageUrl = 'https://via.placeholder.com/800x400/800000/FFD700?text=' + encodeURIComponent(title);
                    
                    const sliderItemData = {
                        title,
                        description,
                        imageUrl,
                        link
                    };
                    
                    try {
                        const response = await fetch('/api/slider', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify(sliderItemData)
                        });
                        
                        if (response.ok) {
                            alert('Slider item created successfully!');
                            loadSliderItems();
                        } else {
                            const errorData = await response.json();
                            alert('Error: ' + errorData.error);
                        }
                    } catch (error) {
                        alert('Error: ' + error.message);
                    }
                });
                
                // Load slider items
                async function loadSliderItems() {
                    try {
                        const response = await fetch('/api/slider');
                        if (response.ok) {
                            const sliderItems = await response.json();
                            const container = document.getElementById('slider-items');
                            
                            container.innerHTML = '<pre>' + JSON.stringify(sliderItems, null, 2) + '</pre>';
                        } else {
                            document.getElementById('slider-items').innerHTML = 'Error loading slider items';
                        }
                    } catch (error) {
                        document.getElementById('slider-items').innerHTML = 'Error: ' + error.message;
                    }
                }
                
                // Load slider items on page load
                loadSliderItems();
            </script>
        </body>
        </html>
    `);
});

app.listen(port, () => {
    console.log('Test server running at http://localhost:' + port + '/test-slider');
});