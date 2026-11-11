# dsh-session-full-access-badge

[![release](https://img.shields.io/github/v/release/VladikDragon/dsh-session-full-access-badge?label=release)](https://github.com/VladikDragon/dsh-session-full-access-badge/releases)
[![license](https://img.shields.io/github/license/VladikDragon/dsh-session-full-access-badge)](LICENSE)

Значок **«Полный доступ»** рядом со временем обновления в списке сессий боковой панели
DeepSeek Harness.

> *English summary: a small DeepSeek Harness web plugin that marks every sidebar session
> row running under the `danger-full-access` permission preset with the same shield glyph
> the composer's permission picker uses.*

## Что делает

Для каждой сессии, у которой текущий режим разрешений — «Полный доступ»
(`danger-full-access`), рядом со временем обновления показывается тот же щит со знаком
«!», что и в выборе режима в композере.

Значок:

- не кликается, не открывает и не удерживает сессию — он только читает проекцию
  `permissions.currentValue` из уже загруженного списка;
- скрывается вместе с остальными иконками строки, когда на строку наведён курсор или у
  неё открыто меню (так ведёт себя сам слот);
- подписан в трёх локалях: `ru`, `en`, `zh`.

## Установка

Плагин ставится в профиль как обычный пакет:

```
dsh plugin --profile desktop add github:VladikDragon/dsh-session-full-access-badge
```

После установки добавьте его в `dsh.profile.bundles` профиля — через менеджер плагинов
или вручную в `~/.dsh/profiles/<профиль>/package.json`:

```json
"dsh": {
  "profile": {
    "bundles": ["@deepseek-ai/dsh-base", "@deepseek-ai/dsh-web-app", "dsh-session-full-access-badge"]
  }
}
```

Локальная разработка — из клона:

```
git clone https://github.com/VladikDragon/dsh-session-full-access-badge
dsh plugin --profile desktop add file:C:/path/to/dsh-session-full-access-badge
```

Перезапуск приложения нужен только при добавлении нового **пакета**. Правки уже
подключённого плагина подхватываются выключением и включением его строки в менеджере
плагинов.

## Как это работает

```
package.json        манифест: dsh.bundle.patch + dsh.client (platform web)
cordis.patch.yml    одна строка Loader с id session-full-access-badge
index.js            host-половина: пустой apply(), нужен только чтобы у плагина
                    была строка на стороне хоста
client.js           браузерный бандл: регистрирует ячейку в слоте
                    sidebar.session.row.trailing
```

Клиентская половина объявляется в `package.json`:

```json
"dsh": {
  "client": {
    "platform": "web",
    "immediately": true,
    "inject": ["@deepseek-ai/dsh-client-ui-workspace"]
  }
}
```

`inject` обязателен: слот `sidebar.session.row.trailing` объявляет `ui-workspace`, и без
этой зависимости регистрация пришлась бы на слот, которого ещё нет.

### Слот

`sidebar.session.row.trailing` — список неинтерактивных иконок после времени строки и до
маркера закрепления, сортировка по `order`. Плагин занимает его ячейкой
`full-access-mark` с `order: 10`.

Владелец слота передаёт в ячейку `sessionId`, остальные хуки (`useSessions` и прочие)
приходят стандартными пропсами. Плагин подписывается только на своё значение:

```js
const preset = useSessions(
  (state) => state.byId[sessionId]?.projectionValues?.permissions?.currentValue,
)
```

### Глиф

`PermissionIconFullAccessRegular` из `@deepseek-ai/dsh-client-ui-primitives` — тот же,
что рисует выбор режима в композере, поэтому значок выглядит знакомым. Ячейка 16×20 px,
глиф 14 px, цвет — токен `--dsw-alias-label-secondary`.

## Локаль

Словари лежат прямо в `client.js` и регистрируются в namespace `sessionFullAccessBadge`:

```js
ctx.locale.register('sessionFullAccessBadge', DICTIONARIES)
```

Ключ один — `mark.label`. Он уходит и в `aria-label`, и в `title`, поэтому значок
читается скринридером.

## Ограничения

- Только веб-клиент (`platform: "web"`); в TUI значка нет.
- Значок показывает **текущий** режим сессии: смена режима в композере обновляет строку
  без перезагрузки, потому что значение читается из проекции, а не из снимка.
- Плагин ничего не пишет и не вызывает RPC — это чистая презентация.

## Разработка

Сборки нет: `client.js` — обычный скрипт, который загружается загрузчиком модулей хоста
и получает `react` и примитивы через `require`. Правки применяются перезапуском
приложения.

Проверить, что слот существует и ячейка зарегистрирована, можно инспектором слотов
(`Slots` → `listSubTree` с корнем `sidebar.session.row.trailing`).

## Лицензия

MIT — см. [LICENSE](LICENSE).
