/*
* Kod för webbshop, av Mattias Dahlgren, MIUN
* E-post: mattias.dahlgren@miun.se
* OBS: Denna kod får ej användas utanför projektuppgifter för kursen DT163G, Digital bildbehandling för webb
* Denna information måste lämnas oförändrad
* Har du gjort ändringar i denna fil ska detta beskrivas här i sidhuvudet.
* 
* Ändringar gjorda: 
Ändrade från ":-" till "$" eftersom webbutikens priser är skrivna med dollar.
Översatt till engelska.
*
*/

const basketEl = document.getElementById("basket"); // Varukorgen i DOM
const smallBasketEl = document.getElementById("small-basket"); // Liten varukorg med endast antal och summa
const checkoutEl = document.getElementById("checkout"); // Kassan
const checkoutInlineEl = document.getElementsByClassName("checkout-inline"); // Checka-ut-inline (array)
const checkoutButtonEl = document.getElementsByClassName("checkout-button"); // Checka-ut-knappar (array)
const itemsInBasketEl = document.getElementsByClassName("items-in-basket"); // Antal varor i varukorgen
const totalSumEl = document.getElementsByClassName("total-sum"); // Total-summa
const notifyEl = document.getElementById("notify"); // Meddelande-element då vara lagts i varukorgen

window.addEventListener("load", showBasket, false);         // Visa varukorg vid start
window.addEventListener("load", showSmallBasket, false);    // Visa liten varukorg
window.addEventListener("load", showCheckout, false);       // Gå till betalning/utcheckning

/* Lägg till i varukorg */
function addToBasket(el, id, name, cost, image, notify = false) {

    // Börja med en vara
    numOfItems = 1;

    // Sätt en klass på anropande class
    el.classList.add("clicked");

    // Läs in listan
    var currentBasket = JSON.parse(localStorage.getItem("basket"));

    if (currentBasket == null) { currentBasket = []; }

    // Kontrollera om varan redan finns
    for (var i = 0; i < currentBasket.length; i++) {
        if (id == currentBasket[i].artId) {
            numOfItems = currentBasket[i].nums + 1;
            currentBasket.splice(i, 1);
        }
    }

    // Lägg till
    currentBasket.push({ artId: id, artName: name, artCost: cost, artImage: image, nums: numOfItems });

    // Konvertera till JSON
    var jsonStr = JSON.stringify(currentBasket);
    // Lagra
    localStorage.setItem("basket", jsonStr);

    // Meddela användare, om notify = true
    if (notify == true) {
        var timer = null;

        if (document.getElementById("notify")) {
            var notifyText = "<p>The item <b>" + name + "</b> has been added to your bag</p>";
            // Sätt klass för att visa
            notifyEl.classList.add("visible");
            notifyEl.innerHTML = notifyText;
            // Skapa en timer
            window.clearTimeout(timer);
            timer = window.setTimeout(function () {
                // Sätt klass för att visa
                notifyEl.classList.remove("visible");
            }, 3000);
        }
    }

    // Uppdatera DOM
    showBasket();
    showSmallBasket();
    showCheckout();
}

