# «НОЛЬ» — Production Specification V2

Статус: **утверждено для production**.

## 1. Приоритет источников

При конфликте требований применяется следующий порядок:

1. четыре production-уточнения пользователя от 29.07.2026;
2. утверждённые постеры `design/concepts-v2/01–10`;
3. точный контент и функциональные требования исходного ТЗ;
4. `VISUAL_BLUEPRINT_V2.md` и `ART_DIRECTION_V2.md`;
5. V1 используется только как отвергнутый baseline и не смешивается с production.

Новые секции и новые арт-директорские концепции запрещены. Разделение Legal / Price является утверждённым production-уточнением, а не новой секцией по инициативе реализации.

## 2. Утверждённый порядок главной страницы

1. Header
2. Hero
3. Problem
4. Brand Turn / «Что такое НОЛЬ»
5. Diagnostic
6. Process
7. Legal Clarity
8. Price
9. Media
10. Manifesto / Launch mode / Team credits
11. Final Threshold
12. Footer

Отдельный FAQ на главной не создаётся: его юридические вопросы входят в Legal Clarity. Социальное доказательство и команда входят в Manifesto / Credits.

## 3. Design tokens

### Цвет

| Token | Значение | Роль |
|---|---|---|
| `--black` | `#050505` | Hero, глубокий foreground |
| `--graphite` | `#101010` | Header после скролла, media |
| `--surface-dark` | `#161616` | Dialog и функциональные тёмные слои |
| `--surface-light` | `#EFEFED` | Диагностика, переходные поверхности |
| `--white` | `#F7F7F5` | Светлые секции и текст на тёмном |
| `--muted-dark` | `#8C8C88` | Вторичный текст на светлом |
| `--muted-light` | `#B8B8B2` | Вторичный текст на тёмном |
| `--accent-red` | `#E32219` | Один активный сигнал в viewport |
| `--warm-light` | `#E9D3AE` | Только естественный свет финала |
| `--border-dark` | `rgba(255,255,255,.12)` | Разделители на тёмном |
| `--border-light` | `rgba(0,0,0,.12)` | Разделители на светлом |

Красный не используется как площадь заливки CTA.

### Типографика

| Роль | Desktop | Laptop | Mobile |
|---|---|---|---|
| Display H1 | `clamp(64px, 7.1vw, 108px)` / `550–600` / `.96` | `clamp(58px, 7vw, 84px)` | `clamp(42px, 12vw, 56px)` |
| Display H2 | `clamp(48px, 5vw, 72px)` / `550–600` / `1.02` | `48–64px` | `34–44px` |
| H3 | `28–40px` / `550–600` | `28–36px` | `27–32px` |
| Lead | `22–26px` / `450–500` / `1.42` | `20–24px` | `19–22px` |
| Body | `18–22px` / `400–450` / `1.55` | `18–20px` | `17–19px` |
| UI | `16–18px` / `550–600` | `16–17px` | `16–17px` |
| Mono | `12–14px` / `450–500` / `1.35` | `12–13px` | `12–13px` |

- Manrope — интерфейс и контент.
- IBM Plex Mono — индексы, статусы и номера.
- Связный текст не разбивается искусственными `<br>`.
- Manifesto на `900–1200px` переносится максимум на две строки.
- На mobile применяется отдельная вертикальная композиция.

### Сетка

- Максимальная ширина: `1440px`.
- Wide desktop: 12 колонок, gutter `72px`, gap `24px`.
- Desktop: 12 колонок, gutter `48px`, gap `24px`.
- Laptop/tablet: 8 колонок, gutter `32px`, gap `20px`.
- Mobile: 4 колонки, gutter `20px`, gap `16px`.
- Текстовый measure: `620–720px`.
- Section rhythm: `120–220px` desktop, `96–160px` laptop, `80–120px` mobile.
- Header: `72px` desktop, `64px` mobile.

### Spacing

`4, 8, 12, 16, 24, 32, 48, 64, 88, 120, 176, 220`.

### Геометрия контролов

- Touch target: минимум `48×48px`.
- Primary action: editorial route/link, а не красная заливка.
- Radius: `0` для секций, индексов, строк и маршрутов; `12px` для полей; `16px` для dialog.
- Focus: `2px solid #E32219`, offset `3px`.
- Hairline: `1px`.

