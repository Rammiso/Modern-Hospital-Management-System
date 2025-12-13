# PowerShell script to remove all .md files from git except README.md
# This keeps the files locally but removes them from git tracking

Write-Host "Removing .md files from git tracking (except README.md)..." -ForegroundColor Cyan

# Remove root directory .md files (except README.md)
$rootMdFiles = @(
    "BILLING_DASHBOARD_README.md",
    "BILLING_SETUP_COMPLETE.md",
    "COMPLETE_HMS_STATUS.md",
    "COMPLETE_REDESIGN_SUMMARY.md",
    "COMPLETE_SYSTEM_STATUS.md",
    "CONSULTATION_WORKFLOW_COMPLETE.md",
    "DASHBOARD_QUICK_GUIDE.md",
    "FINAL_SUMMARY.md",
    "FINISH_CONSULTATION_FIX.md",
    "FIXES_APPLIED.md",
    "HOW_TO_ACCESS_PATIENT_DASHBOARD.md",
    "LAB_DASHBOARD_README.md",
    "LAYOUT_REDESIGN_COMPLETE.md",
    "LOGIN_AND_ROLES_UPDATE.md",
    "LOGIN_ISSUE_RESOLVED.md",
    "LOGIN_PAGE_REDESIGN.md",
    "PATIENTS_LIST_REDESIGN_COMPLETE.md",
    "PATIENT_DASHBOARD_README.md",
    "PATIENT_DASHBOARD_SETUP_COMPLETE.md",
    "PHARMACY_DASHBOARD_README.md",
    "PHARMACY_SETUP_COMPLETE.md",
    "PRESCRIPTION_UI_GUIDE.md",
    "PRESCRIPTION_WORKFLOW.md",
    "QUICK_FIX_SUMMARY.md",
    "QUICK_REFERENCE.md",
    "QUICK_START_GUIDE.md",
    "ROLE_BASED_DASHBOARDS.md",
    "ROLE_DASHBOARDS_COMPLETE.md",
    "SETUP_DEMO_USERS.md",
    "SYSTEM_STATUS.md",
    "TEST_LOGIN_INSTRUCTIONS.md",
    "TROUBLESHOOTING.md",
    "VALIDATION_TROUBLESHOOTING.md"
)

foreach ($file in $rootMdFiles) {
    if (Test-Path $file) {
        Write-Host "  Removing $file from git..." -ForegroundColor Yellow
        git rm --cached $file 2>$null
    }
}

# Remove .kiro folder
Write-Host "`nRemoving .kiro folder from git..." -ForegroundColor Yellow
git rm -r --cached .kiro 2>$null

# Remove backend .md files (except backend/README.md if you want to keep it)
Write-Host "`nRemoving backend model documentation..." -ForegroundColor Yellow
git rm --cached backend/models/MODEL_DOCUMENTATION.md 2>$null
git rm --cached backend/models/USAGE_EXAMPLES.md 2>$null

Write-Host "`n✅ Done! Files removed from git tracking but kept locally." -ForegroundColor Green
Write-Host "`nNext steps:" -ForegroundColor Cyan
Write-Host "1. Run: git status" -ForegroundColor White
Write-Host "2. Run: git commit -m 'Remove documentation files from tracking'" -ForegroundColor White
Write-Host "3. Run: git push origin main" -ForegroundColor White
