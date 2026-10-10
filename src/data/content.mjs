import { site, money } from '../config.mjs';

// Buying guides, blog posts and FAQs. Bodies are HTML strings.
// Blog dates are placeholders: set them to the real publish date.

export const guides = [
  {
    slug: 'choosing-a-racket',
    title: 'Choosing a badminton racket',
    summary: 'Weight, balance, shaft flex and grip size, and which combination suits your game.',
    photo: 'Guide: rackets side by side showing different head shapes',
    body: `
<p>Four things decide how a racket plays: weight, balance, shaft flex and grip size. Price mostly buys better materials and tighter manufacturing tolerances, not a different kind of racket.</p>

<h2 id="codes">Weight codes</h2>
<p>Most brands use a U number for the unstrung frame weight. The higher the number, the lighter the frame.</p>
<table class="spec">
<thead><tr><th>Code</th><th>Unstrung weight</th><th>Who it suits</th></tr></thead>
<tbody>
<tr><td>2U</td><td>90–94g</td><td>Rare now. Strong singles players.</td></tr>
<tr><td>3U</td><td>85–89g</td><td>Stronger players wanting more stability and power.</td></tr>
<tr><td>4U</td><td>80–84g</td><td>The most common weight. Suits most adult players.</td></tr>
<tr><td>5U</td><td>75–79g</td><td>Juniors, newer players, and anyone wanting a fast, light racket.</td></tr>
</tbody></table>
<p>Grip sizes follow a G number. In the UK the usual sizes are G5 (thinner) and G6 (thinnest) for Yonex, and G5 for most Victor and Li-Ning frames. You can build a grip up with an overgrip but you cannot make it thinner, so if in doubt choose the thinner size.</p>

<h2>Balance</h2>
<p><strong>Head heavy</strong> rackets carry more weight towards the head. They give more power on smashes and clears but are slower to bring back for defence. Good for singles and back-court doubles players.</p>
<p><strong>Head light</strong> rackets are quicker in the hand. They suit fast drives, net play and defence, and are common among front-court doubles players.</p>
<p><strong>Even balance</strong> rackets sit in between and are the safe choice if you play a bit of everything.</p>

<h2>Shaft flex</h2>
<p>A flexible shaft bends more during the swing and helps players with a slower or less developed swing get length. A stiff shaft gives more control and a faster response but needs good timing and a fast swing to work well. If you are unsure, choose medium flex.</p>

<h2>A simple starting point</h2>
<ul>
<li><strong>Beginner:</strong> 4U or 5U, flexible or medium shaft, any balance. Pre-strung rackets are fine.</li>
<li><strong>Intermediate club player:</strong> 4U, medium shaft. Head heavy if you like to attack, head light if you play mostly at the front.</li>
<li><strong>Advanced:</strong> 3U or 4U, stiff shaft, balance to suit your role.</li>
</ul>
<p>Not sure? Try the <a href="/racket-finder/">Racket Finder</a>, or come in and try demo rackets in the shop.</p>
`,
  },
  {
    slug: 'string-tension',
    title: 'String and tension',
    summary: 'What tension to choose, which strings we fit most, and how often to restring.',
    photo: 'Guide: racket on a stringing machine',
    body: `
<p>Higher tension gives more control and a crisper feel but a smaller sweet spot and less power on mistimed shots. Lower tension is more forgiving and gives more depth with less effort.</p>

<h2>Suggested tensions</h2>
<table class="spec">
<thead><tr><th>Player</th><th>Tension</th></tr></thead>
<tbody>
<tr><td>Beginner, recreational</td><td>18–21 lbs</td></tr>
<tr><td>Club player</td><td>21–24 lbs</td></tr>
<tr><td>League and county players</td><td>24–27 lbs</td></tr>
<tr><td>Advanced, strong technique</td><td>27 lbs and above</td></tr>
</tbody></table>
<p>Do not go above the maximum tension printed on the racket frame. Stringing above it can void the manufacturer's warranty.</p>

<h2>Which string</h2>
<ul>
<li><strong>Yonex BG65</strong> (0.70 mm): the most durable. Good default if you break strings often.</li>
<li><strong>Yonex BG80</strong> (0.68 mm): hard feel, strong repulsion, loud sound.</li>
<li><strong>Yonex Exbolt 63 / 65</strong>: thinner and livelier. Less durable.</li>
<li><strong>Yonex Aerobite</strong>: hybrid with thin crosses for more spin on net shots and cuts.</li>
</ul>
<p>Thinner strings give more repulsion and feel but break sooner.</p>

<h2 id="when">When to restring</h2>
<p>Strings lose tension from the day they are strung, whether or not you play. As a rough guide, restring as many times a year as you play per week. If you play three times a week, restring about three times a year. If the shuttle starts to feel dead off the strings, or you can see the strings have moved and notched, it is time.</p>
<p>We restring in the shop. See <a href="/restringing/">Restringing Service</a> for prices and turnaround.</p>
`,
  },
  {
    slug: 'shuttle-speeds',
    title: 'Shuttle speeds and feather or nylon',
    summary: 'How shuttle speed numbers work and when nylon makes more sense than feather.',
    photo: 'Guide: feather and nylon shuttles side by side',
    body: `
<h2 id="feather-nylon">Feather or nylon</h2>
<p>Feather shuttles fly the way the game is meant to be played and are used in league and tournament play. They break, so they cost more to run. Nylon shuttles last many times longer, which makes them the usual choice for schools, beginners, coaching and casual play.</p>

<h2>Feather speeds</h2>
<p>Shuttles fly faster in warm air and at altitude, so feather shuttles come in speeds. In the UK, 77, 78 and 79 are the usual choices.</p>
<table class="spec">
<thead><tr><th>Speed</th><th>Use in</th></tr></thead>
<tbody>
<tr><td>77</td><td>Warm halls</td></tr>
<tr><td>78</td><td>Most UK sports halls, most of the year</td></tr>
<tr><td>79</td><td>Cold halls, winter</td></tr>
</tbody></table>
<p>To test a shuttle, hit a full underarm clear from the back line. A correctly paced shuttle lands between 530 mm and 990 mm short of the opposite back line.</p>

<h2>Nylon speeds</h2>
<p>Yonex Mavis nylon shuttles use the colour of the band on the cork: green is slow, blue is medium and red is fast. Blue suits most UK halls.</p>
`,
  },
  {
    slug: 'shoe-sizing',
    title: 'Badminton shoe sizing',
    summary: 'How badminton shoes fit compared with trainers, and when to choose a wide fit.',
    photo: 'Guide: shoe on a foot measuring board',
    body: `
<p>Badminton shoes should fit closer than running shoes. You change direction hard, and a loose shoe lets your foot slide inside it.</p>
<h2>General sizing</h2>
<ul>
<li>Most players take their normal UK size.</li>
<li>Leave about a thumb's width between your longest toe and the end of the shoe.</li>
<li>If standard Yonex shoes pinch across the widest part of your foot, try the <a href="/shoes/?type=Wide%20fit">wide fit</a> version.</li>
<li>Victor shoes are generally a little roomier in the toe box than Yonex.</li>
</ul>
<h2>Try before you buy</h2>
<p>You can try any shoe on in our <a href="/visit-our-store/">${site.city} shop</a>. If you order online, unworn shoes can be returned within our returns window. Please try them on indoors on a clean floor.</p>
`,
  },
];

