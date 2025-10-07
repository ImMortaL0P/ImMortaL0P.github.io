CAT Mock Test Performance Tracker
A web-based application for CAT aspirants and administrators to manage, analyze, and track mock test performance. The project supports individual student login, secure authentication, simulated Google Sheets export, and advanced admin capabilities.

Features
For Students
Secure login via User ID and Password

Add, view, and delete personal mock test records

Real-time performance analytics and charts

Section-wise performance breakdown (VARC, LRDI, QA)

CSV/Sheets data export for personal results

User profile and statistics dashboard

For Admin
Admin login access with full system permissions

Add, edit, delete, and reset student user accounts

View & analyze mock results for all students

Class-wide analytics and top performer dashboard

Export collective data for further analysis or backup

Debugging console/data monitoring for system integrity

Technical Highlights
Role-based authentication (student/admin)

Robust login form validation and user feedback

Data persistence in localStorage (can be swapped with backend API)

Responsive design for mobile, tablet, and desktop screens

Modern UI using HTML, CSS, and vanilla JavaScript

Built-in debug/testing mode and system health dashboard

Quick Start
Get started by opening index.html in any modern web browser (Chrome, Firefox, Edge, Safari).

Demo Credentials
Role	User ID	Password	Name
Admin	admin	admin123	Administrator
Student	student1	pass123	Rahul Sharma
Student	student2	pass456	Priya Patel
Student	student3	pass789	Amit Kumar
Installation
No installation required for the single-page version. Copy all files into a folder and open index.html in your browser.

For deployment on a static host:

Copy index.html, style.css, app.js and supporting assets

Host files using GitHub Pages, Netlify, Vercel, or similar static hosts

Project Structure
text
CAT-MockTest-Tracker/
│
├── index.html           # Main application UI
├── style.css            # Stylesheet for all UI components
├── app.js               # Frontend logic, authentication, and analytics
├── README.md            # Documentation and usage guide

Usage Guide
1. Authentication
Login Screen: Enter your User ID and Password. The app validates credentials and redirects to dashboard based on role.

Admin Access: See system overview, manage student users, and view all test data.

Student Access: Manage only your own mock test records and personal analytics.

2. Student Dashboard
Add Test: Fill in mock name, scores, section marks, percentiles, negative marks, accuracy, and test date.

View Records: See and sort your own history.

Analytics: View percentile/score charts, progression, strengths/weaknesses.

3. Admin Dashboard
User Management: Create new students, reset passwords, edit details, delete accounts.

Student Data: View/test data for all students. Filter, search, and export results.

Analytics: Compare performance across students, find top performers, view class averages.

4. Export & Debug
CSV Export: Download your data for uploading to Google Sheets.

Debug Mode: View system information, session details, and localStorage status for troubleshooting.

Troubleshooting
If facing login issues:

Verify browser allows localStorage and JavaScript

Use correct case for User ID and Password

Use supported browsers only (Chrome, Firefox, Edge, Safari)

See the built-in Debug Information tab for system status and diagnostics

Extending/Deploying
To deploy in production or integrate with a real backend:

Replace localStorage with secure database/API

Integrate Google Sheets via REST API or OAuth

Add password hashing and advanced security logic for sensitive deployments

License
Open source for educational/non-commercial use. For production/commercial deployment, adapt security, user management, and persistence layers.

Contact & Credits
For queries and collaboration, contact project maintainer or open an issue in your code hosting repository. Original design and requirements by engineering education and CAT preparation domain experts.