# Changelog

Формат — [Keep a Changelog](https://keepachangelog.com/ru/1.1.0/),
версии — [SemVer](https://semver.org/lang/ru/).

## [1.0.0] — 2026-11-11

Первый публичный релиз.

### Added

- Значок «Полный доступ» в слоте `sidebar.session.row.trailing` для сессий, у которых
  режим разрешений — `danger-full-access`.
- Глиф `PermissionIconFullAccessRegular` — тот же, что в выборе режима композера.
- Локали `ru`, `en`, `zh` с подписью `mark.label` для `aria-label` и `title`.
- Ячейка только читает проекцию `permissions.currentValue`, поэтому не удерживает и не
  активирует сессию.
- Пакет оформлен как самостоятельный bundle: `dsh.bundle.patch` + `dsh.client`
  (`platform: "web"`, `inject: ["@deepseek-ai/dsh-client-ui-workspace"]`).