export const posts = [
  {
    slug: 'how-often-should-you-restring',
    title: 'How often should you restring your racket?',
    date: '2026-09-29', // [PLACEHOLDER] publish date
    summary: 'A simple rule of thumb, and the signs that your strings have gone dead.',
    photo: 'Blog: close-up of worn, notched racket strings',
    body: `
<p>The usual rule is to restring as many times a year as you play per week. Three sessions a week means three restrings a year.</p>
<p>Strings lose tension even when the racket sits in a bag. A racket strung at 24 lbs will be noticeably slacker after a few months.</p>
<h2>Signs it is time</h2>
<ul>
<li>The shuttle feels dead or travels less far for the same swing.</li>
<li>The strings have moved out of line and do not slide back.</li>
<li>You can see notches where the strings cross.</li>
</ul>
<p>Bring it in and we will check the tension and string for you. Details on our <a href="/restringing/">restringing page</a>.</p>
`,
  },
  {
    slug: 'feather-or-nylon-for-club-nights',
    title: 'Feather or nylon for club nights?',
    date: '2026-09-15', // [PLACEHOLDER]
    summary: 'What each costs to run per session, and when switching makes sense.',
    photo: 'Blog: tubes of feather and nylon shuttles on a club bench',
    body: `
<p>Most clubs end up using both: nylon for warm-ups, coaching and juniors, and feather for matches and league practice.</p>
<p>A tube of nylon shuttles can last a group several sessions. A tube of feathers may only last one busy evening, depending on the standard of play and the grade of shuttle.</p>
<p>If your club is thinking about switching, ask us about <a href="/trade-accounts/">trade pricing on dozen-tube boxes</a>.</p>
<p>See our <a href="/guides/shuttle-speeds/">shuttle speeds guide</a> for which speed to buy.</p>
`,
  },
  {
    slug: 'new-season-racket-arrivals',
    title: 'New season racket arrivals',
    date: '2026-09-02', // [PLACEHOLDER]
    summary: 'Rackets that have come into stock this month and who they suit.',
    photo: 'Blog: new rackets on the shop wall',
    body: `
<p>[PLACEHOLDER: Write a short note about the rackets that have just arrived, with links to their product pages.]</p>
<p>All new rackets can be strung before dispatch. Demo rackets are available in the shop for most models.</p>
<p><a href="/rackets/?sort=new">See all new rackets</a></p>
`,
  },
];

