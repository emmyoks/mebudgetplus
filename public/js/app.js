
var budgetController = (function(){

    let Income = function(id, description, value){
        this.id = id;
        this.description = description;
        this.value = value;
    };
    let Expense = function(id, description, value){
        this.id = id;
        this.description = description;
        this.value = value;
        this.percentage = -1;
    };

    Expense.prototype.calcPercentage = function(totalInc){
        if(totalInc > 0 && totalInc > this.value){
            this.percentage = Math.round((this.value / totalInc)*100);
        }else{
            this.percentage = -1;
        }
    }
    let data = {
        allItems:{
            inc:[],
            exp:[]
        },
        total:{
            inc: 0,
            exp: 0
        },
        budget: 0,
        percentage: -1
    };
    function calculateTotal(type){
        let sum = 0;
        data.allItems[type].forEach(curr =>{
            sum += curr.value;
        })
        data.total[type] = sum;
    }

    return {
        addItem: function(type, desc, val){
            let ID, newItem;

            if(data.allItems[type].length > 0){
                ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
            }else{
                ID = 0;
            }

            if(type === 'inc'){
                newItem = new Income(ID, desc, val);
            }else if(type === 'exp'){
                newItem = new Expense(ID, desc, val);
            }
            data.allItems[type].push(newItem);
            return newItem;
        },
        calculateBudget: function(){
            calculateTotal('inc');
            calculateTotal('exp');

            data.budget = data.total.inc - data.total.exp;
            if(data.total.inc != 0 && data.total.inc > data.total.exp){
                data.percentage = Math.round((data.total.exp / data.total.inc) * 100);
            }else{
                data.percentage = -1;
            }
        },
        getBudget: function(){
            return{
                totalInc: data.total.inc,
                totalExp: data.total.exp,
                budget: data.budget,
                percentage: data.percentage
            }
        },
        deleteItem: function(type,itemId){
            let ids, index;
            ids = data.allItems[type].map(curr => {
               return curr.id
            })
            index = ids.indexOf(itemId);
            if(index !== -1){
                data.allItems[type].splice(index,1);
            }
        },
        getPercentages: function(){
            data.allItems.exp.forEach(curr => {
                curr.calcPercentage(data.total.inc);
            })
            let Percentages = data.allItems.exp.map(curr => {
                return curr.percentage
            })
            return Percentages
        },
        getData: function(){
            return data;
        },
        putData: function(incomingData){
            data = incomingData;
        }
    }
})()


let apiController = (function(){
    
    return{
        addToBudget:function(data){
            axios.post(`/api/add-to-budget/${userId}`, {
                'month_budget':data
            })
            .then((res) => {
                console.log(res);
            })
            .catch((err) => {
                console.log(err);
            })
        }
    }
})()


var uiController = (function(){

    let inputList;
    let DOMStrings = {
        settingsBtn:"#settings-btn",
        settingsportal:"#settings-portal",
        inputType: ".add-type",
        description: ".add-description",
        inputValue: ".add-value",
        addBtn: ".add-btn",
        incomeList: ".income-list",
        expensesList: ".expenses-list",
        budgetLabel: ".budget-value",
        incomeLabel: ".budget-income-value",
        expensesLabel:".budget-expenses-value",
        percentageLabel:".budget-expenses-percentage",
        itemContainer: ".wrapper",
        expPercent:".item-percentage",
        dateLabel:".budget-title-month",
        topContainer:".top"
    };
    inputList = document.querySelectorAll(DOMStrings.description + ',' + DOMStrings.inputValue);
    function numFormat(num){
        num = (num).toFixed(2);
        num = Intl.NumberFormat().format(num);
        return num
    }

    return {
        getInput: function(){
            return{
                getType: document.querySelector(DOMStrings.inputType).value,
                getDescription: document.querySelector(DOMStrings.description).value,
                getValue: parseFloat(document.querySelector(DOMStrings.inputValue).value)
            };
        },
        // Backend should do this this instead, so if a user needs to check the past month's budget
        // currentDate: function(){
        //     let now, month, year,months;
        //     now =  new Date();
        //     months = ["January", "Febuary", "March", "April", "May", "June", "July", "August"
        //     , "September", "October", "November", "December"];
        //     year = now.getFullYear();
        //     month = now.getMonth();
        //     month = months[month];
        //     document.querySelector(DOMStrings.dateLabel).textContent = month +' '+ year;
        // },
        insertItem: function(obj,type){
            let html,element;
            if(type === 'inc'){
                element = DOMStrings.incomeList;
                html = ` <div class="item clearfix" id="inc-${obj.id}"> <div class="item-description">${obj.description}</div>
                    <div class="right clearfix"> <div class="item-value">+ ${numFormat(obj.value)}</div>
                    ${curr?'<div class="item-delete"><button class="fas fa-times item-delete-btn"></button> </div>':''}
                     </div> </div>`;
            }else if(type === 'exp'){
                element = DOMStrings.expensesList;
                html = `<div class="item clearfix" id="exp-${obj.id}"> <div class="item-description">${obj.description}</div>
                    <div class="right clearfix"> <div class="item-value">- ${numFormat(obj.value)}</div>
                    <div class="item-percentage">${obj.percentage}</div> 
                    ${curr?'<div class="item-delete"><button class="fas fa-times item-delete-btn"></button> </div>':''} 
                    </div> </div>`
            }
            document.querySelector(element).insertAdjacentHTML('beforeend',html);
        },
        clearInputs: function(){
            //  can convert the list to an array with:
            //  let arr = Array.prototype.slice.call(inputList)
            // But i dont see why i shoud do that, Since list has all the needed prototype
            inputList.forEach((curr)=>{
                curr.value = "";
                inputList[0].focus();
            })
        },
        moveFocus: function(x){
            // This will later be used in the app controller to switch focus when the user click the enter key
            inputList[x].focus();
        },
        deleteItem: function(ID){
            let element = document.getElementById(ID);
            element.parentNode.removeChild(element);
        },
        getDOMStrings: function(){
            return DOMStrings;
        },
        displayBudget: function(obj){

            document.querySelector(DOMStrings.budgetLabel).textContent = numFormat(obj.budget);
            document.querySelector(DOMStrings.incomeLabel).textContent = "+ " + numFormat(obj.totalInc);
            document.querySelector(DOMStrings.expensesLabel).textContent = "- " + numFormat(obj.totalExp);

            if(obj.percentage > 0){
                document.querySelector(DOMStrings.percentageLabel).textContent = obj.percentage + "%";
            }else{
                document.querySelector(DOMStrings.percentageLabel).textContent = "---";
            }
        },
        typeChange: function(){
            let doc;
            doc = document.querySelectorAll(DOMStrings.inputType + ','
            + DOMStrings.description + ',' + DOMStrings.inputValue);
            doc.forEach(curr => {
                curr.classList.toggle('red-focus');
            });
            document.querySelector(DOMStrings.addBtn).classList.toggle('red');
        },
        displayPercentage: function(perc){
            let nodeList,i=0;
            nodeList = document.querySelectorAll(DOMStrings.expPercent);
            nodeList.forEach(curr=> {
                if(perc[i] > 0){
                    curr.textContent = perc[i] + ' %';
                }else {
                    curr.textContent = "---";
                }
                i++;
            })
        },
        randomBackImage: function(){
            let randomNum;
            randomNum = (Math.floor(Math.random()*3) + 1);
            Dom = document.querySelector(DOMStrings.topContainer);
            Dom.style.backgroundImage = `linear-gradient(rgba(0, 0, 0, 0.35), rgba(0, 0, 0, 0.35)), url('${abs_url}/images/bg${randomNum}.jpeg')`;
        }
    }

})()


