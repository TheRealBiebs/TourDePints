STICKER IMAGE DIRECTORY
=======================
Drop PNG files here, then reference them in the sticker walls
inside index.html and event.html.

HOW TO USE
----------
Place your PNG in this folder, then add a line like this inside
the <div class="sticker-wall"> block in index.html or event.html:

  <img class="sticker-img"
       src="images/stickers/my-brewery.png"
       alt="My Brewery Name"
       style="top:15%;left:2%;transform:rotate(-8deg);width:100px;">

Adjust top/left/right/transform to position the sticker wherever
you want on the hero. Use "right:X%" instead of "left:X%" for the
right side of the hero.

PNG TIPS
--------
- Use a transparent background so the sticker shape comes through
- Recommended size: 300–600px wide (browser will scale it down)
- Round stickers, rectangle stickers, die-cut shapes — all work
- The CSS adds a drop-shadow that follows the PNG's alpha channel,
  so even oddly-shaped stickers look like they're peeling off the wall
- Avoid very thin strokes or tiny text — they get lost when scaled down

EXAMPLE STICKER SIZES IN THE HTML
----------------------------------
  width:80px   — small sticker (good for small circles / badges)
  width:100px  — medium (default recommendation)
  width:120px  — large rectangle or wide logo sticker
  width:140px  — oversized feature sticker

ROTATION SUGGESTIONS
--------------------
  Slight tilt:    rotate(±3deg  to ±8deg)   — natural, stuck-on look
  Medium tilt:    rotate(±9deg  to ±15deg)  — more casual / drunk
  Heavy tilt:     rotate(±16deg to ±25deg)  — really falling off the wall
