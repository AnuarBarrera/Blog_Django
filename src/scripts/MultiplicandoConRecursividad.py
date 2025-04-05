multiplicando =  int(input("ingresa un numero"))
multiplicador = int(input("ingresa un numero"))

def multi(multiplicando,multiplicador):
    if multiplicador == 0:
      return 0
    else:
      return multiplicando + multi(multiplicando,multiplicador - 1)

call = multi(multiplicando,multiplicador)

print(f"El producto de {multiplicando} y {multiplicador} es: {call}")