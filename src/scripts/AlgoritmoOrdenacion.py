import time
from datetime import datetime
import random

#generador de numeros aleatorios del 1 al 9999 inclusive
numeros = [random.randint(1, 10000) for _ in range(10000)]

#Generador de marca de tiempo
ahora = datetime.now()
timestamp = ahora

#funcion para ordenar array
def ordena(data):
  

  size = len(numeros) #cofirmamos el tamaño del array
  
  #validamos si el tamaño del array es un numero par
  
  if size % 2 == 0:
    rango = int(size / 2) #Dividimos el tamaño del array a la mitad
    
    print(timestamp) #marca de tiempo
    
#iniciamos el loop
    
    #primera mitad
    for i in range(rango):
      menor = i
      for j in range(i + 1,rango):
        if numeros[i] > numeros[j]:
          menor = j
          numeros[i],numeros[menor] = numeros[menor], numeros[i]
    
    #Segunda mitad
    for h in range(rango,size):
      menor = h
      for l in range(h + 1,size):
        if numeros[h] > numeros[l]:
          menor = l
          numeros[h],numeros[menor] = numeros[menor], numeros[h]
    
    #Comparamos la primera mitad  con la segunda mitad hasta el final
    for m in range(rango):
      menor = m
      for n in range(rango,size):
        if numeros[m] > numeros[n]:
          menor = n
          numeros[m], numeros[menor] = numeros[menor],numeros[m]
    
    #Ordenamos la segunda mitad hasta el final
    for h in range(rango,size):
      menor = h
      for l in range(h + 1,size):
        if numeros[h] > numeros[l]:
          menor = l
          numeros[h],numeros[menor] = numeros[menor], numeros[h]
    
    #marca de tiempo
    despues = datetime.now()
    timestamp2 = despues
    print(timestamp2)
    
  else:
    #proceso para un array donde el tamaño es un numero impar
    size = size + 1
    rango = int(size / 2)
    
    #marca de tiempo
    print(timestamp)
    
    #primera mitad
    for i in range(rango):
      menor = i
      for j in range(i + 1,rango):
        if numeros[i] > numeros[j]:
          menor = j
          numeros[i],numeros[menor] = numeros[menor], numeros[i]
    
    #Segunda mitad
    for h in range(rango,size - 1) :
      menor = h
      for l in range(h + 1,size - 1):
        if numeros[h] > numeros[l]:
          menor = l
          numeros[h],numeros[menor] = numeros[menor], numeros[h]
    
    #Ordenamos de del incio al final
    for m in range(rango):
      menor = m
      for n in range(rango,size - 1):
        if numeros[m] > numeros[n]:
          menor = n
          numeros[m], numeros[menor] = numeros[menor],numeros[m]
    #Ordenamos de la segunda mitad al final
    for h in range(rango,size - 1):
      menor = h
      for l in range(h + 1,size - 1):
        if numeros[h] > numeros[l]:
          menor = l
          numeros[h],numeros[menor] = numeros[menor], numeros[h]
    
    #marca de tiempo
    despues = datetime.now()
    timestamp2 = despues
    print(timestamp2)
        
  return numeros
        
#llamada a la funcion
num = ordena(numeros)
print(num)


  
  

      
    