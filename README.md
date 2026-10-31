# Codex Dream Skin (Windows)

[简体中文](README.zh-CN.md) · [Agent skill](SKILL.md) · [Security boundary](SECURITY.md)

Codex Dream Skin is an unofficial Windows theme manager and renderer injector for the Microsoft Store `OpenAI.Codex` desktop app. PowerShell manages installation, launch, themes, and recovery; a Node.js injector applies CSS and DOM enhancements through a local Chromium DevTools Protocol (CDP) session. The native sidebar, project picker, task content, and composer remain interactive. The project does not modify the official executable, `WindowsApps`, `app.asar`, or the app signature.

The native C#/.NET theme-manager source is in `windows/theme-manager/`. The tray and scripts manage the installed runtime under `%LOCALAPPDATA%\CodexDreamSkin`.

> **Current checkout is source-only and incomplete.** The install script expects `windows/presets/preset-gothic-void-crusade/`, a published `windows/assets/theme-manager/DreamSkin.ThemeManager.exe`, and other generated runtime inputs that are not present in this branch. The .NET app project also lacks an entry-point source file. Consequently, the build/install commands below describe the intended workflow, **not a verified installation from this checkout**. Do not bypass the missing-input checks or substitute arbitrary binaries. No complete Setup.exe is published by this fork here.

## Requirements

- Windows 10 or newer, x64; Windows PowerShell 5.1 or newer.
- The official Microsoft Store `OpenAI.Codex` package installed and registered for the current user. Check with `Get-AppxPackage -Name OpenAI.Codex`.
- Node.js 22 or newer on `PATH` for source-based use. A complete packaged installer would bundle its pinned Node runtime.
- .NET SDK 8 or newer only to build the native manager; Inno Setup 6 only to build a Setup.exe.
- A complete set of the missing preset, manager, and generated runtime assets before attempting source installation.

## Install from source

Run commands from the repository root in PowerShell. Close Codex and exit any Dream Skin tray process first. Once the missing source/release inputs have been restored and the manager project builds, publish the manager and run the installer:

```powershell
node .\tools\build-theme-manager.mjs
powershell.exe -NoProfile -ExecutionPolicy RemoteSigned -File .\windows\scripts\install-dream-skin.ps1
```

The installer checks the Store package and Node runtime, stages the managed engine, preserves appearance settings, and creates launch, tray, and restore shortcuts. It fails if required runtime assets are absent; this is the expected result for the current incomplete checkout. Do not run PowerShell with `ExecutionPolicy Bypass`, change system policy, or take ownership of `WindowsApps`.

## Launch, verify, and restore

After a successful installation from a complete build, use the **Codex Dream Skin** shortcut or run:

```powershell
powershell.exe -NoProfile -ExecutionPolicy RemoteSigned -File .\windows\scripts\start-dream-skin.ps1 -PromptRestart
powershell.exe -NoProfile -ExecutionPolicy RemoteSigned -File .\windows\scripts\verify-dream-skin.ps1 -ScreenshotPath "$env:TEMP\codex-dream-skin.png"
```

Verification needs a running Dream Skin CDP session. Inspect the screenshot and the interactive home/task views using [the QA checklist](tests/qa-inventory.md). An affected Store build may refuse a verified CDP listener; do not change official package permissions to work around it.

To close the managed debug session and restore the saved appearance keys, use the **Codex Dream Skin - Restore** shortcut or:

```powershell
powershell.exe -NoProfile -ExecutionPolicy RemoteSigned -File .\windows\scripts\restore-dream-skin.ps1 -RestoreBaseTheme -PromptRestart
```

CDP binds to loopback, but it has no same-user authentication. Pausing the skin does not close the debug listener; fully restore/restart or quit Codex and reopen it normally. See [SECURITY.md](SECURITY.md).

## Repository layout

| Path | Purpose |
| --- | --- |
| `windows/scripts/` | PowerShell install, launch, restore, verification, tray, and Windows runtime helpers; Node injector entry point |
| `windows/assets/` | CSS, renderer injection, theme JSON, images, icon, and validation assets |
| `windows/theme-manager/` | .NET manager projects and native tests |
| `windows/installer/` | Inno Setup definition, bootstrap, and release-build scripts |
| `tools/` | Node build and diagnostic tools |
| `tests/` | Node/PowerShell checks and QA notes |

See the [short Windows guide](windows/README.md) and [SKILL.md](SKILL.md) for the agent workflow and safety rules. The older [README.en.md](README.en.md) is kept as an English-language entry link.

## Checks

From the repository root:

```powershell
node --check .\windows\scripts\injector.mjs
node --check .\windows\assets\renderer-inject.js
powershell.exe -NoProfile -ExecutionPolicy RemoteSigned -File .\tests\run-tests.ps1
```

The full PowerShell runner currently stops on the missing `windows/presets/` directory; this is a known repository-input gap, not a passing test run. The .NET manager tests require the SDK and complete project sources. Do not report a successful build or installation until those inputs and the runtime checks are verified.

Licensed under [LICENSE](LICENSE). Codex and related marks belong to their owners; this is not an OpenAI product.
