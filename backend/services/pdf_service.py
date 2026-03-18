from fpdf import FPDF

def clean_text(text):
    if not text: return ""
    replacements = {
        "\u2013": "-", "\u2014": "-", "\u2018": "'", 
        "\u2019": "'", "\u201c": '"', "\u201d": '"', 
        "\u2022": "*"
    }
    for char, replacement in replacements.items():
        text = text.replace(char, replacement)
    # Ensure PDF compatibility (Latin-1 encoding)
    return text.encode('latin-1', 'replace').decode('latin-1')

class PDF(FPDF):
    def __init__(self, brand_color=(0, 0, 128)):
        super().__init__()
        self.brand_color = brand_color

    def header(self):
        pass

    def add_modern_header(self, name, contact_info):
        name = clean_text(name)
        contact_info = clean_text(contact_info)
        # Full Width Colored Box
        self.set_fill_color(*self.brand_color)
        self.rect(0, 0, 210, 35, 'F') 
        # Name (White, Large, Bold)
        self.set_text_color(255, 255, 255)
        self.set_font('Arial', 'B', 24)
        self.set_xy(10, 12)
        self.cell(0, 10, name.upper(), 0, 1, 'C')
        # Contact Info (White, Smaller)
        self.set_font('Arial', '', 10)
        self.set_xy(10, 28)
        self.cell(0, 5, contact_info, 0, 1, 'C')
        self.ln(20)

    def add_classic_header(self, name, contact_info):
        name = clean_text(name)
        contact_info = clean_text(contact_info)
        # Name (Colored, Large)
        self.set_text_color(*self.brand_color)
        self.set_font('Arial', 'B', 22)
        self.cell(0, 10, name.upper(), 0, 1, 'C')
        # Contact Info (Dark Grey)
        self.set_text_color(80, 80, 80)
        self.set_font('Arial', '', 10)
        self.cell(0, 5, contact_info, 0, 1, 'C')
        # Horizontal Line
        self.set_draw_color(*self.brand_color)
        self.set_line_width(0.5)
        self.line(10, 32, 200, 32) 
        self.ln(15)

    def section_title(self, title):
        title = clean_text(title)
        self.set_font('Arial', 'B', 12)
        self.set_text_color(*self.brand_color)
        self.cell(0, 8, title.upper(), 0, 1, 'L')
        curr_y = self.get_y() - 1 
        self.set_draw_color(*self.brand_color)
        self.set_line_width(0.3)  
        self.line(10, curr_y, 200, curr_y) 
        self.set_line_width(0.2)
        self.ln(2)

    def section_body(self, text):
        text = clean_text(text)
        self.set_text_color(40, 40, 40)
        self.set_font('Arial', '', 10)
        self.multi_cell(0, 5, text)
        self.ln(3)

    def bullet_points(self, items):
        self.set_font('Arial', '', 10)
        self.set_text_color(40, 40, 40)
        for item in items:
            item = clean_text(item)
            self.cell(6) # Indent
            self.cell(4, 5, chr(127), 0, 0) # Bullet char
            self.multi_cell(0, 5, item)
        self.ln(3)

def generate_pdf_resume(ai_data, contact_info, template_choice, brand_color):
    pdf = PDF(brand_color=brand_color)
    pdf.add_page()
    
    if template_choice == "Modern (Bold Header)":
        pdf.add_modern_header(ai_data['profile_name'], contact_info)
    else:
        pdf.add_classic_header(ai_data['profile_name'], contact_info)

    sections = [
        ("Professional Summary", ai_data['summary'], "text"),
        ("Technical Skills", ", ".join(ai_data['skills']), "text"),
        ("Work Experience", ai_data['experience'], "bullets"),
        ("Key Projects", ai_data['projects'], "bullets"),
        ("Education", ai_data['education'], "text")
    ]

    for title, content, style in sections:
        pdf.section_title(title)
        if style == "text":
            pdf.section_body(content)
        else:
            pdf.bullet_points(content)

    if ai_data.get('achievements'):
        pdf.section_title("Honors & Awards")
        pdf.bullet_points(ai_data['achievements'])
    
    if ai_data.get('other_information'):
        pdf.section_title("Additional Details")
        pdf.section_body(ai_data['other_information'])

    # Output as bytes - fpdf2 returns bytes by default with no dest arg
    pdf_output = pdf.output(dest='S')
    if isinstance(pdf_output, str):
        return pdf_output.encode('latin-1')
    return bytes(pdf_output)
