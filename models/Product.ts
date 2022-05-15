const collection = 'Product'
export default class Product {
    id: string;
    name: string;
    description: string;
    price: string;
    image: string;
    promotion: string;
    constructor(id: any = undefined, name: any = undefined, description: any = undefined, price: any = undefined, promotion: any = undefined,image: any = undefined) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.price = price;
        this.image = image;
        this.promotion = promotion;
    }
}