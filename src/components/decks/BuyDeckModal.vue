<template>
  <modal :open="open" @update:open="$emit('update:open', false)">
    <div class="flex sm:mx-auto items-start justify-center sm:w-96">
      <img :src="pbImgUrl" class="hidden sm:block w-auto mr-10 h-[90vh]" />
      <div class="sm:mx-auto flex flex-col items-center text-[#aaaaaa]">
        <h2 class="font-bold">Purchase This Deck</h2>
        <p class="text-[#aaaaaa] text-xs text-center italic mt-0 mb-3">Adding products to your cart will send you to our partner, ForgeFire, to complete the purchase.</p>
        <h3 class="text-xl">Cards</h3>
        <div class="mb-4" v-if="!this.hasDeckProduct">There are no card products available for this deck. It may be too large.</div>
        <div class="one-product flex items-start justify-center mb-2" v-for="product in this.productList(true, false)">
          <img :src="getImageForProduct(product)" class="h-[75px] mr-4 w-auto" />
          <div class="flex flex-col justify-center items-start font-bold">
            <div>{{ product.text }}</div>
            <div class="font-normal text-sm italic">{{ product.subtitle}}</div>
            <button @click="addProductToCart(product)" class="fancy-button mb-4 font-normal" :disabled="!product.available">
              <span v-if="product.available" class="text-[#1398c3]">${{ product.price }} - Add to Cart <i class="fas fa-cart-plus"></i></span>
              <span v-else  class="text-[#8c8c8c]">Coming Soon!</span>
            </button>
          </div>
        </div>
        <h3 class="text-xl">Dice</h3>
        <div class="one-product flex items-start justify-center mb-2" v-for="product in this.productList(false, true)">
          <div :class="['die', product.text, 'text-[40px]', `phg-${product.text}-power`, 'h-[60px]', 'w-[60px]', 'mr-4',]"></div>
          <div class="flex flex-col justify-center items-start font-bold">
            <div>{{ product.name }}</div>
            <button @click="addProductToCart(product)" class="fancy-button mb-4 font-normal" :disabled="!product.available">
              <span v-if="product.available" class="text-[#1398c3]">${{ product.price }} - Add to Cart <i class="fas fa-cart-plus"></i></span>
              <span v-else class="text-[#8c8c8c]">Currently Unavailable</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </modal>
</template>

<style>
  .fancy-button {
    background-image: url('/fancy-button.png');
    background-size: 100% 100%;
    background-color: none;
    height: 30px;
    width: 282px;
  }
</style>

<script>
import { useToast } from 'vue-toastification'
import InputButton from '../shared/InputButton.vue'
import Modal from '../shared/Modal.vue'
import Toggle from '../shared/Toggle.vue'
import { getPhoenixbornImageUrl } from '/src/utils/index.js'

export default {
  name: 'BuyDeckModal',
  props: {
    deck: {
      required: true,
    },
    products: {
      required: false,
    },
    open: Boolean,
  },
  components: {
    InputButton,
    Modal,
    Toggle,
  },
  setup () {
    return { toast: useToast() }
  },
  computed: {
    pbImgUrl() {
      return getPhoenixbornImageUrl(this.deck.phoenixborn.stub, true);
    },
    cardList() {
      let cards = [];
      cards.push(this.deck.phoenixborn.name);
      for(let one_card of this.deck.cards) {
        for(let i=0; i<one_card.count; i++) {
          cards.push(one_card.name);
        }
      }
      for(let one_card of this.deck.conjurations) {
        for(let i=0; i<one_card.count; i++) {
          cards.push(one_card.name);
        }
      }
      return cards;
    },
    diceCards() {
      let cards = [];
      for(let one_die of this.deck.dice.filter(d=>d.count>0)) {
        let ref_card = this.$products.DICE_REFERENCE_CARDS[one_die.name];
        if(ref_card && !cards.includes(ref_card)) {
          cards.push(ref_card);
        }
      }
      return cards;
    },
    hasDeckProduct() {
      return this.productList(true, false).length>0;
    },
  },
  methods: {
    getImageForProduct(product) {
      if(product.deck) {
        if(product.attributes.physical) {
          return `${location.protocol}//${location.host}/icon-pod.png`;
        }
        return `${location.protocol}//${location.host}/icon-printer.png`;
      }
    },
    productList(include_card=true, include_other=true) {
      let products = [];
      let cards = this.cardList;
      let has_dice_cards = false;
      let has_basic = false;
      let has_digital = false;
      let diceCards = this.diceCards;
      for(let one_product of this.$products.products) {
        if(one_product.deck) {
          if(!include_card) continue;
          if(cards.length<one_product.attributes.max) {
            if(cards.length+diceCards.length<one_product.attributes.max) {
              one_product.attributes.cards = [...cards, ...diceCards];
              if(one_product.attributes.physical) {
                if(!has_dice_cards) {
                  one_product.text = "Print on Demand";
                  one_product.subtitle = "Includes dice reference cards"
                  products.push(one_product);
                  has_dice_cards = true;
                }
              } else if(!has_digital) {
                one_product.text = "Print and Play Download";
                one_product.subtitle = "Includes dice reference cards"
                products.push(one_product);
                has_digital = true;
              }
            } else {
              one_product.attributes.cards = cards;
              if(one_product.attributes.physical && !has_basic) {
                one_product.text = "Print on Demand";
                one_product.subtitle = "No dice reference cards";
                has_basic = true;
                products.push(one_product);
              } else if(!has_digital) {
                one_product.text = "Print and Play Download";
                one_product.subtitle = "No dice reference cards";
                has_digital = true;
                products.push(one_product);
              }

            }
          }
        } else {
          if(!include_other) continue;
          let dice = this.deck.dice.filter(d=>d.count>0 && one_product.name.toLowerCase().includes(d.name))
          if(dice.length>0) {
            one_product.text = dice[0].name;
            products.push(one_product);
          }
        }
      }
      return products;
    },
    addProductToCart(product) {
      if(!product.available) return;
      let come_back = `${location.protocol}//${location.host}${this.$router.currentRoute.value.path}#buy`;
      if(product.deck) {
        this.$products.getLink(product.sku, {return_to: come_back, title: this.deck.title, cards: product.attributes.cards}).then(r=>{
          if(r.ok) {
            window.location.href = r.url;
          } else {
            this.toast.error(r.message);
          }
        })
      } else {
        this.$products.getLink(product.sku, {return_to: come_back,}).then(r=>{
          if(r.ok) {
            window.location.href = r.url;
          } else {
            this.toast.error(r.message);
          }
        })
      }
    },
  },
}
</script>
