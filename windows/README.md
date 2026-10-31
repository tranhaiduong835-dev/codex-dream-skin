# Windows quick guide

Run these commands in PowerShell from the [repository root](../README.md), not from `windows/`.

The source install is currently **blocked by missing release inputs**: `windows/presets/preset-gothic-void-crusade/`, a complete .NET manager app project, and its published `windows/assets/theme-manager/DreamSkin.ThemeManager.exe`. Do not use the install commands until those inputs are restored and verified.

```powershell
node .\tools\build-theme-manager.mjs
powershell.exe -NoProfile -ExecutionPolicy RemoteSigned -File .\windows\scripts\install-dream-skin.ps1
powershell.exe -NoProfile -ExecutionPolicy RemoteSigned -File .\windows\scripts\start-dream-skin.ps1 -PromptRestart
powershell.exe -NoProfile -ExecutionPolicy RemoteSigned -File .\windows\scripts\verify-dream-skin.ps1 -ScreenshotPath "$env:TEMP\codex-dream-skin.png"
powershell.exe -NoProfile -ExecutionPolicy RemoteSigned -File .\windows\scripts\restore-dream-skin.ps1 -RestoreBaseTheme -PromptRestart
```

The installer requires the official Store `OpenAI.Codex`, Node.js 22+, and a complete asset set. The .NET manager build requires SDK 8+. CDP is loopback-only but unauthenticated to other local processes; a full restore/restart closes that exposure. Never modify `WindowsApps` or `app.asar`. See [the English guide](../README.md), [中文说明](../README.zh-CN.md), [the agent skill](../SKILL.md), and [security notes](../SECURITY.md).
