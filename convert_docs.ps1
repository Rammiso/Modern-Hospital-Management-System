# Convert DOCX to TXT
$word = New-Object -ComObject Word.Application
$word.Visible = $false

# Convert MHMS_SRS_v1.docx
$doc1 = $word.Documents.Open("c:\MERN Stack\Modern-Hospital-MS\MHMS_SRS_v1.docx")
$doc1.SaveAs("c:\MERN Stack\Modern-Hospital-MS\MHMS_SRS_v1.txt", 2)
$doc1.Close()

# Convert Design Document.docx
$doc2 = $word.Documents.Open("c:\MERN Stack\Modern-Hospital-MS\Design Document.docx")
$doc2.SaveAs("c:\MERN Stack\Modern-Hospital-MS\Design_Document.txt", 2)
$doc2.Close()

# Convert DEVELOPMENT PLAN.docx
$doc3 = $word.Documents.Open("c:\MERN Stack\Modern-Hospital-MS\DEVELOPMENT PLAN.docx")
$doc3.SaveAs("c:\MERN Stack\Modern-Hospital-MS\DEVELOPMENT_PLAN.txt", 2)
$doc3.Close()

$word.Quit()
[System.Runtime.Interopservices.Marshal]::ReleaseComObject($word) | Out-Null
Write-Host "Conversion completed successfully!"
