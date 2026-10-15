# Shopify design-to-theme workflow

Use this when the user gives a design (screenshots, images, Figma export) and asks to "design", "build" or "code" it in a Shopify theme.

## Folder setup (expected)
- `<theme-folder>/`: Shopify theme pulled with `shopify theme pull`
- `designs/`: design images (desktop, mobile, ideally one image per section too)

If either is missing, ask for it before starting.

## Step 1: Look before asking
1. Read the theme: `layout/theme.liquid`, `config/settings_schema.json`, `config/settings_data.json`, main CSS. Note brand colours, fonts, button style, spacing, existing header/footer, installed app embeds (cart drawer, reviews, chat, popups).
2. Read every design image. For very tall images, crop into sections first (large images are downscaled when read, so small text is lost).
3. Write a short list of the sections you see in the design.

## Step 2: Ask the user (one message, all questions together)
1. **Style source**
   - A) Theme style: use the theme's colours, fonts and patterns
   - B) Screenshot style: copy the design exactly
   - C) Mixed (recommended): layout from the screenshot, colours/fonts/buttons from the theme
   Give concrete examples, e.g. "theme uses navy #001e37 + Poppins; design uses a serif font".
2. **Where it goes:** new page template, replace the homepage, or a section only?
3. **Links:** real links now, or `#` placeholders?
4. **Images:** theme/store images, or will the user provide new ones?
5. **Mobile:** is there a mobile design, or should Claude design the mobile view?
6. **Section plan:** show the list of sections and what will be editable in the theme editor. Wait for a yes.

Do not start coding until these are answered.

## Step 3: Safety before coding
- `git init` + commit the original theme if it is not already a repo.
- Work only on a **development or unpublished theme**. Never push to the live (published) theme.
- When replacing an existing template (e.g. homepage), first copy it to a backup alternate template (e.g. `templates/index.old-home.json`, viewable with `?view=old-home`).

## Step 4: Build rules
- One Shopify section per design block, each with a `{% schema %}` (settings + blocks + presets) so the client can edit text, images and links in the theme editor.
- Put all styles in one prefixed CSS file (e.g. `assets/<prefix>-home.css`) with a class prefix to avoid clashing with theme CSS. Use a `:where()` reset so the theme's styles don't override component classes.
- Real text, never text painted inside images.
- Images: `image_url` + `image_tag` with `widths` and `sizes`; first image `loading: 'eager'`, the rest lazy. Always set alt text.
- Reuse theme features instead of rebuilding them (cart drawer, cart count, product forms, apps).
- Liquid gotchas:
  - No filters inside `image_tag` arguments; `assign` first.
  - No literal `{{` inside `<script>` strings.
- Mobile first: tap targets at least 44px, no horizontal scroll, readable text (16px body).
- Run `shopify theme check` and fix errors.
- Push with `shopify theme push --theme <dev-theme-id> --nodelete --only <files>`.

## Step 5: Test with Playwright (always, after building)
Test on the preview URL (`?preview_theme_id=<id>`) at **375px (phone), 768px (tablet), 1440px (desktop)**.

Hide the Shopify preview bar (`#PBarNextFrameWrapper`) during tests.

Checklist:
- [ ] Screenshot of each width, placed **side by side with the design image**
- [ ] No horizontal scroll at any width
- [ ] No broken images (`naturalWidth === 0`)
- [ ] No console errors from our code (list third-party ones separately)
- [ ] Tap targets ≥ 44px on mobile
- [ ] Add to cart, cart drawer, menu and any interactive parts work
- [ ] Sticky elements don't cover buttons (chat widgets, popups, push prompts)
- [ ] Content matches the user's request (sections, text, order)

Fix anything that fails, then test again.

## Step 6: Report to the user
Plain, non-technical language:
- Preview link(s), plus the backup link if a template was replaced
- What matches the design, and what differs and why
- What still needs the user (links, images, copy)
- How to revert, and how to publish (`shopify theme push --unpublished` → check → publish in Online Store → Themes)

Then ask for feedback **section by section** and iterate.
