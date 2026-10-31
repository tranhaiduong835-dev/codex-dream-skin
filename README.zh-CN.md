# Codex Dream Skin（Windows）

### 给 Codex 桌面端换一张会呼吸的脸

**一张图，一种心情。壁纸和装饰可以变，侧栏、项目选择、任务内容与输入框仍是原生可交互控件。**

[English](README.md) · [技能说明](SKILL.md) · [安全边界](SECURITY.md)

Codex Dream Skin 是面向微软商店版 `OpenAI.Codex` 的非官方 Windows 主题管理器与渲染器注入工具。PowerShell 脚本负责安装、启动、主题管理和恢复；Node.js 注入器通过仅限本机回环地址的 Chromium DevTools Protocol（CDP）加载 CSS 与 DOM 增强。C#/.NET 主题管理器源码位于 `windows/theme-manager/`。本项目不修改官方可执行文件、`WindowsApps`、`app.asar` 或代码签名，也不会改写模型供应商设置。

> **当前分支只是尚不完整的源码。** 安装脚本依赖尚未包含的 `windows/presets/preset-gothic-void-crusade/`、已发布的 `windows/assets/theme-manager/DreamSkin.ThemeManager.exe` 及其他生成的运行时资源；.NET 应用项目也缺少入口源码。因此下列命令说明的是**完整资源到位后的预期流程**，并非声称当前检出版本已可安装。本分支也没有完整的 Setup.exe 可下载。不要跳过缺件校验，也不要随意替换二进制文件。

## 系统要求

- Windows 10 或更新版本，x64；Windows PowerShell 5.1 或更新版本。
- 当前用户已安装并注册微软商店官方 `OpenAI.Codex`，可用 `Get-AppxPackage -Name OpenAI.Codex` 检查。
- 从源码使用时，`PATH` 中须有 Node.js 22 或更新版本。完整安装包才会内置固定版本的 Node 运行时。
- 构建原生主题管理器需要 .NET SDK 8 或更新版本；构建 Setup.exe 还需要 Inno Setup 6。
- 尝试源码安装前，必须补齐缺失的预设、管理器及生成资源。

## 安装

在仓库根目录打开 PowerShell，先完全退出 Codex 和 Dream Skin 托盘。待缺失资源恢复、管理器项目能正常构建后，按以下顺序执行：

```powershell
node .\tools\build-theme-manager.mjs
powershell.exe -NoProfile -ExecutionPolicy RemoteSigned -File .\windows\scripts\install-dream-skin.ps1
```

安装脚本会检查官方 Store 包与 Node 运行时，暂存受管理的引擎，保留外观设置，并建立启动、托盘和恢复快捷方式。当前仓库因缺少所需资源会失败；这不是安装成功。请勿使用 `ExecutionPolicy Bypass`、修改系统执行策略或接管 `WindowsApps` 权限。

## 启动、验证与恢复

从完整资源成功安装后，可使用“Codex Dream Skin”快捷方式，或从仓库根目录运行：

```powershell
powershell.exe -NoProfile -ExecutionPolicy RemoteSigned -File .\windows\scripts\start-dream-skin.ps1 -PromptRestart
powershell.exe -NoProfile -ExecutionPolicy RemoteSigned -File .\windows\scripts\verify-dream-skin.ps1 -ScreenshotPath "$env:TEMP\codex-dream-skin.png"
```

验证要求 Dream Skin 的 CDP 会话正在运行。请按[视觉与功能清单](tests/qa-inventory.md)检查截图、首页与普通任务页，并确认原生控件仍可点击。部分官方 Store 版本可能无法建立经验证的 CDP 监听端口；不要通过修改官方安装目录权限绕过限制。

使用“Codex Dream Skin - Restore”快捷方式，或运行以下命令关闭受管理调试会话并恢复已保存的外观键值：

```powershell
powershell.exe -NoProfile -ExecutionPolicy RemoteSigned -File .\windows\scripts\restore-dream-skin.ps1 -RestoreBaseTheme -PromptRestart
```

CDP 虽只绑定 `127.0.0.1`，但不提供同一用户身份认证。暂停主题不等于关闭调试端口；应完整恢复并重启，或退出 Codex 后从官方普通入口重新打开。详情见 [SECURITY.md](SECURITY.md)。

## 新目录结构

| 路径 | 用途 |
| --- | --- |
| `windows/scripts/` | 安装、启动、恢复、验证、托盘和 Windows 运行时脚本，以及 Node 注入器入口 |
| `windows/assets/` | CSS、渲染器注入脚本、主题 JSON、图片、图标和校验资源 |
| `windows/theme-manager/` | .NET 主题管理器项目与原生测试 |
| `windows/installer/` | Inno Setup 定义、引导和发行构建脚本 |
| `tools/` | Node 构建和诊断工具 |
| `tests/` | Node/PowerShell 检查与 QA 记录 |

另见 [Windows 简明指南](windows/README.md)与 [SKILL.md](SKILL.md) 中的 Agent 工作流和安全规则。

## 检查

在仓库根目录执行：

```powershell
node --check .\windows\scripts\injector.mjs
node --check .\windows\assets\renderer-inject.js
powershell.exe -NoProfile -ExecutionPolicy RemoteSigned -File .\tests\run-tests.ps1
```

完整 PowerShell 测试目前会因缺少 `windows/presets/` 停止，不能报告为通过。.NET 测试需要 SDK 和完整项目源码；在补齐输入并验证前，不应宣称构建或安装成功。

许可见 [LICENSE](LICENSE)。Codex 及相关标识归其权利人所有，本项目并非 OpenAI 官方产品。