/* Visa varukorg */
function showBasket() {
    // Läs in varukorg
    var basketItems = JSON.parse(localStorage.getItem("basket"));
    if (basketItems == null) { basketItems = []; }

    // Visa "Visa kassan"-inline-element
    if (basketItems.length > 0) {
        if (document.getElementsByClassName("checkout-inline")) {
            for (var i = 0; i < checkoutInlineEl.length; i++) {
                checkoutInlineEl[i].style.display = "inline";
            }
        }
    }

    var sum = 0;
    var numOfItems = 0;
    // Utskrift av totalsumma och antal
    if (basketItems.length > 0) {

        // Loopa genom varor
        for (var i = 0; i < basketItems.length; i++) {
            // Räkna ut kostnad och lägg till summa
            var itemCost = parseInt(basketItems[i].artCost);

            // Flera varor av samma typ - addera kostnaden * antal
            if (basketItems[i].nums > 1) {
                var count = parseInt(basketItems[i].nums);
                for (var j = 0; j < count; j++) {
                    sum += itemCost;
                    numOfItems++;
                }
            } else {
                sum += itemCost;
                numOfItems++;
            }
        }
    } else {
        // Dölj "Visa kassan"-knappar
        if (document.getElementsByClassName("checkout-button")) {
            for (var i = 0; i < checkoutButtonEl.length; i++) {
                checkoutButtonEl[i].style.display = "none";
            }
        }
    }
    // Visa antal
    if (document.getElementsByClassName("items-in-basket")) {
        for (var i = 0; i < itemsInBasketEl.length; i++) {
            itemsInBasketEl[i].innerHTML = numOfItems;
        }
    }

    // Visa totalsumma
    if (document.getElementsByClassName("total-sum")) {
        for (var i = 0; i < totalSumEl.length; i++) {
            totalSumEl[i].innerHTML = sum + "$";
        }
    }

    if (document.getElementById("basket")) {

        // Nollställ
        basketEl.innerHTML = "";

        if (basketItems.length > 0) {
            var sum = 0;
            var numOfItems = 0;

            // Loopa genom varor
            for (var i = 0; i < basketItems.length; i++) {
                // Räkna ut kostnad och lägg till summa
                var itemCost = parseInt(basketItems[i].artCost);

                // Flera varor av samma typ - addera kostnaden * antal
                if (basketItems[i].nums > 1) {
                    var count = parseInt(basketItems[i].nums);
                    for (var j = 0; j < count; j++) {
                        sum += itemCost;
                        numOfItems++;
                    }
                } else {
                    sum += itemCost;
                    numOfItems++;
                }

                // Skapa nytt element
                var newItem = document.createElement("li");

                // Varunamn
                var newItemName = document.createElement("span");
                newItemName.className = "item-text";
                var newItemNameText = document.createTextNode(basketItems[i].artName + ", ");
                newItemName.appendChild(newItemNameText);
                newItem.appendChild(newItemName);

                // Antal
                var newItemCount = document.createElement("span");
                newItemCount.className = "item-count";
                var newItemCountText = document.createTextNode(basketItems[i].nums + " st ");
                newItemCount.appendChild(newItemCountText);
                newItem.appendChild(newItemCount);

                // Varupris
                var newItemCost = document.createElement("span");
                newItemCost.className = "item-cost";
                var newItemCostText = document.createTextNode(itemCost + "$");
                newItemCost.appendChild(newItemCostText);
                newItem.appendChild(newItemCost);

                // Lägg till i DOM
                basketEl.appendChild(newItem);
            }
            // Lägg till summan sist
            var newItem = document.createElement("li");
            newItem.className = "sum";
            var newItemText = document.createTextNode("Total: " + sum + "$");
            newItem.appendChild(newItemText);

            // Lägg till i DOM
            basketEl.appendChild(newItem);

            // Visa "Visa kassan"-knappar
            if (document.getElementsByClassName("checkout-button")) {
                for (var i = 0; i < checkoutButtonEl.length; i++) {
                    checkoutButtonEl[i].style.display = "block";
                }
            }
        } else {
            // Tomt i listan
            basket.innerHTML = "<li>Your bag is empty</li>";

            // Dölj "Visa kassan"-knappar
            if (document.getElementsByClassName("checkout-button")) {
                for (var i = 0; i < checkoutButtonEl.length; i++) {
                    checkoutButtonEl[i].style.display = "none";
                }
            }
        }
    }
}

