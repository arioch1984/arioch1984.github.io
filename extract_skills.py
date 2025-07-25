import re
import os
from collections import defaultdict

# Path to the LinkedIn HTML file
linkedin_file = "assets/data/Skills _ Fabio Brunelli _ LinkedIn.html"

# Function to extract skills and endorsements
def extract_skills():
    # Read the LinkedIn HTML file
    with open(linkedin_file, 'r', encoding='utf-8') as file:
        html_content = file.read()

    # Dictionary to store skills and their endorsement counts
    skills = {}

    # Use regular expressions to find skill names and endorsement counts
    # First, find all skill sections in the HTML
    # This pattern looks for the structure that contains both skill name and endorsement count
    skill_section_pattern = re.compile(r'<div class="display-flex align-items-center\s+mr1 hoverable-link-text t-bold">\s*<span aria-hidden="true"><!---->([^<]+)<!----></span>.*?<span aria-hidden="true"><!---->(\d+) endorsements?<!----></span>', re.DOTALL)

    # Find all skill sections
    skill_matches = skill_section_pattern.finditer(html_content)

    for match in skill_matches:
        skill_name = match.group(1)
        count = int(match.group(2))

        # Skip entries that are likely not skills
        if any(non_skill in skill_name.lower() for non_skill in [
            "endorsed by", "colleagues at", "passed linkedin", "skill assessment", 
            "see all", "show more", "view", "add", "edit"
        ]):
            continue

        # Store the skill and its count (keep the highest count if duplicate)
        if skill_name not in skills or count > skills[skill_name]:
            skills[skill_name] = count

    # If no skills were found with the above pattern, try a simpler approach
    if not skills:
        # Find all skill names
        skill_name_pattern = re.compile(r'<span aria-hidden="true"><!---->([^<]+)<!----></span><span class="visually-hidden"><!---->([^<]+)<!----></span>')
        skill_name_matches = skill_name_pattern.finditer(html_content)

        # Create a list of potential skill names
        potential_skills = []
        for match in skill_name_matches:
            skill_name = match.group(1)
            # Skip entries that are likely not skills
            if any(non_skill in skill_name.lower() for non_skill in [
                "endorsed by", "colleagues at", "passed linkedin", "skill assessment", 
                "see all", "show more", "view", "add", "edit", "endorsement", "endorsements"
            ]):
                continue
            potential_skills.append((match.start(), skill_name))

        # Find all endorsement counts
        endorsement_pattern = re.compile(r'<span aria-hidden="true"><!---->(\d+) endorsements?<!----></span>')
        endorsement_matches = endorsement_pattern.finditer(html_content)

        for match in endorsement_matches:
            count = int(match.group(1))
            pos = match.start()

            # Find the closest skill name before this endorsement count
            closest_skill = None
            closest_distance = float('inf')

            for skill_pos, skill_name in potential_skills:
                if skill_pos < pos and pos - skill_pos < closest_distance:
                    closest_skill = skill_name
                    closest_distance = pos - skill_pos

            if closest_skill and closest_distance < 2000:  # Only consider skills within a reasonable distance
                # Store the skill and its count (keep the highest count if duplicate)
                if closest_skill not in skills or count > skills[closest_skill]:
                    skills[closest_skill] = count

    # Filter skills with fewer than 3 endorsements
    filtered_skills = {skill: count for skill, count in skills.items() if count >= 3}

    # Sort skills by endorsement count (descending)
    sorted_skills = sorted(filtered_skills.items(), key=lambda x: x[1], reverse=True)

    return sorted_skills

# Function to generate HTML for skills with progress bars
def generate_skills_html(skills):
    # Find the maximum endorsement count for scaling
    max_count = max([count for _, count in skills]) if skills else 0

    html = []
    html.append('<ul class="skill-list">')

    # Add CSS for the skill list
    css = """
<style>
.skill-list {
    list-style: none;
    padding: 0;
}
.skill-item {
    margin-bottom: 1.5em;
    display: flex;
    flex-direction: column;
}
.skill-header {
    display: flex;
    justify-content: space-between;
    margin-bottom: 0.5em;
}
.skill-name {
    font-weight: bold;
}
.skill-count {
    color: #777;
}
.skill-bar-container {
    width: 100%;
    background-color: #e0e0e0;
    border-radius: 4px;
    height: 8px;
    overflow: hidden;
}
.skill-bar {
    height: 100%;
    background-color: #4acaa8;
    border-radius: 4px;
}
</style>
"""


    # Generate HTML for each skill
    for skill_name, count in skills:
        # Calculate the percentage for the progress bar
        percentage = (count / max_count) * 100 if max_count > 0 else 0

        # Generate HTML for the skill
        html.append(f'<li class="skill-item">')
        html.append(f'  <div class="skill-header">')
        html.append(f'    <div class="skill-name">{skill_name}</div>')

        html.append(f'    <div class="skill-count">{count} endorsement{"s" if count != 1 else ""}</div>')
        html.append(f'  </div>')
        html.append(f'  <div class="skill-bar-container">')
        html.append(f'    <div class="skill-bar" style="width: {percentage}%;"></div>')
        html.append(f'  </div>')
        html.append(f'</li>')

    html.append('</ul>')

    return css + '\n' + '\n'.join(html)

# Function to update the index.html file
def update_index_html(skills_html):
    index_file = "index.html"

    # Read the current index.html file
    with open(index_file, 'r', encoding='utf-8') as file:
        content = file.read()

    # Find the "Le Mie Competenze" section
    start_marker = '<section id="two">'
    end_marker = '</section>'

    start_index = content.find(start_marker)
    if start_index == -1:
        print("Could not find the 'Le Mie Competenze' section in index.html")
        return False

    # Find the end of the section
    section_content = content[start_index:]
    end_index = section_content.find(end_marker)
    if end_index == -1:
        print("Could not find the end of the 'Le Mie Competenze' section in index.html")
        return False

    end_index = start_index + end_index + len(end_marker)

    # Create the new section content
    new_section = f'''<section id="two">
								<div class="container">
									<h3>Le Mie Competenze</h3>
									<p>La mia esperienza tecnica si estende su vari domini dello sviluppo software, con un focus sulla creazione di soluzioni efficienti e user-friendly. Le competenze sono ordinate per numero di endorsement ricevuti su LinkedIn.</p>
									{skills_html}
								</div>
							</section>'''

    # Replace the old section with the new one
    new_content = content[:start_index] + new_section + content[end_index:]

    # Write the updated content back to the file
    with open(index_file, 'w', encoding='utf-8') as file:
        file.write(new_content)

    return True

# Main function
def main():
    print("Extracting skills from LinkedIn HTML file...")
    skills = extract_skills()

    if not skills:
        print("No skills found in the LinkedIn HTML file.")
        return

    print(f"Found {len(skills)} skills.")

    print("Generating HTML for skills...")
    skills_html = generate_skills_html(skills)

    print("Updating index.html...")
    if update_index_html(skills_html):
        print("Successfully updated index.html with skills from LinkedIn.")
    else:
        print("Failed to update index.html.")

if __name__ == "__main__":
    main()
