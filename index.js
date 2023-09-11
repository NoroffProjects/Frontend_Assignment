/*This file contains all javascript functions utilized in the index.html file.*/
function getALoan() {
    // Prompt the user to enter the size of the load they desire to take.
    let loanSize = prompt("Please enter the size of the load you wish to take.");
    if(loanSize === null) loanSize = 0;
    else loanSize = parseInt(loanSize.replace(".", "")); // Parse the loan size from string to an integer.

    // Get the balance and loan paragraph tag element from the document object model (DOM) by their unique id.
    const balanceAmount = document.getElementById("balance-amount");
    const loanAmount = document.getElementById("loan-amount");

    // Split the text by whitespace to separate the loan number from the currency and parse it to an integer. 
    // The Number occurs before the currency in the string therefore the number is at index 0.
    const balance = parseInt(balanceAmount.textContent.replace(".", ""));
    const currentLoan = parseInt(loanAmount.textContent.replace(".", ""));
    
    // Instantiate a NumberFormat object to format balance and loans by the currency passed to the constructor.
    const numberFormat = new Intl.NumberFormat(
        'dk-DK', 
        {style: 'currency', currency: 'DKK'}
    );
    
    // The user is not allowed to take a loan greater than twice their balance.
    // In this case the user must enter a new loan that follows the rule stated above.
    if(loanSize > 2 * balance){
        const newLoan = prompt(
            `You cannot enter a loan that is more than twice the size of your current balance: ${numberFormat.format(balance)}
             Please enter a smaller load.`);
        loanSize = parseInt(newLoan);
        console.log(`Loan Size:${loanSize}`);
    }
    // The entered loan gets added to the balance which becomes the text of the balance amount paragraph tag 
    // in the DOM by the currency of the number format.
    else if(loanSize <= 0){
        alert(`You must enter a loan size greater than zero. Please enter a new loan size.`);
    }
    
    // The user cannot get a new loan before repaying their current loan.
    // Nor can the user have multiple loans at once as their initial loan should be paid back in full first.
    if(currentLoan > 0){
        alert(`You currently have a loan of size: 
                ${numberFormat.format(currentLoan)}.
                Therefore, you must repay your current loan before you can take a new one.`)
    }
    else{
        balanceAmount.textContent = numberFormat.format(balance + loanSize);
        // The text of the loan amout paragraph tag is set to the entered loan size.
        loanAmount.textContent = numberFormat.format(loanSize);
        // Set the repay button to be visible.
        document.getElementById("repay-loan-button").style.visibility = 'visible';
    }  
}

// This method gets invoked when clicking the work button and increments the pay balance by 100.
function work() {
    // Get the pay-amount p tag element.
    const payAmount = document.getElementById("pay-amount");

    /* Parse the text content of the payAmount p tag element to an integer.
     * The text content of payAmount is always a number + dansih curreny.
       Thefore, any dots are replaced by empty string. 
       Thus, anything after the comma are disregarded.
     */
    const currentPay = parseInt(payAmount.textContent.replace(".", ""));

    // Set the text content of payAmount to the current pay balance incremented by 100.
    payAmount.textContent = new Intl.NumberFormat(
        'dk-DK', 
        {style: 'currency', currency: 'DKK'}
    ).format(currentPay + 100);
}

// This method gets invoked when clicking the bank button and transfers the pay balance to the bank account.
function transferSalaryToBankAccount(){
    let balanceAmount = document.getElementById("balance-amount");
    const payAmount = document.getElementById("pay-amount");
    let loanAmount = document.getElementById("loan-amount");
    let currentLoan = parseInt(loanAmount.textContent.replace(".", ""));

    let balance = parseInt(balanceAmount.textContent.replace(".", ""));
    let pay = currentPay = parseInt(payAmount.textContent.replace(".", ""));

    let numberFormat = new Intl.NumberFormat(
        'dk-DK', 
        {style: 'currency', currency: 'DKK'}
    );
        if(currentLoan > 0){
            loanAmount.textContent = numberFormat.format(currentLoan + pay*.1);
            balanceAmount.textContent = numberFormat.format(balance + pay*.9);
        }else{
            balanceAmount.textContent = numberFormat.format(balance + pay);
        }

    payAmount.textContent = numberFormat.format(0);
}

