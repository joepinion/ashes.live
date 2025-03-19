import AshesPodLinkGenerator from 'ashes-pod-link-generator';

export default {
  install(app, options) {
    // configure the app
    app.config.globalProperties.$products = {
      products: null,
      getLink: AshesPodLinkGenerator.getLink,
      DICE_REFERENCE_CARDS: AshesPodLinkGenerator.DICE_REFERENCE_CARDS,
    }
    AshesPodLinkGenerator.getProducts().then(r=>{
      if(r.ok) {
        app.config.globalProperties.$products.products = r.products;
      } else {
        app.config.globalProperties.$products.products = [];
      }
    });
  }
}