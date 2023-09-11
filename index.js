/*This file contains all javascript functions utilized in the index.html file.*/

/*  Parsing text content of paragraph tag elemtent to an integer explanation.
    The text content always consists of a number plus danish currency. 
    Thefore, any dots are replaced by empty string when parsing the number to an integer. 
    Thus, anything after the comma are disregarded. 
    This way the comma is used as a delimiter instead of a dot when the number becomes greater than or equal to 1.000.
*/

/* Methods used in index.html */

function getALoan() {
    // Prompt the user to enter the size of the load they desire to take.
    let loanSize = prompt("Please enter the size of the load you wish to take.");
    if(loanSize === null) loanSize = 0;
    else loanSize = parseInt(loanSize.replace(".", "")); // Parse the loan size from string to an integer.
    console.log(`Loan:${loanSize}`);
    // Get the balance and loan paragraph tag element from the document object model (DOM) by their unique id.
    const balanceAmount = document.getElementById("balance-amount");
    const loanAmount = document.getElementById("loan-amount");

    // Parsing text content to an integer.
    const balance = parseInt(balanceAmount.textContent.replace(".", ""));
    const currentLoan = parseInt(loanAmount.textContent.replace(".", ""));
    
    // Instantiate a NumberFormat object to format balance and loans by the currency passed to the constructor.
    const numberFormat = new Intl.NumberFormat(
        'dk-DK', 
        {style: 'currency', currency: 'DKK'}
    );
    
    // The user is not allowed to take a loan greater than twice their balance.
    // In this case the user must enter a new loan that follows the rule stated above.
    while(loanSize > 2 * balance){
        const newLoan = prompt(
            `You cannot enter a loan that is more than twice the size of your current balance: ${numberFormat.format(balance)}
             Please enter a smaller load.`);
        // If the user cancels the prompt the function returns.
        if(newLoan === null) return;
        loanSize = parseInt(newLoan.replace(".", ""));
    }
    // The user is not allowed to enter a negative number as a loan.
    // Therefore, the user is continuely prompted to enter a number greater than 0.
    while(loanSize <= 0){
        const newLoan = prompt(`You must enter a loan size greater than zero. Please enter a new loan size.`);
        // If the user cancels the prompt the function returns.
        if(newLoan === null) return;
        loanSize = parseInt(newLoan.replace(".", ""));
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

     // Parsing text content to an integer.
    const currentPay = parseInt(payAmount.textContent.replace(".", ""));

    // Set the text content of payAmount to the current pay balance incremented by 100.
    payAmount.textContent = new Intl.NumberFormat(
        'dk-DK', 
        {style: 'currency', currency: 'DKK'}
    ).format(currentPay + 100);
}

// This method gets invoked when clicking the bank button and transfers the pay balance to the bank account.
function transferSalaryToBankAccount(){
    // Get balanceAmount, payAmount and loanAmount html elements by their id.
    const balanceAmount = document.getElementById("balance-amount");
    const payAmount = document.getElementById("pay-amount");
    const loanAmount = document.getElementById("loan-amount");

    // Parse text content to an integer.
    const currentLoan = parseInt(loanAmount.textContent.replace(".", ""));
    const balance = parseInt(balanceAmount.textContent.replace(".", ""));
    const pay = currentPay = parseInt(payAmount.textContent.replace(".", ""));
    
    // Instantiate a NumberFormat object to format balance and loans by the currency passed to the constructor.
    const numberFormat = new Intl.NumberFormat(
        'dk-DK', 
        {style: 'currency', currency: 'DKK'}
    );
    
    /*  If the current loan is greater than 0 
        then 10% of the pay balance goes to pay off the loan 
        and the rest is transfered to the bank balance.
        Otherwise, transfer the entire pay balance to the bank balance.
    */
    if(currentLoan > 0){
        // Compute the remainder after subtracting 10% of pay balance from loan.
        const remainder = currentLoan - pay*.1;

        /*  If the remainder is greater than 0 that means the loan cannot be fully repaid by the 10% of the pay balance.
            Therefore, the loan is set to the remainder and the bank balance is incremented by 90% of the pay balance.
            When the remainder is less than zero or equal zero then the loan can be fully repaid by the 10% of the pay balance 
            and the absolute value of the remainder can therefore be added to the bank balance. 
            This way the remainder after fully repaying the loan is not lost but added to the bank balance instead.
        */
        if(remainder > 0){
            loanAmount.textContent = numberFormat.format(remainder);
            balanceAmount.textContent = numberFormat.format(balance + pay*.9);
        }else{
            loanAmount.textContent = numberFormat.format(0);
            balanceAmount.textContent = numberFormat.format(balance + pay*.9 + Math.abs(remainder));
        }
    }else{
        balanceAmount.textContent = numberFormat.format(balance + pay);
    }

    // Set the pay balance to 0.
    payAmount.textContent = numberFormat.format(0);
}

// This method gets invoked when clicking the repay loan button and repays the loan based on the pay balance.
function repayLoan() {
    // Get balanceAmount, loanAmount and payAmount html elements by their id.
    const balanceAmount = document.getElementById("balance-amount");
    const loanAmount = document.getElementById("loan-amount");
    const payAmount = document.getElementById("pay-amount");

    // Parse text content to an integer.
    const balance = parseInt(balanceAmount.textContent.replace(".", ""));
    const currentLoan = parseInt(loanAmount.textContent.replace(".", ""));
    const pay = currentPay = parseInt(payAmount.textContent.replace(".", ""));

    // Instantiate a NumberFormat object to format balance and loans by the currency passed to the constructor.
    const numberFormat = new Intl.NumberFormat(
        'dk-DK', 
        {style: 'currency', currency: 'DKK'}
    );
    
    /*  If the pay balance is greater than the current loan then the loan can be fully repaid.  
     * 
    */
    if(pay > currentLoan){
        loanAmount.textContent = numberFormat.format(0);
        payAmount.textContent = numberFormat.format(pay-currentLoan);
        document.getElementById("repay-loan-button").style.visibility = 'hidden';
    }
    /*  When the difference between the pay then loan is less than zero then the diffence becomes a negative number.
        Since the difference refers to the part of the loan remaining to be repaid, 
        the absolute value of the difference is computed to remove the negative sign.
    */
    else{
        loanAmount.textContent = numberFormat.format(currentLoan-pay);
        payAmount.textContent = numberFormat.format(Math.abs(pay-currentLoan));
    }
    
}

// This method is invoked when the index.html page has been loaded and the method adds laptops to the laptop select element in the DOM.
async function setLaptopSelectOptions(){
    const laptops = await getLaptops(); // Get laptops as json object, see method definition at line 209.
    if(laptops){
        // Get the laptop select element by its id.
        const laptopSelect = document.getElementById('laptop-select');
        /* For each laptop object add a new option tag with the laptop title as option text.*/ 
        for(const laptop of laptops){
            const option = document.createElement('option');
            option.text = laptop.title;
            laptopSelect.add(option);
        }        
    } 
}

// This method is also invoked when the index.html page has been loaded. 
// The purpose of the method is to display the information of the selected laptop to the user.
async function setLaptopElements(){
    /* Get laptop elements by their id.*/
    const laptopImage = document.getElementById('laptop-image');
    const laptopTitle = document.getElementById('laptop-title');
    const laptopDescription = document.getElementById('laptop-description');
    const laptopPrice = document.getElementById('laptop-price');
    const laptopFeatures = document.getElementById('laptop-features');

    // Get the selected laptop object from laptopSelect.
    const selectedLaptop = await getSelectedLaptop(); // See method definiton at line 218.

    // Set Laptop Elements such as image, title, description, specs and price.
    // The source of the image is based on the same url concatenated with the image path of the selected laptop.
    laptopImage.src = `https://hickory-quilled-actress.glitch.me/${selectedLaptop.image}`; 
    laptopTitle.textContent = selectedLaptop.title;
    laptopDescription.textContent = selectedLaptop.description;
    laptopFeatures.textContent = selectedLaptop.specs.join('\n');
    laptopPrice.textContent = new Intl.NumberFormat(
        'dk-DK', 
        {style: 'currency', currency: 'DKK'}
    ).format(selectedLaptop.price);
}

// This method is invoked whenever a new laptop has been selected by the user.
async function onLaptopChanged(){
    await setLaptopElements();
}

// This method is invoked when clicking the buy a laptop button.
async function buyLaptop(){
    // Get balanceAmount html element by its id and parse it to an integer.
    const balanceAmount = document.getElementById("balance-amount");
    const balance = parseInt(balanceAmount.textContent.replace(".", ""));

    // Get the selected laptop object from laptopSelect.
    const selectedLaptop = await getSelectedLaptop(); // See method definiton at line 218.

    // If the bank balance is greater than or equal to the laptop price the purchase can be done.
    if(balance >= selectedLaptop.price){
        balanceAmount.textContent = new Intl.NumberFormat(
            'dk-DK', 
            {style: 'currency', currency: 'DKK'}
        ).format(balance-selectedLaptop.price);
    }
    // When the bank balance is below the laptop price the user receives an alaet message.
    else{
        alert(`Your bank balance is:${balance} and the price of ${selectedLaptop.title} is: ${selectedLaptop.price}.
            \nTherefore, you cannot afford the laptop: ${selectedLaptop.title}.`);
    }
}

/* Methods only used in index.js */

// This method asynchronously fetches all laptops from the url and returns a json object from the response.
async function getLaptops() {
    let response = await fetch('https://hickory-quilled-actress.glitch.me/computers');
    return await response.json();
}

/*  This method returns the laptop selected in the select element from the DOM.
    It is done by iterating through each laptop, 
    comparing the laptop title with the selected laptop and returning that laptop.*/
async function getSelectedLaptop () {
    let laptopSelect = document.getElementById('laptop-select');
    for(let laptop of await getLaptops()){
        if(laptopSelect.value === laptop.title){
            return laptop;
        }
    }
}