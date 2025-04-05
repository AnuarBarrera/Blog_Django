#readmy CalculadoraDeNutricion is un algoritm what calculate the content protein, sugar and fats have the product.

#Class Usuario show interface the usuario
import os

class Usuario():
  
  def messageWelcome(self):
    print ("Welcome to Calculadora De Nutricion\nI will help to calculate the content\nwhit Proteins, Sugar and fat from any product\nYou get into some data\nfor know the nutrimental value from the product")
  
  #Entrance Information
  def inputInformation(self):
    return input("you write the count from grams the sample, grams wiht product, sugar, protein and fats in that order and separated with comma (ejem: 100,150,80, etc")
    
  #Exit Information
  def showResult(self,resultSugar,resultProtein,resultFat):
    print(f"The count from sugar is {resultSugar:.2f}, from protein {resultProtein:.2f} and fats {resultFat:.2f}")
  
#Class TransformData is one implementation between the entrence information and el process data in CalculadoraDeNutricion
class TransformData():
  
  def transformateList(self,data):
    
    #Charge exception
    try:
      """ 
      exeption what asses the elements into the list, if some elements not is interger or floar, show the message and kill the app
      """
      dataList = [float(x) for x in data.split(",")]
      return dataList
    except ValueError:
      print("Some elements not is Number, Exit app")
      os._exit(0) #exit app
   
  
  def transform(self,data,number):
    
    #charge exeption
    """
    exeption what asses the count elemnts into list, if is minor 5 elements, show message and kill app
    """
    try:
      
      value = 0
      
      for i in range(0,5):
        if i == number:
          value = data[i]
      return value
    
    except IndexError:
      print("You was entered minor count elements request, or, you was used point in place to comma. Exit app")
      os._exit(0) #exit app
    
#class CalculadoraDeNutricion is the backend from application
class CalculadoraDeNutricion():
 
  #Calculations
  def calculate(self,sample,portion,incognit):
    return (portion * incognit) / sample

#call the start app
startApp = Usuario()
startApp.messageWelcome()
dataUsurio = startApp.inputInformation()

#call transformate data
transfomData = TransformData()
informationList = transfomData.transformateList(dataUsurio)

#charge the variables
sample = transfomData.transform(informationList,0)
portion = transfomData.transform(informationList,1)
sugar = transfomData.transform(informationList,2)
protein = transfomData.transform(informationList,3)
fat = transfomData.transform(informationList,4)

#calculus, processing data
result = CalculadoraDeNutricion()
resultSugar = result.calculate(sample,portion,sugar)
resultProtein = result.calculate(sample,portion,protein)
resultFat = result.calculate(sample,portion,fat)

#show results
startApp.showResult(resultSugar,resultProtein,resultFat)
