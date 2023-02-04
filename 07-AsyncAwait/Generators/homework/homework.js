function* fizzBuzzGenerator(max) {
  // Tu código acá:

  
   let count = 1;
   while(max ? count <= max : true) {
      if (count % 3 === 0 && count % 5 === 0) yield "Fizz Buzz";
      if (count % 3 === 0) yield "Fizz";
      if (count % 5 === 0) yield "Buzz";
      else yield count;
      count++;

   } 
}

module.exports = fizzBuzzGenerator;
