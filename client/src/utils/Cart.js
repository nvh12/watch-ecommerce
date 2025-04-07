export default class Cart {
    constructor() {
        const storedCart = localStorage.get('cart');
        this.items = storedCart ? JSON.parse(storedCart) : [];
    }

    addItem(item) {
        const inCart = this.items.find(item => item.id === product.id);
        if (inCart) {
            inCart.quantity++;
        } else {
            this.items.push({...item, quantity: 1});
        }
        this.save();
    }

    removeItem(item) {
        this.items = this.items.filter(item => item.id !== id);
        this.save();
    }

    clear() {
        this.items = [];
        this.save();
    }

    getTotal() {
        return this.items.reduce((total, item) => total + item.price * item.quantity, 0);
    }

    save() {
        sessionStorage.setItem('car', JSON.stringify(this.items));
    }
}