## 4. Responsive rules

### Wide desktop: `>= 1200px`

- Композиции соответствуют постерам V2.
- Полноэкранные секции имеют минимальную высоту `900px` или `100svh`.
- Максимальная ширина контента `1440px`.

### Laptop: `900–1199px`

- Сетка сокращается до 8 колонок.
- Hero сохраняет горизонт; портал уменьшается, но остаётся справа от смыслового центра.
- Manifesto — не более двух строк.
- Process сохраняет один доминирующий порог; крайние этапы становятся координатами.
- Legal index сужается, ответ остаётся отдельной маргиналией.

### Tablet: `600–899px`

- Полноэкранная высота заменяется `min-height`, если контент требует больше места.
- Legal index становится горизонтальным scrollable index без scroll hijacking.
- Price строится вертикально, но без карточки.
- Media contact strip остаётся боковой плёнкой либо уходит под постер как один ряд.

### Mobile: `< 600px`

- Система следует `10-mobile-poster-system.png`.
- 3D не загружается; используется prerendered AVIF/WebP.
- Один red signal на viewport.
- Отсутствует горизонтальный overflow.
- Process — вертикальный маршрут.
- Legal index — компактный список вопросов над активным ответом.
- Manifesto — отдельный вертикальный плакат; роли идут титрами.
- Footer — одна последовательная архивная лента с переносами по смысловым группам.

## 5. Четыре production-уточнения

### Diagnostic

- «02» — фоновый номер, `aria-hidden`.
- Вопрос — главный смысловой объект и первый heading внутри шага.
- Ответы получают вертикальный padding `24–30px` desktop и `20–24px` mobile.
- Активный ответ — одна красная точка плюс текстовый/семантический `checked`.
- «Назад» и «Продолжить» имеют явные hover/focus/disabled states.
- Никаких карточек, больших rounded buttons или дополнительного progress bar.
- Desktop и mobile используют один type hierarchy.

### Legal Clarity

- Отдельный viewport.
- Большой активный вопрос.
- Боковой индекс вопросов.
- Краткий нейтральный ответ.
- Постоянная юридическая оговорка.
- Редактируемый content layer.

### Price

- Отдельный следующий viewport.
- Точная строка: «Полное сопровождение — от 300 000 ₽».
- Состав услуги — колофонные строки, не список в карточке.
- Объяснение зависимости и фиксации цены после анализа.
- CTA: «Обсудить мою ситуацию».
- Цена и юридический вопрос никогда не видны в одном viewport.

### Zero Portal

- Свет и частицы доминируют над геометрией.
- Мягкий горизонт, отражение, дымка.
- Медленное дыхание, минимальная реакция на курсор.
- Нет постоянного демонстративного вращения и чрезмерного bloom.
- Desktop: R3F points/instancing, ограниченный DPR и adaptive particle count.
- Mobile: prerendered asset.
- `prefers-reduced-motion`: static fallback.
- Сцена не перехватывает pointer events и приостанавливается вне viewport.

## 6. Motion map

| Секция | Единственное допустимое движение | Reduced motion |
|---|---|---|
| Header | Смена прозрачности/фона после hero | Мгновенное состояние |
| Hero | Горизонт → сборка света → текст, `<=1.8s` | Статичный fallback |
| Problem | Однократное включение проекции / телефона | Статично |
| Brand Turn | CSS mask раскрывает светлый лист | Финальное состояние |
| Diagnostic | Переход шага и puncture radio | Без transform |
| Process | Свет переходит к активному порогу | Статичный активный этап |
| Legal | Смена вопроса и маргиналии | Мгновенно |
| Price | Однократное проявление колофона | Статично |
| Media | Включение проектора; плёнка сдвигается на кадр | Статично |
| Manifesto | Нет reveal по строкам | Статично |
| Final | Parallax до `16px`, рост luminance | Статично |

## 7. Component inventory

### Layout

- `SiteHeader`
- `MobileMenu`
- `SiteFooter`
- `SectionFrame`
- `SkipLink`
- `PageTransition`

### Brand / UI

