const apiKey = "bff7c42e23685d87414acd19";
const baseApiUrl = `https://v6.exchangerate-api.com/v6/${apiKey}/latest/`;  // API base URL

// HTML element references
const dropdownSelect = document.querySelectorAll(".dropdown select");
const btn = document.querySelector("form button");
const from = document.querySelector(".from select");
const to = document.querySelector(".to select");
const message = document.querySelector(".message");

window.addEventListener("load", () => {
    populateDropdowns();
    updateExchangeRate();
});

// Populate dropdown options
function populateDropdowns() {
    for (let select of dropdownSelect) {  
        for (let code in countryList) {
            let newOpt = document.createElement("option");
            newOpt.innerText = code;
            newOpt.value = code;
            if (select.name === "from" && code === "USD") {
                newOpt.selected = "selected";
            } else if (select.name === "to" && code === "INR") {
                newOpt.selected = "selected";
            }
            select.append(newOpt);
        }

        select.addEventListener("change", (evt) => {
            updateFlag(evt.target);
        });
    }
}

// Function to update the country flag
const updateFlag = (element) => {
    let code = element.value;
    let country = countryList[code];
    let newLink = `https://flagsapi.com/${country}/flat/64.png`;
    let img = element.parentElement.querySelector("img");
    img.src = newLink;
};

// Event listener for the conversion button
btn.addEventListener("click", (evt) => {
    evt.preventDefault();
    updateExchangeRate();
});

// Function to update the exchange rate and display result
const updateExchangeRate = async () => {
    let amt = document.querySelector(".amount input");
    let amtVal = amt.value;
    if (amtVal === "" || amtVal < 1) {
        amtVal = 1;
        amt.value = "1";
    }

    const fromCurrency = from.value;
    const toCurrency = to.value;

    try {
        // Fetch exchange rate data
        const response = await fetch(`${baseApiUrl}${fromCurrency}`);
        const data = await response.json();

        // Check if data is received successfully
        if (data && data.conversion_rates && data.conversion_rates[toCurrency]) {
            let rate = data.conversion_rates[toCurrency];
            let finalAmt = amtVal * rate;
            message.innerText = `${amtVal} ${fromCurrency} = ${finalAmt.toFixed(2)} ${toCurrency}`;
        } else {
            message.innerText = "Error fetching exchange rate data.";
            console.error("API response did not contain expected data structure.", data);
        }
    } catch (error) {
        console.error("Error fetching exchange rate:", error);
        message.innerText = "Error fetching exchange rate. Please try again later.";
    }
};
