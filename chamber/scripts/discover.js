// DOM Elements - Cache them once
const membersGrid = document.getElementById('members-grid');
const membersList = document.getElementById('members-list');
const gridViewBtn = document.getElementById('grid-view');
const listViewBtn = document.getElementById('list-view');
const memberCount = document.getElementById('member-count');
const goldCount = document.getElementById('gold-count');
const silverCount = document.getElementById('silver-count');

// Check if required elements exist
if (!membersGrid) {
    console.error('Error: members-grid element not found in HTML');
}

// Cache for member data
let cachedMembers = null;

// Async function to fetch members data - Optimized
async function getMembers() {
    // Return cached data if available
    if (cachedMembers) {
        console.log('Using cached members data');
        return cachedMembers;
    }
    
    console.log('Fetching members data...');
    
    try {
        // Try different paths - use relative path that matches your file structure
        let response;
        
        // Try the most likely path first
        response = await fetch('data/members.json');
        
        console.log('Response status:', response.status);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status} - ${response.statusText}`);
        }
        
        const members = await response.json();
        console.log(`Successfully loaded ${members.length} members`);
        
        // Cache the result
        cachedMembers = members;
        return members;
        
    } catch (error) {
        console.error('Error fetching members:', error);
        
        // Show error message to user - More efficient
        if (membersGrid) {
            const errorHTML = `
                <div class="error">
                    <h3>Unable to Load Members</h3>
                    <p>Please check:</p>
                    <ul>
                        <li>members.json file exists</li>
                        <li>JSON file is in correct location</li>
                        <li>JSON format is valid</li>
                    </ul>
                    <p><small>Error details: ${error.message}</small></p>
                </div>
            `;
            membersGrid.innerHTML = errorHTML;
        }
        return [];
    }
}

// Function to create member card - More efficient DOM manipulation
function createMemberCard(member) {
    const memberCard = document.createElement('div');
    memberCard.className = `member-card ${member.membership}`;
    
    // Use default image path if none provided
    const imageUrl = member.image ? `images/${member.image}` : 'images/placeholder.jpg';
    
    memberCard.innerHTML = `
        <img src="${imageUrl}" alt="${member.name}" loading="lazy" 
             data-src="${imageUrl}" class="lazy-image">
        <div class="member-info">
            <h3>${member.name}</h3>
            ${member.category ? `<p class="category">${member.category}</p>` : ''}
            <p class="membership-badge ${member.membership}">${member.membership.toUpperCase()}</p>
            <p>📍 ${member.address}</p>
            <p>📞 ${member.phone}</p>
            ${member.description ? `<p class="description">${member.description}</p>` : ''}
            <a href="${member.website}" target="_blank" rel="noopener">Visit Website</a>
        </div>
    `;
    
    return memberCard;
}

// Function to display members in grid view - Optimized
function displayGrid(members) {
    if (!membersGrid || !members.length) return;
    
    // Clear content efficiently
    while (membersGrid.firstChild) {
        membersGrid.removeChild(membersGrid.firstChild);
    }
    
    // Use DocumentFragment for batch DOM insertion
    const fragment = document.createDocumentFragment();
    
    // Limit initial display if you have many members
    const displayMembers = members.slice(0, 12); // Show first 12, then lazy load more
    
    displayMembers.forEach(member => {
        fragment.appendChild(createMemberCard(member));
    });
    
    membersGrid.appendChild(fragment);
}

// Function to display members in list view - Optimized
function displayList(members) {
    if (!membersList || !members.length) return;
    
    // Clear content
    while (membersList.firstChild) {
        membersList.removeChild(membersList.firstChild);
    }
    
    const table = document.createElement('table');
    
    // Build table rows more efficiently
    let tableHTML = `
        <thead>
            <tr>
                <th>Business Name</th>
                <th>Address</th>
                <th>Phone</th>
                <th>Membership Level</th>
                <th>Website</th>
            </tr>
        </thead>
        <tbody>
    `;
    
    members.forEach(member => {
        tableHTML += `
            <tr>
                <td>${member.name}</td>
                <td>${member.address}</td>
                <td>${member.phone}</td>
                <td><span class="membership-badge ${member.membership}">${member.membership.toUpperCase()}</span></td>
                <td><a href="${member.website}" target="_blank" rel="noopener">Visit</a></td>
            </tr>
        `;
    });
    
    tableHTML += '</tbody>';
    table.innerHTML = tableHTML;
    membersList.appendChild(table);
}

// Function to update statistics - Optimized
function updateStats(members) {
    if (!members.length) return;
    
    if (memberCount) memberCount.textContent = members.length;
    
    // Count members more efficiently
    let goldMembers = 0;
    let silverMembers = 0;
    
    for (let i = 0; i < members.length; i++) {
        const membership = members[i].membership;
        if (membership === 'gold') goldMembers++;
        if (membership === 'silver') silverMembers++;
    }
    
    if (goldCount) goldCount.textContent = goldMembers;
    if (silverCount) silverCount.textContent = silverMembers;
}

// View toggle functionality - Optimized
function setupViewToggle() {
    if (!gridViewBtn || !listViewBtn || !membersGrid || !membersList) {
        console.warn('View toggle elements not found');
        return;
    }
    
    // Use a single event handler for both buttons
    function switchView(isGridView) {
        if (isGridView) {
            gridViewBtn.classList.add('active');
            listViewBtn.classList.remove('active');
            membersGrid.classList.remove('hidden');
            membersList.classList.add('hidden');
        } else {
            listViewBtn.classList.add('active');
            gridViewBtn.classList.remove('active');
            membersList.classList.remove('hidden');
            membersGrid.classList.add('hidden');
        }
    }
    
    gridViewBtn.addEventListener('click', () => switchView(true));
    listViewBtn.addEventListener('click', () => switchView(false));
    
    // Set initial state
    switchView(true);
}

// Set current year and last modified - Simplified
function setPageMetadata() {
    const currentYear = document.getElementById('current-year');
    const lastModified = document.getElementById('last-modified');
    
    if (currentYear) {
        currentYear.textContent = new Date().getFullYear();
    }
    
    if (lastModified) {
        lastModified.textContent = document.lastModified;
    }
    
    // Remove page weight calculation during initial load
    // Calculate it separately if needed
}

// Responsive menu toggle - Optimized
function setupMenuToggle() {
    const menuToggle = document.getElementById('menu-toggle');
    const mainNav = document.getElementById('main-nav');
    
    if (menuToggle && mainNav) {
        // Use event delegation or single handler
        menuToggle.addEventListener('click', function() {
            const isExpanded = this.getAttribute('aria-expanded') === 'true';
            this.setAttribute('aria-expanded', !isExpanded);
            mainNav.classList.toggle('show');
        });
    }
}

// Lazy load images
function setupLazyLoading() {
    const lazyImages = document.querySelectorAll('.lazy-image');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy-image');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        lazyImages.forEach(img => imageObserver.observe(img));
    } else {
        // Fallback for older browsers
        lazyImages.forEach(img => {
            img.src = img.dataset.src;
        });
    }
}

// Debounce function for resize events
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Initialize the page - Optimized
async function initDirectory() {
    console.log('Initializing Chamber Directory...');
    
    // Set page metadata
    setPageMetadata();
    
    // Setup menu toggle
    setupMenuToggle();
    
    // Setup view toggle
    setupViewToggle();
    
    // Load members
    const members = await getMembers();
    
    if (members && members.length > 0) {
        console.log(`Displaying ${members.length} members`);
        
        // Display in default view (grid)
        displayGrid(members);
        
        // Only prepare list view if needed
        if (listViewBtn) {
            displayList(members);
        }
        
        updateStats(members);
        
        // Setup lazy loading after content is loaded
        setTimeout(setupLazyLoading, 100);
    } else {
        console.warn('No members loaded');
    }
}

// Optimized event listener
document.addEventListener('DOMContentLoaded', () => {
    // RequestIdleCallback for non-critical initialization
    if ('requestIdleCallback' in window) {
        requestIdleCallback(() => {
            initDirectory();
        }, { timeout: 2000 });
    } else {
        // Fallback for browsers without requestIdleCallback
        setTimeout(initDirectory, 100);
    }
});

// Add CSS for better performance
const performanceStyles = `
    .hidden {
        display: none !important;
    }
    
    .lazy-image {
        opacity: 0;
        transition: opacity 0.3s;
    }
    
    .lazy-image.loaded {
        opacity: 1;
    }
    
    .member-card {
        will-change: transform;
    }
`;

// Inject performance CSS
const styleSheet = document.createElement("style");
styleSheet.textContent = performanceStyles;
document.head.appendChild(styleSheet);