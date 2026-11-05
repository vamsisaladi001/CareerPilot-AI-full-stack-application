
from pypdf import PdfReader


def extract_pdf_text(file_path):
    reader = PdfReader(file_path)

    extracted_text = ""

    for page_number, page in enumerate(reader.pages, start=1):
        text = page.extract_text()

        if text:
            extracted_text += f"\n--- Page {page_number} ---\n"
            extracted_text += text

    return extracted_text
