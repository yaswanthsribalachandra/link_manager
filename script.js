// Initialize links array from localStorage
let links = JSON.parse(localStorage.getItem('links')) || [];

// Display links on page load
document.addEventListener('DOMContentLoaded', () => {
    displayLinks();
});

// Handle form submission
document.getElementById('linkForm').addEventListener('submit', (e) => {
    e.preventDefault();
    
    const name = document.getElementById('linkName').value;
    const url = document.getElementById('linkUrl').value;
    const description = document.getElementById('linkDesc').value;
    
    const newLink = {
        id: Date.now(),
        name: name,
        url: url,
        description: description,
        date: new Date().toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric' 
        })
    };
    
    links.unshift(newLink); // Add to beginning of array
    saveLinks();
    displayLinks();
    
    // Clear form
    e.target.reset();
    
    // Show success feedback
    showNotification('Link added successfully!');
});

// Save links to localStorage
function saveLinks() {
    localStorage.setItem('links', JSON.stringify(links));
}

// Display links
function displayLinks(linksToDisplay = links) {
    const container = document.getElementById('linksList');
    
    if (linksToDisplay.length === 0) {
        container.innerHTML = '<div class="no-links">No links found. Add your first link above! 🎯</div>';
        return;
    }
    
    container.innerHTML = linksToDisplay.map(link => `
        <div class="link-card">
            <div class="link-header">
                <div class="link-info">
                    <h3>${escapeHtml(link.name)}</h3>
                    <a href="${escapeHtml(link.url)}" target="_blank">${escapeHtml(link.url)}</a>
                    <div class="link-date">📅 ${link.date}</div>
                </div>
                <div class="link-actions">
                    <button class="btn-delete" onclick="deleteLink(${link.id})">Delete</button>
                </div>
            </div>
            ${link.description ? `<div class="link-description">${escapeHtml(link.description)}</div>` : ''}
        </div>
    `).join('');
}

// Delete link
function deleteLink(id) {
    if (confirm('Are you sure you want to delete this link?')) {
        links = links.filter(link => link.id !== id);
        saveLinks();
        displayLinks();
        showNotification('Link deleted!');
    }
}

// Search links
function searchLinks() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const filtered = links.filter(link => 
        link.name.toLowerCase().includes(searchTerm) ||
        link.url.toLowerCase().includes(searchTerm) ||
        link.description.toLowerCase().includes(searchTerm)
    );
    displayLinks(filtered);
}

// Export data
function exportData() {
    const dataStr = JSON.stringify(links, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `links-backup-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    showNotification('Data exported successfully!');
}

// Import data
function importData() {
    document.getElementById('importFile').click();
}

function handleImport(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const importedLinks = JSON.parse(e.target.result);
                if (confirm(`Import ${importedLinks.length} links? This will replace current data.`)) {
                    links = importedLinks;
                    saveLinks();
                    displayLinks();
                    showNotification('Data imported successfully!');
                }
            } catch (error) {
                alert('Error importing file. Please check the file format.');
            }
        };
        reader.readAsText(file);
    }
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Show notification
function showNotification(message) {
    // Simple alert for now - you can enhance this
    const notification = document.createElement('div');
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #4CAF50;
        color: white;
        padding: 15px 25px;
        border-radius: 6px;
        box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        z-index: 1000;
    `;
    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 3000);
}