- `ZeroMark`
- `RedSignal`
- `ActionLink`
- `ArrowIcon`
- `PlayIcon`
- `Field`
- `FormMessage`
- `Dialog`

### Home sections

- `HeroSection`
- `ZeroPortalScene`
- `ZeroPortalFallback`
- `ProblemSection`
- `ObservationRail`
- `BrandTurnSection`
- `ZeroStateTrace`
- `DiagnosticSection`
- `ProcessSection`
- `LegalClaritySection`
- `PriceSection`
- `MediaSection`
- `ManifestoCreditsSection`
- `FinalThresholdSection`

### Interactive features

- `DiagnosticFlow`
- `DiagnosticQuestion`
- `DiagnosticResultForm`
- `PhoneField`
- `ConsentField`
- `ProcessStageController`
- `LegalQuestionIndex`
- `MediaTeaserDialog`
- `PremiereForm`

### Server / infrastructure

- `POST /api/leads`
- Zod server schema
- in-memory development rate limiter
- honeypot and duplicate-submit guard
- lead adapter interface with development adapter
- analytics adapter
- typed content/config layer

## 8. Production asset inventory

Нельзя использовать цельные UI-постеры как фон. Нужны отдельные чистые ассеты без интерфейсного текста:

| Asset | Source of truth | Output |
|---|---|---|
| Hero portal fallback desktop | V2 01 | AVIF/WebP 16:10 |
| Hero portal fallback mobile | V2 10 left | AVIF/WebP portrait |
| Problem documentary scene | V2 02 | AVIF/WebP 16:9 |
| Brand fold / threshold | V2 03 | AVIF/WebP 16:9 |
| Process threshold scene | V2 05 | AVIF/WebP 16:9 |
| Media empty-chair studio | V2 07 | AVIF/WebP 16:9 |
| Three media contact frames | V2 07 | AVIF/WebP portrait fragments |
| Final cave-to-dawn scene | V2 09 | AVIF/WebP 16:9 + portrait |
| Open Graph image | V2 system | `1200×630` |

Все UI-тексты, кнопки, вопросы, цена, титры и подписи набираются кодом.

## 9. Маршруты

- `/`
- `/diagnostic`
- `/how-it-works`
- `/stories`
- `/media`
- `/about`
- `/contacts`
- `/privacy`
- `/personal-data-consent`
- `/terms`
- `/legal`
- framework `not-found`

Дополнительные маршруты используют ту же систему, но не добавляют секции на главную.

## 10. Screenshot gate

Для каждой секции:

1. реализовать только текущую секцию и необходимый общий shell;
2. открыть её в Browser/IAB;
3. сделать screenshot на нативной ширине соответствующего постера;
4. открыть concept и screenshot через `view_image`;
5. записать минимум пять сравнений: композиция, copy, typography, palette, spacing/assets;
6. исправить расхождения;
7. проверить mobile;
8. только после этого переходить к следующей секции.

Fidelity ledger хранится в `design/FIDELITY_LEDGER.md`.

## 11. Allowed above-the-fold copy

- `НОЛЬ`
- `Как это работает`
- `Истории`
- `Медиа`
- `Вопросы`
- `О нас`
- `Оценить ситуацию`
- `Вы больше не обязаны жить в режиме выживания.`
- `«НОЛЬ» помогает спокойно разобраться в долговой ситуации, оценить риски и пройти законную процедуру банкротства, если она действительно вам подходит.`
- `Посмотреть возможный выход`
- `Как работает процедура`
- `Конфиденциально. Без давления. Сначала — анализ ситуации.`

Новые eyebrow, badges, proof chips и поясняющие labels запрещены.

## 12. Definition of done

- Все section gates закрыты на desktop и mobile.
- Нет смешения с V1.
- Нет типовых карточных замен.
- Все интерактивные элементы работают с клавиатуры.
- Формы проходят client/server validation.
- Lead endpoint защищён базовым rate limit и honeypot.
- Все маршруты и 404 доступны.
- `lint`, `typecheck`, `build`, Playwright smoke проходят.
- Console не содержит релевантных ошибок.
- `prefers-reduced-motion` и mobile fallback проверены.
- Финальный screenshot сравнён с каждым V2-постером.