export const faqs = [
  ['Ordering', [
    ['How much is delivery?', `Standard UK delivery is ${money(site.standardDeliveryCost)}, or free on orders over ${money(site.freeDeliveryThreshold)}. Express delivery is ${money(site.expressDeliveryCost)}. Full details are on our <a href="/delivery/">delivery page</a>.`],
    ['When will my order be dispatched?', `${site.dispatchText}. Orders placed later, or at the weekend, go out the next working day.`],
    ['Can I collect from the shop?', 'Yes. Choose click and collect at checkout. We will email you when your order is ready, usually within [2] hours during opening times.'],
    ['Do you deliver outside the UK?', '[PLACEHOLDER: state whether you ship abroad and where.]'],
  ]],
  ['Rackets and stringing', [
    ['Do rackets come strung?', 'Most rackets above £[X] are sold unstrung. You can add stringing when you order and choose your string and tension. Rackets that come pre-strung from the factory say so on the product page.'],
    ['How long does restringing take?', `${site.restringTurnaround}. See the <a href="/restringing/">restringing page</a> for prices.`],
    ['What tension should I choose?', 'Most club players use 21–24 lbs. Our <a href="/guides/string-tension/">tension guide</a> has a table by level.'],
    ['Can I try a racket before buying?', 'Yes, we keep demo rackets in the shop for most models. Call ahead if you want to try a specific one.'],
  ]],
  ['Returns', [
    ['Can I return something?', `Yes, unused items can be returned within ${site.returnsDays} days of delivery. Strung rackets and printed teamwear cannot be returned unless faulty. See our <a href="/returns/">returns policy</a>.`],
    ['My racket broke. Is it covered?', 'Rackets are covered against manufacturing defects. Breaks caused by clashes, hitting the floor or stringing above the maximum tension are not. Bring it in or email a photo and we will check it.'],
  ]],
];
