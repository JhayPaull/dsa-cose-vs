# Gold and Maroon Themed Dashboard

This directory contains the new gold and maroon themed dashboard implementation for the E-Voting System.

## Files Included

1. `gold-maroon-dashboard.html` - The main dashboard HTML file with the new theme
2. `../css/gold-maroon-theme.css` - The CSS file containing the gold and maroon color scheme
3. `../components/sidebar/gold-maroon-sidebar.html` - The sidebar component with the specified navigation structure

## Features

- Gold and maroon color scheme throughout the interface
- Responsive design that works on desktop and mobile devices
- AdminLTE integration for a professional dashboard appearance
- Custom sidebar with the exact structure requested:
  - Dashboard (active link)
  - Election section with Manage Elections and Voting History
  - User Management section with Manage Users and Sub-Admins
  - System section with Notifications, Analytics, and Settings
  - Logout functionality

## How to Use

To use this dashboard:

1. Copy the `gold-maroon-dashboard.html` file to your desired location
2. Ensure the CSS file `gold-maroon-theme.css` is in the correct relative path (`../css/`)
3. The sidebar is already included in the dashboard file, but you can also find it separately in `../components/sidebar/gold-maroon-sidebar.html`

## Customization

You can customize the colors by modifying the CSS variables in `gold-maroon-theme.css`:

- `--gold-primary`: Primary gold color (#FFD700)
- `--gold-light`: Lighter gold (#FFEC8B)
- `--gold-dark`: Darker gold (#DAA520)
- `--maroon-primary`: Primary maroon color (#800000)
- `--maroon-light`: Lighter maroon (#A52A2A)
- `--maroon-dark`: Darker maroon (#5C0000)

## Dependencies

This dashboard uses the following external libraries:

- Bootstrap 5
- Font Awesome 6
- AdminLTE 3
- Chart.js
- SweetAlert2
- jQuery

All dependencies are loaded via CDN in the HTML file.

## Implementation Notes

1. The sidebar uses the exact structure specified in the requirements
2. Active link styling follows the project specification with background color #2b292a
3. The theme is fully responsive and works on all device sizes
4. Logout functionality is implemented with confirmation dialog using SweetAlert2