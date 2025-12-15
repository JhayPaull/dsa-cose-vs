const fs = require('fs');
const path = require('path');

// Directory to search for HTML files
const frontendDir = path.join(__dirname, 'frontend');

// Function to process each HTML file
function processFile(filePath) {
    try {
        let content = fs.readFileSync(filePath, 'utf8');
        
        // Check if the file already has the shared-logout script
        if (content.includes('shared-logout.js')) {
            console.log(`Skipping (already processed): ${filePath}`);
            return;
        }
        
        // Find the closing </head> tag to insert our script before it
        const headCloseTag = '</head>';
        const bodyCloseTag = '</body>';
        
        // Add the script reference before the closing </head> tag
        if (content.includes(headCloseTag)) {
            const scriptTag = '    <script src="/js/shared-logout.js"></script>';
            content = content.replace(headCloseTag, `    ${scriptTag}\n${headCloseTag}`);
            
            // Update the logout link to use the new functionality
            content = content.replace(
                /<a[^>]*id=["']?logoutBtn["']?[^>]*href=["']?[^"']*["']?[^>]*>/g,
                '<a href="#" class="dropdown-item text-danger" id="logoutBtn" onclick="event.preventDefault();">'
            );
            
            fs.writeFileSync(filePath, content, 'utf8');
            console.log(`Updated: ${filePath}`);
        } else if (content.includes(bodyCloseTag)) {
            // If no </head> tag, add before </body>
            const scriptTag = '    <script src="/js/shared-logout.js"></script>';
            content = content.replace(bodyCloseTag, `    ${scriptTag}\n${bodyCloseTag}`);
            
            // Update the logout link to use the new functionality
            content = content.replace(
                /<a[^>]*id=["']?logoutBtn["']?[^>]*href=["']?[^"']*["']?[^>]*>/g,
                '<a href="#" class="dropdown-item text-danger" id="logoutBtn" onclick="event.preventDefault();">'
            );
            
            fs.writeFileSync(filePath, content, 'utf8');
            console.log(`Updated (before body): ${filePath}`);
        } else {
            console.log(`Skipping (no head/body tag): ${filePath}`);
        }
    } catch (error) {
        console.error(`Error processing ${filePath}:`, error);
    }
}

// Recursively find all HTML files
function processDirectory(directory) {
    const files = fs.readdirSync(directory);
    
    files.forEach(file => {
        const fullPath = path.join(directory, file);
        const stat = fs.statSync(fullPath);
        
        if (stat.isDirectory()) {
            processDirectory(fullPath);
        } else if (file.endsWith('.html')) {
            processFile(fullPath);
        }
    });
}

// Start processing from the frontend directory
if (fs.existsSync(frontendDir)) {
    console.log('Starting to update logout functionality...');
    processDirectory(frontendDir);
    console.log('Update complete!');
} else {
    console.error('Frontend directory not found:', frontendDir);
}
