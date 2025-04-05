def es_palindromo(texto):
  """Comprueba si un texto dado es un palíndromo.

  Args:
      texto: El texto a comprobar si es palíndromo.

  Returns:
      True si el texto es un palíndromo, False en caso contrario.
  """

  # Elimina caracteres no alfanuméricos y convierte a minúsculas para evitar problemas con las mayúsculas
  texto_limpio = ''.join(caracter.lower() for caracter in texto if caracter.isalnum())


  # Comprueba si el texto limpio es igual al revés
  return texto_limpio == texto_limpio[::-1]

# Ejemplo de uso
texto = input("Ingresa una palabra o frase: ")

if es_palindromo(texto):
  print(f"{texto} es un palíndromo.")
else:
  print(f"{texto} no es un palíndromo.")
