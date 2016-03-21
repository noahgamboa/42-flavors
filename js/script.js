(function(window, document, undefined) {
  /* loops over each flavor in function */
  function forEachFlavor(functionToDo) {
    var container = document.getElementById('container');
    var flavors = container.getElementsByClassName('flavor');
    for(var i = 0; i < flavors.length; i++)
    {
	functionToDo(flavors[i]);
    }
  }
  /* Sets a random integer quantity in range [1, 20] for each flavor. */
  function setQuantities() {
    forEachFlavor(function(flavor) {
	var title = flavor.getElementsByTagName('div')[0];
	var span = document.createElement('span');
	var numLeft = Math.floor(Math.random() * 20);
	span.className = "numLeft";
	span.innerHTML = numLeft; 
	title.insertBefore(span, title.childNodes[0]);
    });
  }
  /* Extracts and returns an array of flavor objects based on data in the DOM. Each
   * flavor object should contain five properties:
   *
   * element: the HTMLElement that corresponds to the .flavor div in the DOM
   * name: the name of the flavor
   * description: the description of the flavor
   * price: how much the flavor costs
   * quantity: how many cups of the flavor are available
   */
  function extractFlavors() {
    var flaveArr = [];
    forEachFlavor( function(flavor) {
	flaveArr[flaveArr.length] = flavor;
    });
    flaveArr = flaveArr.map(function(flavor){
	return {
		element: flavor, 
		name: flavor.querySelector('.description h2').textContent,
		description: flavor.querySelector('.description p').textContent,
		price: flavor.querySelector('.meta .price').textContent,
		quantity: flavor.querySelector('.meta .numLeft').textContent,
	}
    });
    return flaveArr;
  }

  /* Calculates and returns the average price of the given set of flavors. The
   * average should be rounded to two decimal places. */
  function calculateAveragePrice(flavors) {
    var sum = 0;
    flavors.forEach(function(flavor)
    {
	    sum+= parseFloat(flavor.price.replace('$', ''));
    });
    return (sum/flavors.length).toFixed(2);
  }

  /* Finds flavors that have prices below the given threshold. Returns an array
   * of strings, each of the form "[flavor] costs $[price]". There should be
   * one string for each cheap flavor. */
  function findCheapFlavors(flavors, threshold) {
    var cheapFlavs = [];
    flavors.forEach(function(flavor) {
    	var price = parseFloat(flavor.price.replace('$', ''));
	if( price < threshold )
    	{
    	    var toAdd = flavor.name + " costs " + flavor.price;
	    cheapFlavs[cheapFlavs.length] = toAdd;
	}    
    });
    return cheapFlavs;
  }

  /* Populates the select dropdown with options. There should be one option tag
   * for each of the given flavors. */
  function populateOptions(flavors) {
    var flavChoices = document.querySelector('#footer select[name="flavor"]');
    var i = 0;
    flavors.forEach(function(flavor) {
	var newOp = document.createElement('option');
	newOp.innerHTML = flavor.name;
	newOp.value = i++;
	flavChoices.insertBefore(newOp);
    });
  }
  function addEventListenerToSubmit(flavors, addEventFunc) {
    var select = document.querySelector('#footer input[type="submit"]');
    select.addEventListener("click", function(event) {
	event.preventDefault();
	var input = document.querySelector('#footer select[name="flavor"]'); 
	var flavor = flavors[input.value];
	var flavElem = flavor.element;
	addEventFunc(flavor, flavElem);
    });
  }
  /* Processes orders for the given set of flavors. When a valid order is made,
   * decrements the quantity of the associated flavor. */
  function processOrders(flavors) {
    addEventListenerToSubmit(flavors, function(flavor, flavElem) {
  	var amount = document.querySelector('#footer input[name="amount"]').value; 
	if(flavor.quantity - amount >= 0) {
	    flavor.quantity -= amount;
	    flavElem.querySelector('.numLeft').innerHTML = flavor.quantity;
    	} else
	    console.log("invalid number entered, not enough " + flavor.name);
    });
  }
 

  /* Highlights flavors when clicked to make a simple favoriting system. */
  function highlightFlavors(flavors) {
    flavors.forEach(function(flavor) {
	var flavElem = flavor.element;
	flavElem.addEventListener("click", function(event) {
	if(!flavElem.classList.contains("highlighted")) 
	    flavElem.classList.add("highlighted");
    	else flavElem.classList.remove("highlighted");
    })});
  }


  /***************************************************************************/
  /*                                                                         */
  /* Please do not modify code below this line, but feel free to examine it. */
  /*                                                                         */
  /***************************************************************************/


  var CHEAP_PRICE_THRESHOLD = 1.50;

  // setting quantities can modify the size of flavor divs, so apply the grid
  // layout *after* quantities have been set.
  setQuantities();
  var container = document.getElementById('container');
  new Masonry(container, { itemSelector: '.flavor' });

  // calculate statistics about flavors
  var flavors = extractFlavors();
  var averagePrice = calculateAveragePrice(flavors);
  console.log('Average price:', averagePrice);

  var cheapFlavors = findCheapFlavors(flavors, CHEAP_PRICE_THRESHOLD);
  console.log('Cheap flavors:', cheapFlavors);

  // handle flavor orders and highlighting
  populateOptions(flavors);
  processOrders(flavors);
  highlightFlavors(flavors);

})(window, document);
