//To-Do List:
//fix floating point error, add something like BigNumber.js?

$(".btn-num").on("click", function() {
  var num = $(this).text();
  var allInput = $("#all-input").val();
  var newInput = $("#new-input").val();
  if (newInput.length > 13 || allInput.length > 28) {
    $("#all-input").val("");
    $("#new-input").val("limit reached");
  } else if (allInput === "0" || /\=/.test(allInput) || newInput === "limit reached") {
    $("#all-input").val(num);
    $("#new-input").val(num);
  } else if (/\+|\-|\×|\÷/.test(newInput)) {
    $("#all-input").val(allInput + num);
    $("#new-input").val(num);
    //newInput value becomes " 0" after pressing CE button
  } else if (newInput === " 0") {
    $("#all-input").val(allInput + num);
    var array = allInput.split(" ");
    $("#new-input").val(array[array.length - 1] + num);
  } else if (newInput !== "0") {
    $("#all-input").val(allInput + num);
    $("#new-input").val(newInput + num);
  }
});

$(".btn-operator").on("click", function() {
  var operator = $(this).text();
  var allInput = $("#all-input").val();
  var newInput = $("#new-input").val();
  if (/\=/.test(allInput)) {
    $("#all-input").val(newInput + " " + operator + " "); 
    $("#new-input").val(operator);
  } else if (allInput !== "0" && !/\s$|\.$/.test(allInput) && newInput !== "limit reached") {
    $("#all-input").val(allInput += " " + operator + " ");
    $("#new-input").val(operator);
  }
});

$("#btn-decimal").on("click", function() {
  var allInput = $("#all-input").val();
  var newInput = $("#new-input").val();
  if (!/\+|\-|\×|\÷|\./.test(newInput) && !/=$/.test(allInput)) {
    $("#all-input").val(allInput + '.');
    $("#new-input").val(newInput + '.');
  }
});

$("#btn-result").on("click", function() {
  var allInput = $("#all-input").val();
  var newInput = $("#new-input").val();
  if (!/=/.test(allInput) && !/\+|\-|\×|\÷|\.$/.test(newInput)) {
    var result = turnToPostfix(allInput);
    if (result[0].toString().length > 13) {
      var splitResult = result[0].toString().split(".");
      result = result[0].toFixed(13 - splitResult[0].length);
    }
    $("#all-input").val(allInput += " =");
    $("#new-input").val(result);
  }
});

var turnToPostfix = function(string) {
  var infix = string.split(" ");
  var postfix = [];
  var stack = [];
  for (var i = 0; i < infix.length; i++) {
    if (/\d/.test(infix[i])) {
      postfix.push(infix[i]);
    } else if (stack.length === 0) {
      stack.push(infix[i]);
    } else if (/\×|\//.test(infix[i]) && /\+|\-/.test(stack[stack.length - 1])) {
      stack.push(infix[i]);
    } else if (/\+|\-/.test(infix[i]) && /\×|\//.test(stack[stack.length - 1])) {
      postfix.push(stack.pop());
      i--;
    } else {
      postfix.push(stack.pop());
      stack.push(infix[i]);
    }
  }
  while (stack.length !== 0) {
   postfix.push(stack.pop());
  }
  return calculatePostfix(postfix);
};

var calculatePostfix = function(postfix) {
  var stack = [];
  for (var i = 0; i < postfix.length; i++) {
    if (/\d/.test(postfix[i])) {
      stack.push(postfix[i]);
    } else {
      var num1 = parseFloat(stack.pop());
      var num2 = parseFloat(stack.pop());
      if (postfix[i] === "×") {
        stack.push(num2 * num1);
      } else if (postfix[i] === "÷") {
        stack.push(num2 / num1);
      } else if (postfix[i] === "+") {
        stack.push(num2 + num1);
      } else if (postfix[i] === "-") {
        stack.push(num2 - num1);
      }
    }
  }
  return stack;
};

$("#btn-delete-all").on("click", function() {
  $("#all-input").val("0");
  $("#new-input").val("0");
});

$("#btn-delete-prev").on("click", function() {
  var newInput = $("#new-input").val();
  var allInput = $("#all-input").val();
  if (/=/.test(allInput)) {
    shorterInput = "0";
  } else if (/\s$/.test(allInput)) {
    var shorterInput = allInput.substring(0, allInput.length - 3);
  } else if ($("#all-input").val() !== "0") {
    //var array = allInput.split(" ");
    //array.pop();
    //var shorterInput = array.join(" ") + " ";
    var shorterInput = allInput.substring(0, allInput.length - 1);
  }
  if (shorterInput.length === 0 || shorterInput === " ") {
    $("#all-input").val("0");
    $("#new-input").val("0");
  } else {
    $("#all-input").val(shorterInput);
    $("#new-input").val(" 0");
  }
});