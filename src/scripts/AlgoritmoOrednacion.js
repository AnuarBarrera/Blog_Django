const num = [];
  for (let i = 0; i < 9999; i++) {
    num.push(Math.floor(Math.random() * 10000)); // Genera un número aleatorio entre 0 y 9999
  }

let size = num.length;
let half = size / 2

function ordena(nu){
  if (size % 2 == 0){

    for (let i = 0; i < half; i++){
      for (let j = i + 1; j < half; j++){
        if (nu[i] > nu[j]){
          [nu[j], nu[i]] = [nu[i], nu[j]]
          }
        }
      }
    
    for (let i = half; i < size; i++){
      for (let j = i + 1; j < size; j++){
        if (nu[i] > nu[j]){
          [nu[j], nu[i]] = [nu[i], nu[j]]
          }
        }
      }
    
    for (let i = 0; i < half; i++){
      for (let j = half; j < size; j++){
        if (nu[i] > nu[j]){
          [nu[j], nu[i]] = [nu[i], nu[j]]
          }
        }
      }
    
    for (let i = half; i < size; i++){
      for (let j = i + 1; j < size; j++){
        if (nu[i] > nu[j]){
          [nu[j], nu[i]] = [nu[i], nu[j]]
          }
        }
      }
      return nu;
      
    }else{
      
    size = size + 1
    half = size / 2
    
    for (let i = 0; i < half; i++){
      for (let j = i + 1; j < half; j++){
        if (nu[i] > nu[j]){
          [nu[j], nu[i]] = [nu[i], nu[j]]
          }
        }
      }
    
    for (let i = half; i < size - 1; i++){
      for (let j = i + 1; j < size - 1; j++){
        if (nu[i] > nu[j]){
          [nu[j], nu[i]] = [nu[i], nu[j]]
          }
        }
      }
    
    for (let i = 0; i < half; i++){
      for (let j = half; j < size - 1; j++){
        if (nu[i] > nu[j]){
          [nu[j], nu[i]] = [nu[i], nu[j]]
          }
        }
      }
    
    for (let i = half; i < size - 1; i++){
      for (let j = i + 1; j < size - 1; j++){
        if (nu[i] > nu[j]){
          [nu[j], nu[i]] = [nu[i], nu[j]]
          }
        }
      }
    return nu;
    }
  }

const call = ordena(num);
console.log(call)