function repayLoan() {
    let balanceAmount = document.getElementById("balance-amount");
    let loanAmount = document.getElementById("loan-amount");
    const payAmount = document.getElementById("pay-amount");

    let balance = parseInt(balanceAmount.textContent.replace(".", ""));
    let currentLoan = parseInt(loanAmount.textContent.replace(".", ""));
    let pay = currentPay = parseInt(payAmount.textContent.replace(".", ""));

    let numberFormat = new Intl.NumberFormat(
        'dk-DK', 
        {style: 'currency', currency: 'DKK'}
    );
    
    let difference = pay-currentLoan;
    
    // If the current loan is greater than the pay amount then loan cannot be fully repaid yet.
    // Therefore, the current loan is set to the remaining difference between the current loan and the pay amount.
    if(difference >= 0){

        loanAmount.textContent = numberFormat.format(0);
        balanceAmount.textContent = numberFormat.format(balance + difference);
        document.getElementById("repay-loan-button").style.visibility = 'hidden';
    }
    // When the pay amount is greater than the current loan then the loan can be fully repaid and the repay loan button is hidden from the user.
    else{
        loanAmount.textContent = numberFormat.format(Math.abs(difference));
    }

    payAmount.textContent = numberFormat.format(0);
}

async function getLaptops() {
    let response = await fetch('https://hickory-quilled-actress.glitch.me/computers');
    return await response.json();
}

async function setLaptopSelectOptions(){
    let laptops = await getLaptops();
    if(laptops){
        let laptopSelect = document.getElementById('laptop-select');
        for(let laptop of laptops){
            let option = document.createElement('option');
            option.text = laptop.title;
            laptopSelect.add(option);
        }        
    } 
}

async function setLaptopElements(){
    /* Get laptop elements by their id.*/
    let laptopImage = document.getElementById('laptop-image');
    let laptopTitle = document.getElementById('laptop-title');
    let laptopDescription = document.getElementById('laptop-description');
    let laptopPrice = document.getElementById('laptop-price');
    let laptopFeatures = document.getElementById('laptop-features');

    // Get the selected laptop object from laptopSelect.
    let selectedLaptop = await getSelectedLaptop();

    // Set Laptop Elements
    laptopImage.src = `https://hickory-quilled-actress.glitch.me/${selectedLaptop.image}`;
    laptopTitle.textContent = selectedLaptop.title;
    laptopDescription.textContent = selectedLaptop.description;
    laptopFeatures.textContent = selectedLaptop.specs.join('\n');
    laptopPrice.textContent = new Intl.NumberFormat(
        'dk-DK', 
        {style: 'currency', currency: 'DKK'}
    ).format(selectedLaptop.price);
}

async function onLaptopChange(){
    await setLaptopElements();
}

async function getSelectedLaptop () {
    let laptopSelect =  document.getElementById('laptop-select');
    for(let laptop of await getLaptops()){
        if(laptopSelect.value === laptop.title){
            return laptop;
        }
    }
}

async function buyLaptop(){
    let balanceAmount = document.getElementById("balance-amount");
    let balance = parseInt(balanceAmount.textContent.replace(".", ""));
    let selectedLaptop = await getSelectedLaptop();
    if(balance >= selectedLaptop.price){
        balanceAmount.textContent = new Intl.NumberFormat(
            'dk-DK', 
            {style: 'currency', currency: 'DKK'}
        ).format(balance-selectedLaptop.price);
    }else{
        alert(`Your bank balance is:${balance} and the price of ${selectedLaptop.title} is: ${selectedLaptop.price}.
            \nTherefore, you cannot afford the laptop: ${selectedLaptop.title}.`);
    }
}