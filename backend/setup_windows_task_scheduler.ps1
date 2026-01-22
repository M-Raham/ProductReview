# PowerShell script to set up Windows Task Scheduler for automatic review generation
# Run this script as Administrator

# Task details
$taskName = "ProductReview-AutoReviewGeneration"
$taskDescription = "Generate product reviews automatically every minute"
$scriptPath = "d:\ProductReview\backend\run_reviews.bat"
$workingDirectory = "d:\ProductReview\backend"

# Remove existing task if it exists
Get-ScheduledTask -TaskName $taskName -ErrorAction SilentlyContinue | Unregister-ScheduledTask -Confirm:$false

# Create the scheduled task action
$action = New-ScheduledTaskAction -Execute "cmd.exe" -Argument "/c `"$scriptPath`"" -WorkingDirectory $workingDirectory

# Create the trigger (every minute)
$trigger = New-ScheduledTaskTrigger -Once -At (Get-Date) -RepetitionInterval (New-TimeSpan -Minutes 1)

# Create the settings
$settings = New-ScheduledTaskSettingsSet -StartWhenAvailable -DontStopOnIdleEnd -AllowStartIfOnBatteries -DontStopIfGoingOnBatteries

# Register the scheduled task
Register-ScheduledTask -TaskName $taskName -Description $taskDescription -Action $action -Trigger $trigger -Settings $settings -RunLevel Highest

Write-Host "✅ Task '$taskName' created successfully!"
Write-Host "📋 Task will run every minute"
Write-Host "🔧 To view the task: Get-ScheduledTask -TaskName '$taskName'"
Write-Host "🗑️  To remove the task: Unregister-ScheduledTask -TaskName '$taskName' -Confirm:`$false"
Write-Host "▶️  To run manually: Start-ScheduledTask -TaskName '$taskName'"