var appController = (function(budget,ui,api){
    let DOMStrings = ui.getDOMStrings();
    
    // Updating Budget
    function updateBudget(){
        budget.calculateBudget();
        let budgetData = budget.getBudget();
        ui.displayBudget(budgetData);
        ui.randomBackImage();
    }
    // Updating Expense item percentage
    function updateExpPercentage(){
       let percentages = budget.getPercentages();
       ui.displayPercentage(percentages);
    }

    // Getting items from the ui and returning result to the ui
    function addItems(){
        let input, newItem;
        input = ui.getInput();

        if(input.getDescription !== "" && isNaN(input.getValue)){
            ui.moveFocus(1)
        }else if(input.getDescription !== "" && !isNaN(input.getValue) && input.getValue > 0){
            newItem = budget.addItem(input.getType, input.getDescription, input.getValue);
            ui.insertItem(newItem, input.getType);
            ui.clearInputs();
            updateBudget();
            updateExpPercentage();
            api.addToBudget(JSON.stringify(budget.getData()));
        }

    }
    function deleteItem(e){
        let itemID,splitID,ID, type;
        itemID = e.target.parentNode.parentNode.parentNode.id;
        if(itemID){
            splitID = itemID.split('-');
            type = splitID[0];
            ID = parseInt(splitID[1]);
            budget.deleteItem(type,ID);
            ui.deleteItem(itemID);
            updateBudget();
            updateExpPercentage();
            api.addToBudget(JSON.stringify(budget.getData()));
        }
    }
    // EventListeners
    if(curr){
        document.querySelector(DOMStrings.itemContainer).addEventListener('click', deleteItem)
        // Keypress and addBtn Click.
        document.querySelector(DOMStrings.addBtn).addEventListener('click',addItems);
        document.addEventListener('keypress', e =>{
            if(e.key === "Enter"){
                addItems()
            }
        })
        document.querySelector(DOMStrings.inputType).addEventListener('change',ui.typeChange)
    }

    return{
        init:function(){
            // ui.currentDate();
            if(dbData){
                // budget.putData(dbData);
                // updateBudget();
                dbData.allItems.inc.forEach(obj => {
                    newItem = budget.addItem("inc", obj.description, obj.value);
                    ui.insertItem(newItem, "inc");
                    updateBudget();
                    updateExpPercentage();
                });
                dbData.allItems.exp.forEach(obj => {
                    newItem = budget.addItem("exp", obj.description, obj.value);
                    ui.insertItem(newItem, "exp");
                    updateBudget();
                    updateExpPercentage();
                });
            }else{
                ui.displayBudget({
                    totalInc: 0,
                    totalExp: 0,
                    budget: 0,
                    percentage: -1
                });
            }
            console.log(budget.getData());
            ui.randomBackImage();

        }
    }
})(budgetController, uiController, apiController)

appController.init();