/* Liten varukorg */
function showSmallBasket() {
    if (document.getElementById("small-basket")) {
        var basketItems = JSON.parse(localStorage.getItem("basket"));

        if (basketItems == null) { basketItems = []; }

        if (basketItems.length > 0) {
            // Räkna ut totalsumma
            var sum = 0;
            var numOfItems = 0;

            // Loopa genom varor
            for (var i = 0; i < basketItems.length; i++) {
                // Räkna ut kostnad och lägg till summa
                var itemCost = parseInt(basketItems[i].artCost);

                // Flera varor av samma typ - addera kostnaden * antal
                if (basketItems[i].nums > 1) {
                    var count = parseInt(basketItems[i].nums);
                    for (var j = 0; j < count; j++) {
                        sum += itemCost;
                        numOfItems++;
                    }
                } else {
                    sum += itemCost;
                    numOfItems++;
                }
            }
            smallBasketEl.innerHTML = numOfItems + "st, " + sum + "$";

            // Visa antal
            if (document.getElementsByClassName("items-in-basket")) {
                for (var i = 0; i < itemsInBasketEl.length; i++) {
                    itemsInBasketEl[i].innerHTML = numOfItems;
                }
            }
        } else {
            smallBasketEl.innerHTML = "";
        }
    }
}

/* Visa kassan */
function showCheckout() {
    if (document.getElementById("checkout")) {
        var basketItems = JSON.parse(localStorage.getItem("basket"));
        if (basketItems == null) { basketItems = []; }

        // Nollställ
        checkoutEl.innerHTML = "";

        if (basketItems.length > 0) {
            // Räkna ut totalsumma
            var sum = 0;

            // Loopa genom varor
            for (var i = 0; i < basketItems.length; i++) {
                // Räkna ut kostnad och lägg till summa
                var itemCost = parseInt(basketItems[i].artCost);
                var itemSumCost = 0;

                // Flera varor av samma typ - addera kostnaden * antal
                if (basketItems[i].nums > 1) {
                    var count = parseInt(basketItems[i].nums);
                    for (var j = 0; j < count; j++) {
                        sum += itemCost;
                        itemSumCost += itemCost;
                    }
                } else {
                    sum += itemCost;
                    itemSumCost = itemCost;
                }

                var artId = basketItems[i].artId;
                var artName = basketItems[i].artName;
                var numItems = basketItems[i].nums;
                var artImage = basketItems[i].artImage;

                // Skapa nytt element
                checkoutEl.innerHTML += "<tr>" +
                    "<td><img src='" + artImage + "' alt='Productimage for " + artName + "' />" +
                    "<td>" + artId + "</td>" +
                    "<td>" + artName + "</td>" +
                    "<td>" + numItems + " st.</td>" +
                    "<td>" + itemSumCost + "$</td>" +
                    "</tr>";
            }

            // Lägg till summan sist
            checkoutEl.innerHTML += "<tr>" +
                "<td colspan='5' class='checkout-sum'>Total: " + sum + "$</td>";

        } else {
            // Tomt i listan
            checkoutEl.innerHTML = "<tr><td colspan='5'>Your bag is empty</td></tr>";
        }
    }
}

/* Till kassan */
function checkoutBasket() {
    var basketItems = JSON.parse(localStorage.getItem("basket"));
    if (basketItems != null) {
        var itemCount = 0;
        var totalSum = 0;

        for (var i = 0; i < basketItems.length; i++) {
            var count = parseInt(basketItems[i].nums);
            for (var j = 0; j < count; j++) {
                totalSum += parseInt(basketItems[i].artCost);
                itemCount++;
            }
        }

        if (itemCount == 1) {
            alert("Your order has been recieved! 1 item - total cost: " + totalSum + "$");
        } else {
            alert("Your order has been recieved! " + itemCount + " items - total cost: " + totalSum + "$");
        }

        // Tom varukorgen
        emptyBasket(false);

    } else {
        alert("There are no items in your bag!");
    }
}

/* Töm varukorg */
function emptyBasket(conf = true) {
    if (conf == true) {
        if (confirm("Are you sure you want to clear all items?")) {
            localStorage.removeItem("basket");
            showBasket();
            showSmallBasket();
            showCheckout();
        } else {
            return;
        }
    } else {
        localStorage.removeItem("basket");
        showBasket();
        showSmallBasket();
        showCheckout();
    }
}