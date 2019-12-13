import{select, classNames, settings, templates} from './settings.js';
import utils from './utils.js';
import cartProduct from './CartProduct.js';

class Cart {
  constructor(element) {
    const thisCart = this;

    thisCart.products = [];

    thisCart.deliveryFee = settings.cart.defaultDeliveryFee;
    thisCart.getElements(element);
    thisCart.initActions(element);
  }

  getElements(element) {

    const thisCart = this;
    thisCart.dom = {};
    thisCart.dom.wrapper = element;
    thisCart.dom.toggleTrigger = thisCart.dom.wrapper.querySelector(select.cart.toggleTrigger);
    thisCart.dom.productList = thisCart.dom.wrapper.querySelector(select.cart.productList);
    thisCart.dom.form = thisCart.dom.wrapper.querySelector(select.cart.form);

    /* [NEW] current sums */
    thisCart.renderTotalsKeys = ['totalNumber', 'totalPrice', 'subtotalPrice', 'deliveryFee'];
    for(let key of thisCart.renderTotalsKeys) {
      thisCart.dom[key] = thisCart.dom.wrapper.querySelectorAll(select.cart[key]);
    }

  }
  // eslint-disable-next-line no-unused-vars
  initActions(element) {
    const thisCart = this;
    thisCart.dom.toggleTrigger.addEventListener('click', function(){
      thisCart.dom.wrapper.classList.toggle(classNames.cart.wrapperActive);
    });

    thisCart.dom.productList.addEventListener('updated', function(){
      thisCart.update();
    });

    thisCart.dom.productList.addEventListener('remove', function(event){
      thisCart.remove(event.detail.cartProduct);
    });
    thisCart.dom.form.addEventListener('submit', function(event){
      event.preventDefault();
      thisCart.sendOrder();
    });
  }

  sendOrder(){
    const thisCart = this;
    const url = settings.db.url + '/' + settings.db.order;
      
    const payload = {
      phone: thisCart.dom.inputPhone,
      adress: thisCart.dom.inputAddress,
      totalNumber: thisCart.totalNumber,
      subtotalPrice: thisCart.subtotalPrice,
      totalPrice: thisCart.totalPrice,
      deliveryFee: thisCart.deliveryFee,
      products : [],
    };

    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    };
    fetch(url, options)
      .then(function(response) {
        return response.json();
      }).then (function(parsedResponse){
        console.log('parsedResponse', parsedResponse);
      });
  }
  add(menuProduct) {
    const thisCart = this;
    /** generate HTML based on template */
    const generatedHTML = templates.cartProduct(menuProduct);
    const generatedDOM = utils.createDOMFromHTML(generatedHTML);
    thisCart.dom.productList.appendChild(generatedDOM);
    thisCart.products.push(new CartProduct(menuProduct, generatedDOM));
    thisCart.update();
  }
  update() {
    const thisCart = this;
    thisCart.totalNumber = 0;
    thisCart.subtotalPrice = 0;
    const cartProducts = thisCart.products;
    for(let cartProduct of cartProducts){
      thisCart.subtotalPrice += cartProduct.price;
      thisCart.totalNumber =+ cartProduct.amount;
    }
    thisCart.totalPrice = thisCart.subtotalPrice + thisCart.deliveryFee;
    for(let key of thisCart.renderTotalsKeys) {
      for(let elem of thisCart.dom[key]) {
        elem.innerHTML = thisCart[key];
      }

    }
  }

  remove(cartProduct) {
    const thisCart = this;
    // eslint-disable-next-line no-unused-vars
    const index = thisCart.products.indexOf(cartProduct);
    // eslint-disable-next-line no-unused-vars
    const removedElementIndex = thisCart.products.splice(index);

    cartProduct.dom.wrapper.remove();

    thisCart.update();
  }
}
export default Cart;