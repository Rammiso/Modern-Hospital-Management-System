import docx2txt

# Convert all three documents
files = [
    ('MHMS_SRS_v1.docx', 'MHMS_SRS_v1.txt'),
    ('Design Document.docx', 'Design_Document.txt'),
    ('DEVELOPMENT PLAN.docx', 'DEVELOPMENT_PLAN.txt')
]

for docx_file, txt_file in files:
    try:
        text = docx2txt.process(docx_file)
        with open(txt_file, 'w', encoding='utf-8') as f:
            f.write(text)
        print(f"[OK] Converted {docx_file} to {txt_file}")
    except Exception as e:
        print(f"[ERROR] Error converting {docx_file}: {e}")

print("\nAll conversions completed!")
