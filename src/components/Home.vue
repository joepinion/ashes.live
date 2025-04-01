<template>
  <div class="sm:flex flex-wrap">
    <div class="sm:pr-8 pb-8 sm:w-2/3">
      <h1>The power of deckbuilding like never before.</h1>

      <p>As Ashes Reborn ascends to the next phase, we're making it the most player-friendly card game on the planet. This website lets you build and purchase any deck to be printed and shipped, or downloaded for print-and-play.</p>

      <h2>Purchasing Decks</h2>
      <ul class="list-disc pl-6 mb-4">
        <li>Decks must be <strong>complete and legal</strong> to be purchased.</li>
        <li>Printed and shipped decks are <strong>$19.95</strong> for up to 52 cards, or $24.95 for 53-70 cards (plus shipping).</li>
        <li>Dice reference cards are <strong>automatically included</strong> if they fit within the card count.</li>
        <li><strong>Dice</strong> can be added to your cart in sets of 5.</li>
        <li>Print-and-play <strong>PDF purchases are on the way soon.</strong> In the meantime, we've got 6 pre-constructed decks you can download for free.</li>
        <li>Purchases are completed at the website of our partner, <strong>ForgeFire</strong>.</li>
        <li><strong>Create an account</strong> to build your own deck, or purchase any deck you see!</li>
      </ul>

      <h2>Ashes.live</h2>
      <p>This deckbuilder is a fork from the excellent Ashes.live fan deckbuilder. For the sake of user privacy, accounts there are separate. We're working behind the scenes on a feature to import your decks from ashes.live for those who wish.</p>


    </div>
    <div class="sm:w-1/3 bg-[#e6e6e6] box-border p-4 border-l-solid border-l-[2px] border-l-white border-r-solid border-r-[2px] border-r-white relative -mt-4">
      <h2>Discord</h2>
      <p><a target="_blank" rel="noopener noreferrer" href="https://discord.gg/UU5bduq">Join the Ashes Reborn Discord community</a></p>
      <h2>6 Free Print-and-Play Decks</h2>

      <p>Professionally printed decks can be bought TODAY, while print-and-play purchases aren't quite ready yet. But we are offering 6 free Ashes Reborn print-and-play PDF decks you can download and print for free!</p>
      <ul class="list-disc pl-6">
        <li>The Mist Guardian (links go here)</li>
        <li>The Men of Iron</li>
        <li>The Bloodwoods Queen</li>
        <li>The Snakes in Silver</li>
        <li>The Shadows of Viros</li>
        <li>The Cloudsea Siren</li>
      </ul>
      <h2 class="my-4">Resources</h2>

      <ul class="list-disc pl-4">
        <li><a :href="getCDNURL('/files/ashes-reborn-rules.pdf')">Ashes Reborn Rules</a> <span class="text-gray">(PDF)</span></li>
        <li><a :href="getCDNURL('/files/ashes-reborn-faq.pdf')">Ashes Reborn FAQ</a> <span class="text-gray">(PDF)</span></li>
        <li><a :href="getCDNURL('/files/ashes-reborn-op-rules.pdf')">Ashes Reborn Organized Play Rules</a> <span class="text-gray">(PDF)</span></li>
        <li><a :href="getCDNURL('/files/ashes-red-rains-rules.pdf')">Ashes Red Rains Rules</a> or <a :href="getCDNURL('/files/ashes-red-rains-combined-rules.pdf')">Exhaustive Red Rains Rules</a> <span class="text-gray">(PDF)</span></li>
        <li>Dice reference cards:
          <div class="text-2xl mt-1">
            <a class="die ceremonial phg-ceremonial-power py-1 px-2" :href="getCDNURL('/images/cards/ceremonial-magic.jpg')" target="_blank"><span class="alt-text">Ceremonial Magic</span></a>
            <a class="die charm phg-charm-power py-1 px-2" :href="getCDNURL('/images/cards/charm-magic.jpg')" target="_blank"><span class="alt-text">Charm Magic</span></a>
            <a class="die illusion phg-illusion-power py-1 px-2" :href="getCDNURL('/images/cards/illusion-magic.jpg')" target="_blank"><span class="alt-text">Illusion Magic</span></a>
            <a class="die natural phg-natural-power py-1 px-2" :href="getCDNURL('/images/cards/natural-magic.jpg')" target="_blank"><span class="alt-text">Natural Magic</span></a>
            <a class="die divine phg-divine-power py-1 px-2" :href="getCDNURL('/images/cards/divine-magic.jpg')" target="_blank"><span class="alt-text">Divine Magic</span></a>
            <a class="die sympathy phg-sympathy-power py-1 px-2" :href="getCDNURL('/images/cards/sympathy-magic.jpg')" target="_blank"><span class="alt-text">Sympathy Magic</span></a>
            <a class="die time phg-time-power py-1 px-2" :href="getCDNURL('/images/cards/time-magic.jpg')" target="_blank"><span class="alt-text">Time Magic</span></a>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Home',
  computed: {
    apiURL () {
      return import.meta.env.VITE_API_URL
    },
    cdnURL() {
      return import.meta.env.VITE_CDN_URL
    },
  },
  methods: {
    getCDNURL(path) {
      return this.cdnURL + path
    },
  },
}
</script>
