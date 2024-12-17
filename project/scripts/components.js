const header = document.querySelector('header');
const footer = document.querySelector('footer');

header.innerHTML = `
    <div class="header-container">
        <div class="logo">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="100" height="100">
                <g transform="translate(100,100) rotate(90)">
                    <polygon points="150,60 225,105 225,195 150,240 75,195 75,105" fill="none" stroke="#2ecc71" stroke-width="6" transform="translate(-150,-150)"/>
                    <polygon points="150,90 195,120 195,180 150,210 105,180 105,120" fill="#27ae60" opacity="0.3" transform="translate(-150,-150)"/>
                    <circle cx="0" cy="-60" r="10" fill="#27ae60"/>
                    <circle cx="0" cy="60" r="10" fill="#27ae60"/>
                    <circle cx="75" cy="0" r="10" fill="#27ae60"/>
                    <circle cx="-75" cy="0" r="10" fill="#27ae60"/>
                    <circle cx="0" cy="0" r="30" fill="#145a32">
                        <animateMotion
                        path="M0,0 L0,0 L15,-10.5 L15,-10.5 L-12,12 L-12,12 L-7.5,-13.5 L-7.5,-13.5 L0,18 L0,18 L0,0 L0,0"
                        dur="100s"
                        keyTimes="0; 0.2; 0.205; 0.21; 0.215; 0.22; 0.225; 0.23; 0.235; 0.24; 0.245; 1"
                        keySplines="0 0 0 0; 0.5 0 0.5 1; 0.5 0 0.5 1; 0.5 0 0.5 1; 0.5 0 0.5 1; 0.5 0 0.5 1; 0.5 0 0.5 1; 0.5 0 0.5 1; 0.5 0 0.5 1; 0.5 0 0.5 1; 0 0 0 0"
                        calcMode="spline"
                        repeatCount="indefinite"/>
                    </circle>
                </g>
            </svg>
        </div>
        <h1>Learning With Andrew</h1>
        <nav>
            <ul>
                <li><a href="index.html" class="menu-link">Home</a></li>
                <li><a href="index.html#featured-content" class="menu-link">Projects</a>
                    <ul id="projects-menu">
                        <li><a href="boids.html">Visualizing Boids</a></li>
                        <li><a href="fabric.html">Fabric And Rope Simulation</a></li>
                    </ul>
                </li>
                <li><a href="siteplan.html" class="menu-link">Site Plan</a></li>
                <li><a href="https://www.linkedin.com/in/andrew-parry-66b405258/" class="menu-link">Contact Me</a></li>
            </ul>
        </nav>
    </div>`;

footer.innerHTML = `
    <div class="footer-content">
        <div class="footer-section">
            <h3>Quick Links</h3>
            <ul>
                <li><a href="index.html">Home</a></li>
                <li><a href="siteplan.html">Site Plan</a></li>
                <li><a href="contact.html">Contact</a></li>
            </ul>
        </div>
        <div class="footer-section">
            <h3>Resources</h3>
            <ul>
                <li><a href="attributions.html">Attributions</a></li>
                <li><a href="https://github.com/yourusername/wdd131">GitHub Repository</a></li>
            </ul>
        </div>
        <div class="footer-section" id="copyright">
            <p>&copy; ${new Date().getFullYear()} Learning With Andrew. All rights reserved.</p>
            <p>Last modified: ${document.lastModified}</p>
        </div>
    </div>`;