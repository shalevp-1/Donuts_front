export const donutsArr = [
   /*  {
        "id": 1,
        "name": "Chocolate Glazed Donut",
        "description": "A classic donut with a rich chocolate glaze.",
        "price": 2.50,
        "ingredients": ["Flour", "Sugar", "Cocoa Powder", "Eggs", "Milk", "Vanilla", "Oil"],
        "calories": 300,
        "image": "https://as2.ftcdn.net/v2/jpg/05/86/80/05/1000_F_586800532_PoQCQdfn5fvrLz1r5mPmgxUvJE3hW8wq.jpg"
    },
    {
        "id": 2,
        "name": "Double Chocolate Donut",
        "description": "A decadent chocolate donut with chocolate chips.",
        "price": 3.00,
        "ingredients": ["Flour", "Sugar", "Cocoa Powder", "Eggs", "Milk", "Vanilla", "Oil", "Chocolate Chips"],
        "calories": 350,
        "image": "https://images.pexels.com/photos/33066207/pexels-photo-33066207.jpeg?cs=srgb&dl=pexels-buselliyy-33066207.jpg&fm=jpg"
    },
    {
        "id": 3,
        "name": "Chocolate Filled Donut",
        "description": "A chocolate-filled donut with a creamy chocolate center.",
        "price": 2.75,
        "ingredients": ["Flour", "Sugar", "Cocoa Powder", "Eggs", "Milk", "Vanilla", "Oil", "Chocolate Filling"],
        "calories": 320,
        "image": "https://www.windmillbakery.co.uk/ProductImages/Triple-Choc-Donut.jpg"
    },
    {
        "id": 4,
        "name": "Sprinkled Chocolate Donut",
        "description": "A chocolate donut covered in colorful sprinkles.",
        "price": 2.25,
        "ingredients": ["Flour", "Sugar", "Cocoa Powder", "Eggs", "Milk", "Vanilla", "Oil", "Sprinkles"],
        "calories": 280,
        "image": "https://delightfuladventures.com/wp-content/uploads/2022/09/vegan-chocolate-donuts-recipe.jpg"
    },
    {
        "id": 5,
        "name": "Chocolate Coconut Donut",
        "description": "A tropical twist on a chocolate donut with shredded coconut.",
        "price": 2.90,
        "ingredients": ["Flour", "Sugar", "Cocoa Powder", "Eggs", "Milk", "Vanilla", "Oil", "Shredded Coconut"],
        "calories": 330,
        "image": "https://thedonutking.com/wp-content/uploads/2020/07/Chocolate-Coconut.jpg"
    },
    {
        "id": 6,
        "name": "Chocolate Caramel Donut",
        "description": "A delightful combination of chocolate and caramel drizzle.",
        "price": 2.85,
        "ingredients": ["Flour", "Sugar", "Cocoa Powder", "Eggs", "Milk", "Vanilla", "Oil", "Caramel Drizzle"],
        "calories": 310,
        "image": "https://joanne-eatswellwithothers.com/wp-content/uploads/2020/12/Salted-Caramel-and-Chocolate-Glazed-Doughnuts.jpg"
    },
    {
        "id": 7,
        "name": "Chocolate Mint Donut",
        "description": "A refreshing chocolate donut with a hint of mint flavor.",
        "price": 2.75,
        "ingredients": ["Flour", "Sugar", "Cocoa Powder", "Eggs", "Milk", "Vanilla", "Oil", "Mint Extract"],
        "calories": 290,
        "image": "https://healthyhacks.net/wp-content/uploads/2017/03/Vegan-Mint-Chocolate-Chip-Donuts-2-683x1024.jpg"
    },
    {
        "id": 8,
        "name": "Dark Chocolate Donut",
        "description": "A rich and indulgent dark chocolate donut for the true chocolate lover.",
        "price": 3.25,
        "ingredients": ["Flour", "Sugar", "Dark Cocoa Powder", "Eggs", "Milk", "Vanilla", "Oil"],
        "calories": 360,
        "image": "https://www.howsweeteats.com/wp-content/uploads/2018/05/donuts-10-350x350.jpg"
    },
    {
        "id": 9,
        "name": "White Chocolate Donut",
        "description": "A sweet and creamy white chocolate donut with white chocolate drizzle.",
        "price": 2.95,
        "ingredients": ["Flour", "Sugar", "Eggs", "Milk", "Vanilla", "Oil", "White Chocolate Drizzle"],
        "calories": 320,
        "image": "https://i.pinimg.com/originals/63/3c/bf/633cbfa41483da96b18f362d6016fb68.jpg"
    },
    {
        "id": 10,
        "name": "Chocolate Peanut Butter Donut",
        "description": "A heavenly combination of chocolate and peanut butter.",
        "price": 3.10,
        "ingredients": ["Flour", "Sugar", "Cocoa Powder", "Eggs", "Milk", "Vanilla", "Oil", "Peanut Butter"],
        "calories": 340,
        "image": "https://food-fanatic-res.cloudinary.com/iu/s--VD2zweGg--/c_thumb,f_auto,g_auto,h_1200,q_auto,w_1200/v1426442980/baked-peanut-butter-chocolate-donuts-photo"
    },
    {
        "id": 11,
        "name": "Chocolate Raspberry Donut",
        "description": "A delightful fusion of chocolate and raspberry flavors.",
        "price": 2.95,
        "ingredients": ["Flour", "Sugar", "Cocoa Powder", "Eggs", "Milk", "Vanilla", "Oil", "Raspberry Jam"],
        "calories": 330,
        "image": "https://kristineskitchenblog.com/wp-content/uploads/2015/01/Chocolate-Raspberry-Donuts-6776.jpg"
    },
    {
        "id": 12,
        "name": "Chocolate Hazelnut Donut",
        "description": "A nutty and chocolatey delight with hazelnut spread.",
        "price": 3.20,
        "ingredients": ["Flour", "Sugar", "Cocoa Powder", "Eggs", "Milk", "Vanilla", "Oil", "Hazelnut Spread"],
        "calories": 350,
        "image": "https://www.krispykreme.co.nz/media/catalog/product/k/r/krispy-kreme-choc-hazelnut-side.jpg?optimize=medium&fit=bounds&height=&width=&canvas=:"
    },
    {
        "id": 13,
        "name": "Blueberry Glazed Donut",
        "description": "A fluffy donut with a sweet blueberry glaze.",
        "price": 2.75,
        "ingredients": ["Flour", "Sugar", "Blueberries", "Eggs", "Milk", "Vanilla", "Oil"],
        "calories": 280,
        "image": "https://thesweetestoccasion.com/wp-content/uploads/2016/04/Vanilla-Bean-Donuts-with-Blueberry-Glaze-13-720x720.jpg"
    },
    {
        "id": 14,
        "name": "Maple Donut",
        "description": "A unique combination of maple syrup on a donut.",
        "price": 3.50,
        "ingredients": ["Flour", "Sugar", "Maple Syrup", "Eggs", "Milk", "Vanilla", "Oil"],
        "calories": 380,
        "image": "https://thecozyapron.com/wp-content/uploads/2019/10/maple-donuts_thecozyapron_1.jpg"
    },
    {
        "id": 15,
        "name": "Strawberry Cream Donut",
        "description": "A creamy strawberry-filled donut with strawberry glaze.",
        "price": 2.90,
        "ingredients": ["Flour", "Sugar", "Strawberry Filling", "Eggs", "Milk", "Vanilla", "Oil"],
        "calories": 310,
        "image": "https://betterwithcake.com/wp-content/uploads/IMG_6551....jpg"
    },
    {
        "id": 16,
        "name": "Lemon Poppyseed Donut",
        "description": "A zesty lemon-flavored donut with poppyseeds.",
        "price": 2.60,
        "ingredients": ["Flour", "Sugar", "Lemon Zest", "Poppyseeds", "Eggs", "Milk", "Vanilla", "Oil"],
        "calories": 270,
        "image": "https://www.thecomfortofcooking.com/wp-content/uploads/2014/06/1.jpg"
    },
    {
        "id": 17,
        "name": "Pistachio Donut",
        "description": "A delightful pistachio-flavored donut with crushed pistachios.",
        "price": 3.15,
        "ingredients": ["Flour", "Sugar", "Pistachios", "Eggs", "Milk", "Vanilla", "Oil"],
        "calories": 320,
        "image": "https://images.services.kitchenstories.io/_LQblJ54vUraE9vo5Vzcpl0RgCQ=/3840x0/filters:quality(85)/images.kitchenstories.io/recipeImages/RP16_02_13_doughnuts_4x3.jpg"
    }
 */
];
