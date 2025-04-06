export default class Cart {
    constructor() {
        const storedCart = localStorage.get('cart');
        this.items = storedCart ? JSON.parse(storedCart) : [];
    }

    addItem(item) {
        this.items.push(item);
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