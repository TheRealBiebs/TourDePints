// ─────────────────────────────────────────────────────────────────────────────
//  SUPABASE CONFIGURATION
//  See SETUP.md for step-by-step instructions.
//
//  1. Go to https://supabase.com → create a free account + project
//  2. Project Settings → API → copy "Project URL" and "anon / public" key
//  3. Paste them below
// ─────────────────────────────────────────────────────────────────────────────
const SUPABASE_URL      = "https://tmqarlsaokfzalduezdf.supabase.co";   // e.g. "https://abcxyz.supabase.co"
const SUPABASE_ANON_KEY = "sb_publishable_DAtMk7ZAzJRnkLsHygfF2Q_NuGxqlel";   // your anon/public API key


// ─────────────────────────────────────────────────────────────────────────────
//  SITE-WIDE SETTINGS
//  Events are now managed in the Supabase database (see admin.html).
//  Only edit this file when you want to change global site settings.
// ─────────────────────────────────────────────────────────────────────────────
// ─────────────────────────────────────────────────────────────────────────────
//  LIABILITY WAIVER TEXT
//  This text is shown to participants before they can complete registration.
//  Replace the placeholder paragraphs below with your actual waiver language.
// ─────────────────────────────────────────────────────────────────────────────
const WAIVER_TEXT = `
<h3>Tour de Pints — Waiver and Release of All Claims and Suits and Assumption of Risks</h3>

<p>This form must be signed by each rider before the rider begins today's Tour (the "Tour"). No rider may participate without a completed form. Read this Release carefully before you sign it. Your signature indicates your understanding of the Release and agreement to its terms.</p>

<p>On behalf of myself, my personal representatives, heirs, executors, administrators next of kin and/or spouse, I HEREBY:</p>

<ol>
  <li><p>Agree that I will read the Tour description and the rules of participation in the Tour and I will abide by all rules and regulations established by the Tour organizers and personnel (the "Sponsors"). I agree to adhere to all Tour rules, follow bicycle safety rules of the road and conduct myself in a safe and prudent manner while participating in the event.</p></li>

  <li><p>Understand there are risks inherent with bike riding on public streets in an urban environment. I understand that the Tour takes place on urban streets, which present special hazards different from those encountered in non-urban areas, including, but not limited to, potholes, construction and speed bumps, and I understand that the terrain may change, without warning, and requires special attention by me. I understand that the Tour will occur on urban roads with heavy traffic containing cars, bikes and pedestrians. I also understand that there will be a large number of cyclists, some of whom are inexperienced, creating further hazards. I am voluntarily participating in the Tour with knowledge of the hazards involved. I understand that it is ultimately my responsibility to keep a proper lookout for these risks. I have been warned of and understand these risks and do not require additional warning(s) by the Sponsors.</p></li>

  <li><p>Agree and accept full responsibility for complying with Washington law regarding consumption of alcohol, and if consuming alcohol, monitoring and/or limiting my alcoholic beverage intake. I specifically understand and agree that alcohol consumption is neither required nor advised during this event and that any alcohol consumption by me is my sole, and own voluntary act. I agree it is my sole responsibility to decide whether to consume alcohol and to do so in moderation and in a way that will not impair my bike riding or judgment.</p></li>

  <li><p>Assert that I am physically capable of participating in the Tour and the equipment I will use will be in proper working condition. I acknowledge that I am solely responsible for my personal health and safety and equipment as well as the personal property I bring with me. I understand that I am responsible for my own health and if, for some reason, I am having difficulty continuing with the Tour, I am solely responsible for making the determination either to stop or continue on with the Tour and do not rely upon the Sponsors to make that determination for me. I agree to wear a helmet at all times while riding a bike during the Tour.</p></li>

  <li><p>Voluntarily assume the risk and danger of injury or death inherent in the use of the bike, equipment and/or relating to my participation in the Tour.</p></li>

  <li><p>RELEASE, DISCHARGE AND/OR PROMISE NOT TO SUE and hold harmless any of the Sponsors, including Seattle Beer Week and The Cycling Certified Cicerone, for any loss, liability, damage, claim, lawsuit, or cost whatsoever for any loss, damage or injury (including death) to my person or property arising out of or relating to my participation in the Tour.</p></li>

  <li><p>Expressly agree that the Release is governed by the State of Washington and is intended to be as broad and inclusive as is permitted by Washington law. In the event that any portion of the Release is determined to be invalid, illegal or unenforceable, the validity, legality and enforceability of the remainder of the Release shall be severed from that portion determined to be invalid, illegal, or unenforceable, and shall not be affected or impaired in any way and shall continue in full legal force and effect.</p></li>

  <li><p>Agree and acknowledge that if I decide to leave the route, I am technically off the ride after that and on my own in regard to my safety.</p></li>
</ol>

<p><strong>I HAVE READ THIS RELEASE. I UNDERSTAND IT IS A PROMISE NOT TO SUE AND A RELEASE OF ALL CLAIMS.</strong></p>

<p><strong>WARNING:</strong> By signing this Release, you are giving up certain legal rights, including the right to recover damages in the case of injury, death or property damage.</p>
`;

const SITE = {
  name:        "Seattle Tour De Pints",
  tagline:     "Seattle's Biggest Bike and Brew",
  contactEmail:"andrew@cyclingcicerone.com",   // ← update this

};
