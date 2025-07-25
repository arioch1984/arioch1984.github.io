# LinkedIn Skills Extractor

This script extracts skills and their endorsement counts from a LinkedIn HTML file and updates the "Le Mie Competenze" section of a personal website.

## Features

- Extracts skills and their endorsement counts from a LinkedIn HTML file
- Sorts skills by endorsement count
- Automatically searches and downloads relevant icons for each skill from the internet
- Displays the number of endorsements for each skill
- Represents the number of endorsements with a progress bar
- Updates the "Le Mie Competenze" section of the website
- Filters out skills with fewer than 3 endorsements

## Prerequisites

- Python 3.x (no additional packages required, uses only the standard library)
- A saved HTML file of your LinkedIn skills page
- Your personal website with a "Le Mie Competenze" section

## Usage

1. Save your LinkedIn skills page as HTML:
   - Go to your LinkedIn profile
   - Click on "Skills & Endorsements"
   - Save the page as HTML (e.g., "Skills _ Your Name _ LinkedIn.html")
   - Place the HTML file in the `assets/data` directory of your website

2. Run the script:
   ```
   python3 extract_skills.py
   ```

3. The script will:
   - Extract skills and their endorsement counts from the LinkedIn HTML file
   - Filter out skills with fewer than 3 endorsements
   - Sort them by endorsement count
   - Search and download appropriate icons for each skill
   - Generate HTML with custom icons and progress bars
   - Update the "Le Mie Competenze" section of your website

## Icon Management

The script automatically searches for and downloads appropriate icons for each skill:

- Icons are downloaded from the internet based on the skill name
- Downloaded icons are stored in the `images/skill-icons` directory
- Icons are resized to a standard size (32x32 pixels)
- If an icon cannot be found or downloaded, the script falls back to using Font Awesome icons
- Icons are cached, so they're only downloaded once per skill

## Customization

You can customize the script by:

- Modifying the `fallback_icons` dictionary to add more skill-to-icon mappings for the fallback mechanism
- Adjusting the CSS styles in the `generate_skills_html` function
- Changing the text in the "Le Mie Competenze" section
- Modifying the `get_skill_icon` function to use a different icon search method

## How It Works

1. The script extracts skills and their endorsement counts from the LinkedIn HTML file using regular expressions
2. It filters out skills with fewer than 3 endorsements
3. For each skill, it searches for and downloads an appropriate icon from the internet
4. It generates HTML with the downloaded icons (or fallback Font Awesome icons) and progress bars
5. The progress bars represent the relative number of endorsements, with the skill having the most endorsements getting a full-width bar
6. It updates the "Le Mie Competenze" section of the website with the generated HTML

## Troubleshooting

If the script doesn't find any skills, try:

1. Checking that the LinkedIn HTML file is in the correct location
2. Verifying that the HTML file contains skills and endorsements
3. Examining the HTML structure to ensure the regex patterns match

If icons aren't downloading correctly:

1. Check your internet connection
2. Verify that the `images/skill-icons` directory exists and is writable
3. Check the console output for any error messages related to icon downloads

## License

This project is licensed under the MIT License - see the LICENSE file for details.
