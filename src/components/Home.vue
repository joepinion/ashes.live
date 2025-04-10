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
        <li>Purchase any deck you see, or <strong>create an account</strong> to build your own deck!</li>
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
        <li><a href="https://ashesdb-media.plaidhatgames.com/pdf/Ashes-Home-Print-The_Mist_Guardian.pdf" target="_blank" rel="noopener noreferrer">The Mist Guardian</a></li>
        <li><a href="https://ashesdb-media.plaidhatgames.com/pdf/Ashes-Home-Print-The_Iron_Men.pdf" target="_blank" rel="noopener noreferrer">The Men of Iron</a></li>
        <li><a href="https://ashesdb-media.plaidhatgames.com/pdf/Ashes-Home-Print-The_Bloodwoods_Queen.pdf" target="_blank" rel="noopener noreferrer">The Bloodwoods Queen</a></li>
        <li><a href="https://ashesdb-media.plaidhatgames.com/pdf/Ashes-Home-Print-The_Snakes_in_Silver.pdf" target="_blank" rel="noopener noreferrer">The Snakes in Silver</a></li>
        <li><a href="https://ashesdb-media.plaidhatgames.com/pdf/Ashes-Home-Print-The_Shadows_of_Viros.pdf" target="_blank" rel="noopener noreferrer">The Shadows of Viros</a></li>
        <li><a href="https://ashesdb-media.plaidhatgames.com/pdf/Ashes-Home-Print-The_Cloudsea_Siren.pdf" target="_blank" rel="noopener noreferrer">The Cloudsea Siren</a></li>
        <li><a href="https://ashesdb-media.plaidhatgames.com/pdf/Ashes-Home-Print-Dice-Reference-Cards.pdf" target="_blank" rel="noopener noreferrer">Dice Reference Cards</a></li>
        <li><a href="https://ashesdb-media.plaidhatgames.com/pdf/Ashes-Home-Print-Upgrade_Kit.pdf" target="_blank" rel="noopener noreferrer">Ashes 1.0 Upgrade Kit</a></li>
      </ul>
      <h2 class="my-4">Resources</h2>

      <ul class="list-disc pl-4">
        <li><a href="https://media.plaidhatgames.com/filer_public/23/15/23151a90-9295-4a82-87d0-970df6dc5f04/ashes_reborn_rulebook_final.pdf">Ashes Reborn Rules</a> <span class="text-gray">(PDF)</span></li>
        <li><a href="https://media.plaidhatgames.com/filer_public/fd/5b/fd5baa4b-67bf-4aef-8b3e-1788871eb06b/ashes_reborn-faq-version5-proof1.pdf">Ashes Reborn FAQ</a> <span class="text-gray">(PDF)</span></li>
        <li><a href="https://media.plaidhatgames.com/filer_public/0e/c9/0ec90e44-c48d-4f04-85e1-5afc34cd5d27/op_rules-version6.pdf">Ashes Reborn Organized Play Rules</a> <span class="text-gray">(PDF)</span></li>
        <li><a href="https://www.plaidhatgames.com/board-games/ashes-rise-phoenixborn/">...and more at PlaidHatGames.com</a></li>
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
