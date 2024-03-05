//Implement your code here to make it a functional shopping website
// products promise

// class 

class product {
    static create_product_card = function (prod) {
        let prod_card_div = document.createElement("div");
        prod_card_div.setAttribute("data-product-id", prod.id);
        prod_card_div.classList.add("product");
        prod_card_div.innerHTML =
            `<div class="img_con">
                <button class="prev"><i class="fa-solid fa-backward"></i></button>
                <div><img src="${prod.images[0]}" data-img-idx="0"></div>
                <button class="next"><i class="fa-solid fa-forward"></i></button>
            </div>
            <div class="card_footer">
                <h3>${prod.title}</h3>
                <h4>Price :$ ${prod.price}</h4>
                <button class="addToCartBtn">
                    <i class="fa-solid fa-cart-shopping"></i>
                    <span class="txt">Add to cart</span>
                </button>
                
            </div>
            `;
        return prod_card_div;
    };
    static add_navig_btn_listeners = function (prod) {
        let prod_card_div = document.querySelector(`div.product[data-product-id="${prod.id}"]`);
        let img_el = prod_card_div.querySelector("img");
        let next_btn = prod_card_div.querySelector("button.next");
        let prod_images = prod.images;

        next_btn.addEventListener("click", (e) => {
            let curr_img_idx = Number(img_el.getAttribute("data-img-idx"));
            curr_img_idx++;
            if (curr_img_idx == prod_images.length) {
                curr_img_idx = 0;
            }

            img_el.setAttribute("src", prod_images[curr_img_idx]);
            img_el.setAttribute("data-img-idx", curr_img_idx);
        });

        let prev_btn = prod_card_div.querySelector("button.prev");

        prev_btn.addEventListener("click", (e) => {
            let curr_img_idx = Number(img_el.getAttribute("data-img-idx"));
            curr_img_idx--;
            if (curr_img_idx < 0) {
                curr_img_idx = prod_images.length - 1;
            }

            img_el.setAttribute("src", prod_images[curr_img_idx]);
            img_el.setAttribute("data-img-idx", curr_img_idx);
            console.log(curr_img_idx);
        });
        ;
    }

    static add_quantity_listeners = function (prod) {
        let inp_el = prod.querySelector("div.quantity input");

        let btn_incr = prod.querySelector("div.quantity button.increment");
        btn_incr.addEventListener("click", (e) => {
            inp_el.stepUp();
        });
        let btn_decr = prod.querySelector("div.quantity button.decrement");
        btn_decr.addEventListener("click", (e) => {
            if (inp_el.value > 0) {
                inp_el.stepDown();
            }
        });
    }

    static attach_add_to_cart_listener = function (prod_el, prod_obj) {
        let counter = 0;
        let btn_add_to_cart = prod_el.querySelector("button.addToCartBtn");
        let btn_txt_add_to_cart = btn_add_to_cart.querySelector("span.txt");
        let cart_div_ul_el = document.querySelector("div.cart ul");
        // let cart_div_el = document.querySelector("div#cart");
        let tbl_el = document.querySelector("table.cart-table");
        btn_add_to_cart.addEventListener("click", (e) => {
            counter++;
            if (counter % 2 == 1) {
                // adding product 
                btn_txt_add_to_cart.textContent = "Remove";

                let new_tbl_row = document.createElement("tr");
                new_tbl_row.setAttribute("data-product-id", prod_obj.id);
                new_tbl_row.innerHTML =
                    `<td>${prod_obj.title}</td>
                    <td class="prod_unit_price">${prod_obj.price}</td>
                    <td><button class="subtract">-</button> <input type="number" value="1"> <button class="add">+</button></td>
                    <td class="prod_total_price">${prod_obj.price}</td>
                    <td><button class="remove">Remove</button></td>`;
                tbl_el.appendChild(new_tbl_row);
                cart.add_quantity_listeners(new_tbl_row);
                cart.add_remove_btn_listener(new_tbl_row);
                /*
                let new_li_el = document.createElement("li");
                new_li_el.setAttribute("data-product-id", prod_obj.id);
                new_li_el.innerHTML =
                    `<div>${prod_obj.title}</div>
                    <div>${prod_obj.price}</div>
                    <div class="quant"><button>-</button> <input type="number"> <button>+</button></div>
                    <div>0</div>`;
                // new_li_el.innerHTML =
                //     `<span class="title">${prod_obj.title}</span>&emsp; 
                //     Price: <span class="price">${prod_obj.price}</span>&emsp;
                //     Quantity: <button>-</button> <input type="number"> <button>+</button>`;

                cart_div_ul_el.appendChild(new_li_el);
                */

            } else {
                // removing product
                cart_div_ul_el.querySelector(`li[data-product-id="${prod_obj.id}"]`).remove();
                btn_txt_add_to_cart.textContent = `Add to cart`;

            }
        });
    };
}

async function fill_products() {
    let prod_prom = await fetch("https://dummyjson.com/products");
    let json_resp = await prod_prom.json();
    let products = json_resp.products;
    let prod_container_div = document.querySelector("div.products");
    for (let prod of products) {
        let prod_card_div = product.create_product_card(prod);

        prod_container_div.appendChild(prod_card_div);
        product.add_navig_btn_listeners(prod);
        // product.add_quantity_listeners(prod_card_div);
        product.attach_add_to_cart_listener(prod_card_div, prod);
    }
}



document.addEventListener("DOMContentLoaded", fill_products);



class cart {
    // clicked = 0;
    static add_remove_btn_listener(table_row_el) {
        let remove_btn = table_row_el.querySelector("button.remove");
        remove_btn.addEventListener("click", (e) => {
            table_row_el.remove();
        });
    }
    static add_quantity_listeners(table_row_el) {
        let inp_el = table_row_el.querySelector("input");
        let prod_unit_p_td_el = table_row_el.querySelector("td.prod_unit_price");
        let prod_unit_p = Number(prod_unit_p_td_el.textContent.trim());
        // product total price td element
        let prod_tot_p_td_el = table_row_el.querySelector("td.prod_total_price");
        let prod_tot_p = Number(prod_tot_p_td_el.textContent.trim());
        table_row_el.querySelector("button.add").addEventListener("click", (e) => {
            inp_el.stepUp();

            prod_tot_p_td_el.textContent = prod_unit_p * inp_el.value;
        });

        table_row_el.querySelector("button.subtract").addEventListener("click", (e) => {
            if (inp_el.value >= 1) {
                inp_el.stepDown();

                prod_tot_p_td_el.textContent = prod_unit_p * inp_el.value;
            }
        });
    }
    static add_to_cart() {
        // this.clicked++;
        // console.log(this.clicked);
        let clicked = 0;

        let cart_btn_el = document.querySelector("button#cartBtn");
        let cart_div_el = document.querySelector("div#cart");
        let prods_el = document.querySelector("div.products");
        // let 
        cart_btn_el.addEventListener("click", (e) => {
            clicked++;
            console.log("cnt is", clicked);
            if (clicked % 2 == 1) {
                prods_el.style.display = "none";
                cart_div_el.style.display = "initial";
            } else {
                prods_el.style.display = "flex";
                cart_div_el.style.display = "none";
            }
        });

    }


}

cart.add_to_cart();



let fin_price = 0;
document.querySelector("button#checkoutBtn").addEventListener("click", (e) => {
    // alert("Your total price is ");
    let all_tot_prices = document.querySelectorAll("td.prod_total_price");



    for (let p of all_tot_prices) {
        fin_price += Number(p.textContent);
    }
    alert(`Your total price is ${fin_price}`);
})