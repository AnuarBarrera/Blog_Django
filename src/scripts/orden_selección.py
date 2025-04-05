import time
from datetime import datetime
import random

numeros = [random.randint(1, 10000) for _ in range(10000)]

ahora = datetime.now()
timestamp = ahora

def ordena(data):

  size = len(numeros)
  
  print(timestamp)

  for h in range(size):
    menor = h
    for l in range(h + 1,size):
      if numeros[h] > numeros[l]:
        menor = l
        numeros[h],numeros[menor] = numeros[menor], numeros[h]
          
  despues = datetime.now()
  timestamp2 = despues
  print(timestamp2)
        
  return numeros
        

num = ordena(numeros)
print(num)


  